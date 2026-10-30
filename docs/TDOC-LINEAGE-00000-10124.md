# TDOC-00000 → TDOC-10124: Evidence-first integration gate

**Scope:** numerical TDOC IDs 0–10124 inclusive (10,125 possible identifiers). The range is a search domain, not evidence that each record exists.

## Intake and promotion

1. Discover existing TDOC artifacts in the repository, authorized archives and explicitly provided source locations.
2. Preserve originals and record source path, content digest, source repository/ref, exact identifier, alias and revision. Never replace an original based only on a numerical match.
3. Index all numeric slots, flag missing and ambiguous IDs; do not generate fake documents for empty slots.
4. Distinguish identity and variants (TDOC-0001 vs TDOC-1001, Greek-symbol IDs, prefixed names and versions). Only a validated numeric identifier occupies a slot.
5. Run existing integrity verifier `python3 tools/verify.py` and independent checks on newly imported files. SHA-256 checks byte consistency, not authorship.
6. Approve individual imports only after review; no automatic execution of archived .sh, .html, binaries, URLs, or third-party content.
7. Keep private memories, credentials and forensic details out of the public repository. All external dispatch, deployment and release gates remain disabled until explicitly authorized.
8. Stop on missing dependencies, hash mismatch or unsafe material. Preserve a failure report, not a fabricated successful checkpoint.

## Starting-point evidence

The current repository contains `UNIOMNI_STAGE0.sh`, `layers/manifest.json`, `tools/verify.py`, `runtime/`, and existing CI workflows. Some layers are explicitly marked reference-only; those statuses must not be silently upgraded to runnable. Later-numbered TDOCs such as TDOC-11004 remain outside this requested numerical window.

## Validation

Run `python3 tools/tdoc_index.py --root . --output /tmp/uniomni-tdoc-report.json` to enumerate referenced TDOC IDs without modifying tracked files. Review the report before promoting any document. Run `python3 tools/verify.py` against the repository. A missing record is reported as missing, not filled with synthetic content.

This branch implements the **inventory gate**, not historical recreation of 10,125 documents or an automatic release.
