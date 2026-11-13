/**
 * CRYPTIC Atlas mission funding policy.
 * Deterministic allocation of externally verified, settled mining proceeds.
 * This module does not mine, hold keys, submit transactions, or move funds.
 */
export const FUNDING_POLICY_VERSION = "cryptic.atlas.mission-funding.v1";

export const MISSION_WEIGHTS_BPS = Object.freeze({
  food_security: 3500,
  economic_inclusion: 2000,
  resource_coordination: 1500,
  accessibility: 1500,
  public_accountability: 1000,
  foundational_research: 500
});

const HASH_32 = /^[a-f0-9]{64}$/i;
const UINT = /^(0|[1-9][0-9]*)$/;

function requireString(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError("invalid_" + name);
  }
  return value.trim();
}

function requireAtomic(value, name, positive = false) {
  if (typeof value !== "string" || !UINT.test(value)) {
    throw new TypeError("invalid_" + name);
  }
  const parsed = BigInt(value);
  if (positive && parsed <= 0n) throw new RangeError("invalid_" + name);
  return parsed;
}

export function normalizeMiningSettlement(receipt) {
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) {
    throw new TypeError("invalid_receipt");
  }
  if (receipt.schema !== "cryptic.mining.settlement.v1") {
    throw new TypeError("unsupported_receipt_schema");
  }
  const network = requireString(receipt.network, "network");
  const chainId = String(receipt.chainId ?? "").trim();
  if (!chainId || !/^[a-zA-Z0-9._:-]{1,80}$/.test(chainId)) {
    throw new TypeError("invalid_chain_id");
  }
  const transactionHash = requireString(receipt.transactionHash, "transaction_hash");
  const blockHash = requireString(receipt.blockHash, "block_hash");
  if (!HASH_32.test(transactionHash) || !HASH_32.test(blockHash)) {
    throw new TypeError("invalid_chain_hash");
  }
  const blockHeight = receipt.blockHeight;
  if (!Number.isSafeInteger(blockHeight) || blockHeight < 1) {
    throw new TypeError("invalid_block_height");
  }
  const asset = requireString(receipt.asset, "asset").toUpperCase();
  if (!/^[A-Z0-9._-]{2,16}$/.test(asset)) throw new TypeError("invalid_asset");
  const gross = requireAtomic(receipt.grossAmountAtomic, "gross_amount", true);
  const fees = requireAtomic(receipt.feesAtomic, "fees");
  if (fees > gross) throw new RangeError("fees_exceed_gross_amount");
  const settlementStatus = requireString(receipt.settlementStatus, "settlement_status");
  if (settlementStatus !== "settled") throw new Error("settlement_not_final");
  const net = gross - fees;
  if (net <= 0n) throw new RangeError("no_net_funding");
  return Object.freeze({
    schema: receipt.schema,
    network,
    chainId,
    transactionHash: transactionHash.toLowerCase(),
    blockHash: blockHash.toLowerCase(),
    blockHeight,
    asset,
    grossAmountAtomic: gross.toString(),
    feesAtomic: fees.toString(),
    netAmountAtomic: net.toString(),
    settlementStatus
  });
}

export function allocateMissionFunding(netAmountAtomic) {
  const total = requireAtomic(String(netAmountAtomic), "net_amount", true);
  const entries = Object.entries(MISSION_WEIGHTS_BPS);
  const denominator = 10000n;
  const rows = entries.map(([mission, weightBps], order) => {
    const numerator = total * BigInt(weightBps);
    return {
      mission,
      weightBps,
      amountAtomic: numerator / denominator,
      remainder: numerator % denominator,
      order
    };
  });
  let remainder = total - rows.reduce((sum, row) => sum + row.amountAtomic, 0n);
  const ranked = [...rows].sort((a, b) =>
    a.remainder === b.remainder ? a.order - b.order : a.remainder > b.remainder ? -1 : 1
  );
  for (let i = 0; remainder > 0n; i++, remainder--) {
    ranked[i % ranked.length].amountAtomic += 1n;
  }
  return rows.map(({ mission, weightBps, amountAtomic }) => ({
    mission,
    weightBps,
    amountAtomic: amountAtomic.toString()
  }));
}

/**
 * The injected verifier must independently query the relevant chain/provider.
 * Its evidence must establish transaction inclusion, receipt match, canonical
 * block finality, and the configured confirmation threshold.
 */
export async function verifyAndAllocateMiningSettlement(receipt, verifyOnChain) {
  if (typeof verifyOnChain !== "function") {
    throw new TypeError("independent_chain_verifier_required");
  }
  const normalized = normalizeMiningSettlement(receipt);
  const proof = await verifyOnChain(normalized);
  if (!proof || proof.transactionFound !== true ||
      proof.receiptMatches !== true || proof.canonicalBlock !== true ||
      proof.finalized !== true) {
    throw new Error("chain_settlement_not_verified");
  }
  if (!Number.isSafeInteger(proof.confirmations) ||
      !Number.isSafeInteger(proof.requiredConfirmations) ||
      proof.requiredConfirmations < 1 ||
      proof.confirmations < proof.requiredConfirmations) {
    throw new Error("insufficient_confirmations");
  }
  const evidenceRef = requireString(proof.evidenceRef, "verification_evidence_ref");
  return Object.freeze({
    schema: "cryptic.atlas.funding-allocation.v1",
    policyVersion: FUNDING_POLICY_VERSION,
    verification: Object.freeze({
      status: "verified",
      confirmations: proof.confirmations,
      requiredConfirmations: proof.requiredConfirmations,
      evidenceRef
    }),
    settlement: normalized,
    allocations: allocateMissionFunding(normalized.netAmountAtomic),
    transferStatus: "not_transferred"
  });
}
