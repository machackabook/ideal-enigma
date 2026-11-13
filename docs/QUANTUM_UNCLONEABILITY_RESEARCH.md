# Quantum uncloneability research note

**Status:** research note only; no quantum-money protocol or quantum hardware implementation is included.

## Scope of the supplied excerpt

The supplied passage discusses two topics:

1. A quantum cloning bound attributed in the excerpt to Werner: for Haar-random states on an n-qubit system, a number of input copies growing polynomially with n still gives exponentially small fidelity when attempting to produce one additional clone.
2. Wiesner's private quantum-money construction: a banknote is represented by n qubits, each prepared in one of four BB84 states: computational-basis |0⟩, |1⟩, or diagonal-basis |+⟩, |−⟩.

The excerpt ends during the description of the banknote. It does not provide the bank's verification procedure, key-generation rules, security proof, threat model, or implementation parameters. Those details are therefore intentionally left unspecified here.

## Repository boundary

- This is a literature/research topic, not an active CRYPTIC transaction format.
- Quantum no-cloning is not a method for reversing SHA-256 or recovering a prior hash from a digest.
- A classical digest, an ordinary digital signature, and an unknown quantum state are different objects with different security assumptions.
- The current Atlas Worker remains classical: SHA-256 commitments, event-chain records, and optional signatures where configured.
- No quantum state is represented by a string, simulated as a security guarantee, or claimed to be physically unclonable by this repository.

## Evidence required before implementation

A future protocol proposal must identify the complete primary paper or source, specify the minting and verification algorithms, state the adversary model, establish correctness and unforgeability claims, and define what quantum hardware or trusted quantum channel is required. It must be reviewed independently before any implementation or security claim.

## Current status

`RESEARCH_ONLY / SOURCE_EXCERPT_INCOMPLETE / NOT_IMPLEMENTED`
