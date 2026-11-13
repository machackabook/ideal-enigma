# Project Source Index — Hamiltonian Test / CRYPTIC / GAIA-NEXUS

**Repository:** `machackabook/ideal-enigma`  
**Integration branch:** `feat/cryptic-atlas-cca-v0.2.1`  
**Purpose:** navigable index of project specifications and source material supplied to this repository-integration task.  
**Index status:** curated from the current conversation attachments; not a complete inventory of the user's entire personal Library.

## 1. Implemented or mapped in this repository

| Source document | Main subject | Repository destination | Status |
|---|---|---|---|
| `Initramfs Configuration Analysis (1).txt` (DUALTRACE source) | Four independent lanes, paired automation/shadow tickets, forward/reverse ordering, fractional checkpoints, explicit polarity, residual checks | [DUALTRACE specification](./AE_SL6_DUALTRACE_4P.md), [lane contracts](../src/cryptic/dualtrace.mjs), [tests](../tests/dualtrace.test.mjs) | Contract and pure validators added; scheduler/runtime not claimed |
| `Inversion proof summary (1).txt` | Algorithm-independent inverse verification; right- and left-inverse identities | [Unbound inverse module](../src/cryptic/unbound-inverse.mjs), [DUALTRACE tests](../tests/dualtrace.test.mjs) | Generic JS verifier and finite-domain tests added |
| `Continue AI Studio Project (2).txt` | AE.SOVEREIGN.OS and AE.AXS.POLYGLOT Phase 2 shared contracts, module boundaries, manifests, validation, migration | [Phase 2 boundary](./AE_SOVEREIGN_OS_PHASE2_BOUNDARY.md) | Requirements captured; implementation belongs in the separate AI Studio project after source inspection |
| `Continue AI Studio Project.txt` | Coprime traversal, totient space, forward/reverse route, checkpoints, parity, mistake ledger | [Coprime traversal and inverse notes](#3-source-notes-not-yet-implemented) | Research/design source; no hash inversion claim |
| `Initramfs Configuration Analysis (1).txt` (Nexus V2.0 source) | ARX reversible state transition, Bellman adaptive I/O, stream orchestration, coprime four-lane allocation, BLAKE2b seal boundary | [Nexus V2.0 notes](#3-source-notes-not-yet-implemented) | Architecture captured; implementation and measured runtime not established |
| `Discuss Stride Skips.txt` | IBM Granite provider designation, watsonx.ai, model registry, federation and independent verifier boundaries | [Provider integration notes](#3-source-notes-not-yet-implemented) | Design note only; no provider credentials or live endpoint configured |
| `EPUB Forge & Launcher.txt` (computational miner source) | Calculus, cinematic sampling, telemetry, spectral analysis, ARX diagnostic replay, model parameter accounting | [Computational runtime notes](#3-source-notes-not-yet-implemented) | Design note only; host HTML selection was not supplied |
| `Pipeline architecture synthesis.txt` | Historical GAIA/NEXUS ZIP lineage and distinction between archive-history evidence and actual archive inspection | [Archive lineage notes](#3-source-notes-not-yet-implemented) | Historical names recorded; archives not verified from this text alone |
| `Reconstruct untitled zip (1).txt` | Modular inverse of 65,537 and the requirement to specify modulus | [Inverse arithmetic notes](#3-source-notes-not-yet-implemented) | Source question retained; modulus is unresolved |
| `EPUB Forge & Launcher.txt` (historical verification registry) | Historical authentication and access-control references | Not copied into this public index | Excluded from public source publication because it discusses access-control mechanisms and symbolic entry material |

## 2. Current repository implementation links

### CRYPTIC Atlas CCA
- [Atlas architecture](./CRYPTIC_ATLAS_CCA.md)
- [HarvesterWebOmni Worker](../cloudflare/cryptic-atlas/worker.mjs)
- [Search mission manifest](../manifests/cryptic-atlas-search-manifest.json)
- [D1 schema migration](../cloudflare/cryptic-atlas/migrations/0001_init.sql)
- [Atlas tests](../tests/cryptic-atlas.test.mjs)

### ADAM repository governance
- [ADAM governance specification](./ADAM_REPOSITORY_GOVERNANCE.md)
- [Read-only repository audit CLI](../tools/adam/repo-audit.mjs)
- [ADAM tests](../tests/adam-repo-audit.test.mjs)

### DUALTRACE and inverse verification
- [AE.SL6.DUALTRACE.4P](./AE_SL6_DUALTRACE_4P.md)
- [AE.MINERVA unbound inverse verifier](../src/cryptic/unbound-inverse.mjs)
- [Four-lane contracts](../src/cryptic/dualtrace.mjs)
- [DUALTRACE tests](../tests/dualtrace.test.mjs)

### Research and architecture boundaries
- [Quantum uncloneability research note](./QUANTUM_UNCLONEABILITY_RESEARCH.md)
- [AE.SOVEREIGN.OS / AE.AXS.POLYGLOT Phase 2 boundary](./AE_SOVEREIGN_OS_PHASE2_BOUNDARY.md)

## 3. Source notes not yet implemented

The following are deliberately indexed as design inputs, not represented as completed runtime capabilities.

### Coprime route and mistake ledger
The supplied note describes a modulus (N=97152=2^7\cdot3\cdot11\cdot23), Euler totient (φ(N)=28160), and a coprime traversal space. It proposes forward and reverse index routes using a stride coprime to the traversal cardinality. The note explicitly distinguishes a reproducible route key from a cryptographic secret and says the traversal does not invert a cryptographic hash. The proposed mistake ledger preserves original failures, attempted corrections, and independent verification outcomes.

### Nexus V2.0 adaptive I/O
The supplied note separates reversible ARX state transitions from cryptographic hashing. It identifies an adaptive Bellman controller, stream parser/redirection, four-lane allocation, coprime traversal, and BLAKE2b content sealing as distinct components. It also lists missing production work: real codecs, measured energy/latency, persistent controller state, actual stream routing, and robust tokenization. No perpetual-energy or native hardware capability is claimed.

### IBM Granite provider
The supplied note names `AE.AI.IBM.GRANITE`, `WATSONX_AI`, `IBM_IAM`, `GRANITE_REGISTRY`, `AE.AI.FEDERATION`, and `AE.AI.REVERIFIER`. It distinguishes model safety assessment from cryptographic integrity verification. No API key, project ID, or provider secret is included in this repository.

### Computational miner and cinematic runtime
The supplied note proposes a calculus worker, cinematic engine, spectral-analysis worker, telemetry bridge, reversible ARX diagnostics, and model-parameter audit. It specifically warns that ARX replay is not a cryptographic hash or authentication mechanism. It recommends SHA-256 for integrity receipts and calls for adaptive arc-length sampling, robust Frenet–Serret handling, torsion, rotation-minimizing camera frames, stale-frame rejection, and backpressure.

### Archive lineage
The pipeline synthesis document lists historical archive names and what prior conversation history associated with them. It explicitly warns that those descriptions are not fresh archive inspections. The current attachment `untitled.zip` is present in the conversation, but its contents were not readable through the available file-text reader in this pass. No files are attributed to that ZIP without extraction and inspection.

### Modular inverse of 65,537
The supplied note says the modulus is necessary before computing the modular inverse. It gives the RSA-style relation (d=e^{-1}\pmod{\lambda(n)}), with (e=65,537), and requires (gcd(65,537,m)=1). The source does not resolve whether the intended modulus is based on prior factors or 97,152, so no numeric inverse is asserted.

## 4. Source and publication policy

- This index points to public repository implementations only where those files exist.
- Source descriptions are summaries of supplied documents, not proof that a separate project or archive was inspected.
- Duplicate attachment names are distinguished by subject because the two `Initramfs Configuration Analysis (1).txt` files and two `EPUB Forge & Launcher.txt` files contain different text.
- The historical verification registry is intentionally not reproduced here.
- The attached `untitled.zip` is recorded as an uninspected archive, not a verified code source.
- Secrets, credentials, private GAIA memory, device identifiers, and personal files are not published.
- New implementations must preserve original evidence, expose skipped transitions, and distinguish tested behavior from design intent.

## 5. Source attachment register

| Attachment name | Handling |
|---|---|
| `Initramfs Configuration Analysis (1).txt` — DUALTRACE source | Read; mapped to DUALTRACE contracts and tests |
| `Initramfs Configuration Analysis (1).txt` — Nexus V2.0 source | Read; architecture notes indexed |
| `Pipeline architecture synthesis.txt` | Read; historical archive lineage indexed |
| `Continue AI Studio Project.txt` | Read; coprime route and mistake-ledger requirements indexed |
| `Continue AI Studio Project (2).txt` | Read; Phase 2 boundary documented |
| `Discuss Stride Skips.txt` | Read; IBM Granite provider note indexed |
| `Reconstruct untitled zip (1).txt` | Read; modular-inverse modulus dependency indexed |
| `Inversion proof summary (1).txt` | Read; unbound inverse module implemented |
| `EPUB Forge & Launcher.txt` — computational miner source | Read; runtime design notes indexed |
| `EPUB Forge & Launcher.txt` — historical verification registry | Read; excluded from public content |
| `untitled.zip` | Attachment present; archive contents not inspected in this pass |

---

**Index maintenance:** update this file when a source is inspected, mapped to code, validated, or intentionally excluded. Preserve the distinction between `received`, `read`, `implemented`, `tested`, and `deployed`.

**The Architect / Nexus / Cryptic News LLC / Project: The Nexus Generation: GaiaSSoul / SERIES: The Nexus of Gaia / ID: 137451921129154222|040592|433855274**


### Atlas mission commitments and mining-funded allocation
The new [mission funding policy](./CRYPTIC_ATLAS_MISSION_FUNDING.md) assigns versioned allocation weights to the six public-benefit missions. The [funding module](../src/cryptic/mission-funding.mjs) requires an injected independent chain verifier, subtracts declared fees using integer atomic units, and allocates verified net proceeds without rounding loss. Its tests are in [mission-funding.test.mjs](../tests/mission-funding.test.mjs). This is not a miner, custody wallet, transfer system, or guarantee of funding.
