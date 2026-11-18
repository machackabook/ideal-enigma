# 04 — Provenance, Living Research and Integration Roadmap

**Edition 1.0.0 · 2026-11-18**

## 1. Evidence classes

Every claim must be labelled **source-derived**, **observed**, **literature**, **proposed**, **tested**, **verified**, **pending** or **not implemented**. “Discovered” is not “validated”; “validated” is not “authenticated”; “authenticated” is not “verified”.

## 2. Provenance chain

~~~mermaid
flowchart LR
 S[Source document / paper / repository] --> C[Capture and citation]
 C --> N[Normalize and classify]
 N --> A[Claim and assumption ledger]
 A --> I[Implementation or experiment]
 I --> T[Test output and telemetry]
 T --> V[Independent verification]
 V --> P[Paper / figure / public index]
 P --> H[Versioned history]
~~~

For computational figures preserve source repository and commit, working-tree state, input/configuration, software versions, environment, command/workflow, logs, output dataset digest, analysis code and figure metadata. The paper [From Code to Figure](https://arxiv.org/abs/2604.25944) illustrates this continuous source-to-data-to-analysis-to-figure chain. This project adopts the provenance principle, not that paper's software stack.

## 3. Ledger semantics

A hash chain or Merkle root makes changes detectable relative to a trusted root. It does not prove the source claim was true, the author identity, hardware provenance, data completeness or execution authorization.

Use authenticated actor identity, signed canonical event, content digest, causal parent/correlation IDs, time and uncertainty, independent replay, append-only policy and externally retained checkpoints. D1/SQLite/file storage is mutable unless controls and external verification make unauthorized mutation detectable.

## 4. Living-paper manifest

Each paper should retain stable paper ID, edition, last-reviewed date, status, source IDs, claim IDs, assumptions, implementation references, test references, open questions and append-only changelog. The sources.json file is a bibliography, not a checksum manifest and not proof that cited papers were reproduced.

## 5. Research lifecycle

1. Capture exact source and identifier.
2. Classify source, literature, observation or proposal.
3. Normalize terminology without changing semantics.
4. Synthesize claims while preserving disagreement.
5. Specify versioned contracts.
6. Implement on a reviewed branch.
7. Run static, unit, integration and security checks.
8. Independently verify against an acceptance contract.
9. Publish approved metadata and exact revision.
10. Append a changelog entry when evidence changes.

Private memory is never mirrored into the public index. A memory record is attributed context, not an instruction with authority over current policy.

## 6. Current integration baseline

**Observed:** S.O.S main has a 2026-11-18 infrastructure update. ideal-enigma already has a public README search console and public knowledge browser. Cloudflare route registrations exist for S.O.S, ideal-enigma/UNIOMNI and the protected mesh API. The protected API is Access-gated. The mesh D1 database has five application tables for jobs, tokens, nonces, rate state and audit. GAIA Memory Bridge is owner-authenticated; its inventory reports no provider OAuth clients, automatic provider ingestion or model-inference connection. Twelve related papers were added to the alphaXiv folder “GAIA NEXUS CRYPTIC Living Research”.

**Pending:** external HTTP reachability was not confirmed; local agent pairing is incomplete; full job dispatch → agent poll → result → receipt needs an end-to-end test; open source PRs have not all passed executable CI. The current ideal-enigma Atlas/DUALTRACE PR remains open; its own description says the Atlas Worker suite has not been run locally. The TDOC lineage PR remains intentionally draft pending source discovery and artifact validation.

## 7. Merge and deployment order

1. Freeze exact S.O.S, CRYPTIC and ideal-enigma commit SHAs.
2. Stabilize shared identity, event, capability, permission and result contracts.
3. Provision agent pairing locally; never commit the secret.
4. Test token exchange, expiry, nonce replay, ownership, rate limits, cancellation and result digest.
5. Test concurrent refresh, abort, retry and receipt persistence in the S.O.S client.
6. Reconcile stale/stacked branches against the latest authoritative main without overwriting newer changes.
7. Require CI steps to execute and pass with usable logs.
8. Merge dependencies in order: S.O.S contract/client foundation, dependent mesh changes, then public-index changes.
9. Add research links to the curated index only after privacy and index tests pass.
10. Deploy additively; preserve existing routes and rollback.
11. Record commit, test and deployment receipts in the private ledger.
12. Link published papers into Obsidian without exporting private memory.

## 8. Acceptance gates

- **Identity:** issuer, audience, subject binding, expiry, scope and revocation tested.
- **Pairing:** locally provisioned identity; no secret in Git/logs; signed round-trip passes.
- **Job lifecycle:** idempotency, ownership, bounded polling, cancellation, distinct failure states and receipt.
- **Source/CI:** latest base, no conflicts, every required job executes, logs available, all tests pass.
- **Public pages:** approved metadata only, private memory absent, protected links labelled, draft status accurate, CSP/search/method tests pass.
- **Research:** citations and editions present; partial-round SHA research not misrepresented; mathematical claims tested or proved; changelog maintained.

A workflow that fails before executing steps is **execution unavailable / startup failure**, not a code-test result and not a pass.

## 9. Completion definition

Complete means the operational source, public index, protected mesh, private memory boundary, mathematical contracts and research corpus are connected through versioned interfaces and independently verified receipts. A documentation PR is not a deployed mesh; a route is not a paired agent; a paper is not an implementation; a hash is not authorship.

Copyright: The Architect / Nexus / Cryptic News LLC / Project: The Nexus Generation: GaiaSSoul / SERIES: The Nexus of Gaia / ID: 137451921129154222|040592|433855274
