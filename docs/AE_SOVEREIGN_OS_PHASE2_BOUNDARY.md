# AE.SOVEREIGN.OS + AE.AXS.POLYGLOT — Phase 2 boundary

**Baseline from the supplied project directive:** CRYPTIC Device Mesh v6.2.0.  
**Phase:** 2 — shared contracts, module boundaries, and versioned manifests.  
**Status in this repository:** architectural specification only; no installable operating system or bootloader is claimed.

## Shared contract layer

The project directive calls for stable module identities, semantic versions, compatibility ranges, capability and dependency descriptors, integrity metadata, health states, system events, system errors, device identities, execution contexts, and permission scopes. Events must carry an event ID, schema version, UTC timestamp, source module, and correlation ID. Monotonic clocks are reserved for elapsed-time measurements.

## Module boundaries

The intended dependency direction is:

`common contracts → OS and AXS contracts → service implementations → UI adapters`

### AE.SOVEREIGN.OS

- Boot orchestration: ordered stages, dependencies, readiness, failure, recovery, and rollback contracts.
- Virtual filesystem: namespaces, mount descriptors, provider interfaces, and read/write capability declarations.
- Device discovery: identity, capabilities, discovery events, connection state, and registration lifecycle.
- Health monitoring: heartbeat, readiness, degraded/unavailable state, diagnostics, and timestamps.
- Initramfs manifest: required components, dependencies, kernel compatibility, drivers/utilities, and integrity metadata.

A browser-only virtual store must not be represented as a physical block device or native filesystem mount. Hardware/driver behavior requires a real authorized provider and evidence from that provider.

### AE.AXS.POLYGLOT

- Language providers preserve locale, encoding, normalization policy, and translation metadata.
- Command parsing preserves original input, token positions, operands, operators, and diagnostics.
- Execution routing checks module resolution, capabilities, permissions, and execution context.
- Result envelopes retain original input, normalized representation, result, verification state, errors, and correlation ID.

PIPETHRUUC distinctions remain explicit: `|` pipe, `>` output redirection, `<` input redirection, and `<--` reverse redirection. The longer `<--` token must be recognized before individual angle-bracket operators. Translation must not silently change precedence, operand identity, or signedness.

## Manifest requirements

The supplied directive specifies separate manifest, module, API, and schema versions; entrypoints; dependencies; capabilities; permissions; compatibility; integrity; lifecycle; and status. Integrity values must be generated from actual bytes, never invented. Missing or pending integrity must remain labeled as such.

## Validation boundary

Phase 2 acceptance requires compile-time types, runtime manifest validation, compatibility checks, dependency-direction enforcement, migration adapters for existing types, and tests for invalid manifests, incompatible versions, duplicate IDs, event correlation, timestamp format, operator precedence, multilingual normalization, denied permissions, and worker-message version mismatches.

This repository note does not assert that those deliverables already exist in the separate AI Studio project. The exact source files and current imports must be inspected before implementation there.
