# ADAM Repository Gate — implementation note

**Status:** implemented and locally tested; proposed for review in the CRYPTIC integration branch.  
**Gate:** 0 — OBSERVE.  
**Mutation boundary:** read-only by default; report writing requires an explicit `--write` path.

## Purpose

ADAM's repository boundary treats GitHub and local working trees as versioned external evidence. This tool creates an inventory snapshot without editing source files, Git refs, remotes, hooks, or configuration.

## What it records

- Relative path, file/symlink kind, and byte count.
- SHA-256 for files at or below the 50 MiB default hash limit.
- Explicit `not_followed` status for symlinks; targets are never traversed.
- Git root, current branch, HEAD commit, and porcelain working-tree status when Git is available.
- Summary counts and a SHA-256 snapshot commitment.

It does not read file contents into the report, copy credentials, inspect secret values, install dependencies, run project code, or contact remote services. `.git`, dependency caches, build outputs, and common generated directories are excluded by default. Additional exclusions can be supplied by name.

## Usage

```bash
node tools/adam/repo-audit.mjs --repo-root .
node tools/adam/repo-audit.mjs --repo-root . --write .adam/repository-audit.json
node tools/adam/repo-audit.mjs --repo-root . --exclude artifacts --write .adam/repository-audit.json
```

The output file must remain inside the repository. Existing report files are not overwritten unless `--force` is supplied. The report is an inventory, not a declaration that every discovered file is trusted or canonical.

## ADAM gates

1. **OBSERVE:** inventory, index, hash, classify, compare. No source mutation.
2. **PROPOSE:** produce patches, migrations, relationships, or synchronization plans. No privileged execution.
3. **VALIDATE:** syntax, dependencies, tests, provenance, security, compatibility, repository state, and rollback path.
4. **PROMOTE:** only after explicit Architect approval; commit, push, ledger receipt, and memory update.

Repository classifications remain explicit: `CANONICAL`, `CORE`, `PUBLIC`, `PROVENANCE`, `HISTORICAL`, `PROTOTYPE`, `RECOVERY`, `UNKNOWN`, or `EXCLUDED`. `UNKNOWN` is never equivalent to `PASS`.

## Provenance limits

SHA-256 identifies the bytes that were read. It does not prove authorship, truth, safety, or uniqueness of interpretation. A missing or skipped file hash is recorded as a gap, not silently treated as verified. An audit snapshot does not replace the original repository or its Git history.

## Quantum research boundary

Quantum no-cloning and Wiesner-style quantum money are research topics, not a substitute for this repository's classical SHA-256, event-chain, or signature controls. A classical digest is not a quantum state and is not made reversible by a quantum no-cloning result. Any quantum-money research integration requires its own source citation, threat model, protocol specification, and independent tests; the supplied excerpt ends mid-sentence and is insufficient to specify an implementation.
