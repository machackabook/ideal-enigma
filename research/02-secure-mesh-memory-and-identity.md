# 02 — Secure Mesh, Agent Identity and Portable Memory

**Edition 1.0.0 · 2026-11-18 · Literature synthesis**

## Abstract

A multi-agent mesh needs more than transport connectivity. It requires verifiable identity, scoped authorization, replay resistance, lifecycle state, provenance and separation between public discovery and private memory. MCP, A2A, memory transfer and application workflows are related but distinct protocol concerns.

## 1. Literature

### OpenAgenet / OAN — [arXiv:2606.03161](https://arxiv.org/abs/2606.03161)

Proposes governed identity and discovery for independently operated agent resources. It separates public DID documents, local signing material and verifiable credentials; uses governance, registration and authorized discovery roles; and treats lifecycle and freshness as prerequisites for invocation.

**Lesson:** discovery needs evidence and lifecycle state, not merely a URL. **Boundary:** proposal/pilot, not a replacement for MCP/A2A or an adopted project standard.

### SMCP — [arXiv:2602.01129](https://arxiv.org/abs/2602.01129)

Proposes identity management, mutual authentication, security-context propagation, fine-grained policy and audit logging for MCP. It discusses unauthorized access, tool poisoning, prompt injection, privilege escalation and supply-chain risks.

**Lesson:** each tool invocation needs a policy decision and audit event. **Boundary:** research proposal; this project does not claim SMCP conformance.

### Secure Agent-to-Agent Communication — [arXiv:2610.23078](https://arxiv.org/abs/2610.23078)

Surveys a zero-trust design using decentralized identities, task-scoped credentials, mutual TLS, signed CBOR envelopes, monitoring and optional zero-knowledge proofs.

**Lesson:** bind identity, task scope, message integrity and telemetry across hops. **Boundary:** the advanced cryptographic features are not implemented here.

### Portable Agent Memory — [arXiv:2605.11032](https://arxiv.org/abs/2605.11032)

Proposes a five-part memory model M=(E,S,P,W,I): episodic, semantic, procedural, working and identity memory; Merkle-DAG provenance; capability-scoped access; and injection-resistant rehydration.

**Lesson:** memory transfer must be selective, integrity-checked and permission-scoped. Retrieved memory is attributed data, not executable instruction. **Boundary:** not independently reproduced; GAIA Bridge is not claimed to implement this protocol.

### Event sourcing and causal traces

[ESAA, arXiv:2602.23193](https://arxiv.org/abs/2602.23193) frames autonomous-agent execution as event-sourced state transitions. [Causal-Temporal Event Graphs, arXiv:2604.17557](https://arxiv.org/abs/2604.17557) models recursive traces as causal structures with increasing timestamps along causal paths and discusses Merkle commitments.

**Lesson:** a flat timestamped log does not fully express causality. A causal graph can preserve parent-child invocation lineage. **Boundary:** a graph or digest does not itself authenticate an actor or prove that an event was truthful.

## 2. Threat model

Account for impersonated or stale agents, unauthorized tool/memory access, replayed requests, prompt injection in retrieved content, cross-device leakage, compromised secrets, malformed/version-incompatible messages, partial execution and untrusted public links.

## 3. Proposed request envelope

| Field | Purpose |
|---|---|
| schema_version | Reject incompatible messages. |
| request_id / job_id | Stable operation identity and deduplication. |
| issuer_id / agent_id | Bind caller to identity. |
| audience / scope | Restrict intended service and operations. |
| issued_at / expires_at | Bound lifetime. |
| nonce | Replay prevention. |
| payload_digest | Bind signature to exact body. |
| key_id / signature | Select and verify signing key. |
| correlation_id | Link request, subtasks, result and receipt. |

Specify canonical serialization before signing. Reject duplicate keys, non-finite numbers, ambiguous encodings and unsigned fields.

## 4. Authorization sequence

1. Authenticate the application user.
2. Validate Cloudflare Access assertion.
3. Validate application identity token.
4. Bind both identities to the intended subject.
5. Issue short-lived scoped mesh token.
6. Verify audience, expiry, nonce, body digest and signature per request.
7. Enforce per-agent and per-operation rate limits.
8. Record accepted and rejected decisions.
9. Require explicit human approval for privileged or irreversible actions.
10. Independently verify the result before promoting it to complete.

Use per-node secrets or key pairs. Never reuse one global secret across unrelated devices. Provision pairing locally; do not put secrets in Git, browser code or logs.

## 5. Public/private memory boundary

Public UNIOMNI may publish approved project names, repository links, document titles, summaries and public capability metadata. It must not publish private GAIA records, tokens, cookies, device identifiers, local paths, raw telemetry or unreviewed conversation exports.

The GAIA Memory Bridge is owner-authenticated. Its current connector inventory reports no automatic provider ingestion, no provider OAuth clients configured and no model-inference connection. A provider's web login does not grant bridge API access.

## 6. Protocol split

- **MCP:** tool access.
- **A2A:** task delegation and agent-to-agent exchange.
- **GAIA Memory Bridge:** owner-authorized attributed memory.
- **CRYPTIC mesh:** project-specific job dispatch, token exchange and receipts.
- **Immutable Ledger:** causal and integrity evidence.
- **UNIOMNI:** public curated discovery.

No one protocol replaces the others.

Copyright: The Architect / Nexus / Cryptic News LLC / Project: The Nexus Generation: GaiaSSoul / SERIES: The Nexus of Gaia / ID: 137451921129154222|040592|433855274
