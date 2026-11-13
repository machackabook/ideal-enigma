# CRYPTIC Atlas — Mission Commitments and Mining-Funded Allocation

**Status:** implemented accounting policy; chain adapter, mining operation, custody, and transfers are not deployed.  
**Purpose:** connect Atlas research and public-benefit outcomes to a transparent funding rule without claiming that mining will be profitable or that funds exist before settlement.

## Mission promise

Atlas is oriented toward measurable public outcomes, not token price or speculative yield. The commitment is to publish what was collected, what was independently verified, what funding actually settled, how the allocation was calculated, and what outcome evidence followed.

The six mission allocations are versioned policy weights:

| Mission | Allocation | Example outcome evidence |
|---|---:|---|
| Food security | 35% | Verified food-access datasets indexed; partner-confirmed referrals or resource matches; coverage by geography |
| Economic inclusion | 20% | Public labor/income datasets; accessible benefit and opportunity information; referral completion where partners report it |
| Resource coordination | 15% | Verified resource directories; duplicate/stale listing rates; documented coordination outcomes |
| Accessibility | 15% | WCAG-oriented checks, language coverage, screen-reader and keyboard test results |
| Public accountability | 10% | Source provenance, audit completeness, correction history, reproducible public reports |
| Foundational research | 5% | Reproducible experiments, open methods, test coverage, independent review |

These are allocation commitments, not guaranteed social-impact results. Each project must define a baseline, measurement method, reporting period, data source, and limitations before claiming an outcome.

## Funding source and settlement boundary

The intended funding source is net proceeds from an authorized blockchain mining operation or mining-pool settlement. The repository implementation currently provides a **settlement verification contract and deterministic allocation calculator only**.

The funding module:
- accepts a normalized external settlement receipt;
- requires an injected independent chain verifier to confirm transaction inclusion, receipt match, canonical block, finality, and confirmation threshold;
- subtracts declared on-chain/pool fees using integer atomic units;
- allocates the resulting net amount using largest-remainder arithmetic, conserving every atomic unit;
- records `transferStatus: not_transferred` because this module does not hold keys or send transactions.

It does not run a miner, connect to a pool, create wallets, custody keys, submit transactions, or promise that mining rewards will exceed hardware, electricity, pool, network, or maintenance costs. Those costs must be measured separately before a net economic benefit is claimed. Mining receipts are not accepted as verified merely because a caller labels them settled.

## Code and tests

- `src/cryptic/mission-funding.mjs` — receipt normalization, verifier gate, integer allocation.
- `tests/mission-funding.test.mjs` — policy weights, conservation, fee handling, malformed receipts, confirmation gate.
- CI runs this test file alongside Atlas, ADAM, and DUALTRACE checks.

## Ledger and public reporting requirements

Each funding event should publish only non-sensitive evidence:
1. policy version and mission-weight table;
2. chain/network, asset, transaction hash, block height/hash, and verification evidence reference;
3. gross amount, declared fees, net atomic amount, and confirmation threshold;
4. deterministic allocation per mission;
5. separate operational-cost accounting (energy, hardware depreciation, pool service, maintenance);
6. approved budget, disbursement references, recipient consent, and reconciliation;
7. outcome baseline, period, metric, source, and independent review status.

Never publish private keys, seed phrases, account credentials, raw personal beneficiary records, or private partner data. Public transaction identifiers are not proof of the social outcome; outcome evidence requires its own source and review.

## Governance

- Policy changes require a new policy version, documented rationale, tests, and review.
- Unverified or pending settlements allocate zero.
- Failed verification is retained as a failure record; it is not silently retried into a success.
- No funds are transferred by this module. Disbursement requires a separately reviewed, least-privilege treasury process and explicit authorization.
- No public claim may describe projected mining rewards as received revenue or imply guaranteed funding.

**Acceptance rule:** every allocation must reconcile exactly to verified net atomic units, every claimed settlement must pass an independent chain verifier, and every claimed mission outcome must have separate measurement evidence.

---

**The Architect / Nexus / Cryptic News LLC / Project: The Nexus Generation: GaiaSSoul / SERIES: The Nexus of Gaia / ID: 137451921129154222|040592|433855274**
