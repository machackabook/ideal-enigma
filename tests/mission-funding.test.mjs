import test from "node:test";
import assert from "node:assert/strict";
import {
  MISSION_WEIGHTS_BPS,
  FUNDING_POLICY_STATUS,
  allocateMissionFunding,
  normalizeMiningSettlement,
  verifyAndAllocateMiningSettlement
} from "../src/cryptic/mission-funding.mjs";

const receipt = (overrides = {}) => ({
  schema: "cryptic.mining.settlement.v1",
  network: "example-mainnet",
  chainId: "1",
  transactionHash: "a".repeat(64),
  blockHash: "b".repeat(64),
  blockHeight: 123456,
  asset: "EXM",
  grossAmountAtomic: "100000000",
  feesAtomic: "1000000",
  settlementStatus: "settled",
  ...overrides
});

test("mission weights sum to exactly 10000 basis points and remain proposed", () => {
  assert.equal(FUNDING_POLICY_STATUS, "proposed");
  assert.equal(Object.values(MISSION_WEIGHTS_BPS).reduce((a, b) => a + b, 0), 10000);
});

test("allocation is deterministic and conserves every atomic unit", () => {
  const a = allocateMissionFunding("999999999999999999999");
  const b = allocateMissionFunding("999999999999999999999");
  assert.deepEqual(a, b);
  assert.equal(a.reduce((sum, row) => sum + BigInt(row.amountAtomic), 0n), 999999999999999999999n);
  assert.equal(a.length, 6);
});

test("largest-remainder allocation conserves tiny amounts", () => {
  const rows = allocateMissionFunding("3");
  assert.equal(rows.reduce((sum, row) => sum + BigInt(row.amountAtomic), 0n), 3n);
});

test("settlement normalization uses integer atomic units and deducts declared fees", () => {
  const normalized = normalizeMiningSettlement(receipt());
  assert.equal(normalized.netAmountAtomic, "99000000");
  assert.equal(normalized.transactionHash, "a".repeat(64));
});

test("rejects invalid hashes, fees, and unsettled receipts", () => {
  assert.throws(() => normalizeMiningSettlement(receipt({ transactionHash: "not-a-hash" })), /invalid_chain_hash/);
  assert.throws(() => normalizeMiningSettlement(receipt({ feesAtomic: "100000001" })), /fees_exceed_gross_amount/);
  assert.throws(() => normalizeMiningSettlement(receipt({ settlementStatus: "pending" })), /settlement_not_final/);
});

test("requires independent chain verification and finality evidence", async () => {
  await assert.rejects(
    verifyAndAllocateMiningSettlement(receipt(), null),
    /independent_chain_verifier_required/
  );
  await assert.rejects(
    verifyAndAllocateMiningSettlement(receipt(), async () => ({
      transactionFound: true, receiptMatches: true, canonicalBlock: true,
      finalized: true, confirmations: 2, requiredConfirmations: 12,
      evidenceRef: "explorer:tx"
    })),
    /insufficient_confirmations/
  );
});

test("returns verified allocation only after verifier confirms chain evidence", async () => {
  const result = await verifyAndAllocateMiningSettlement(receipt(), async normalized => {
    assert.equal(normalized.netAmountAtomic, "99000000");
    return {
      transactionFound: true,
      receiptMatches: true,
      canonicalBlock: true,
      finalized: true,
      confirmations: 20,
      requiredConfirmations: 12,
      evidenceRef: "explorer:tx/" + normalized.transactionHash
    };
  });
  assert.equal(result.verification.status, "verified");
  assert.equal(result.policyStatus, "proposed");
  assert.equal(result.transferStatus, "not_transferred");
  assert.equal(result.allocations.reduce((sum, row) => sum + BigInt(row.amountAtomic), 0n), 99000000n);
});
