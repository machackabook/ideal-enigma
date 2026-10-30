# UNIOMNI Stage 0 · v1.0.0

Observe → Digest → Integrate → Stabilize → Shed.

A real local runtime and single-file SS installer for Crostini/Linux, macOS and Termux with Python 3.10+. Native Windows can run the Python CLI; the Bash installer needs WSL/Git Bash. No root, partition changes, or consumer-device rooting.

```bash
bash UNIOMNI_STAGE0.sh --serve
```

The self-contained installer verifies its embedded archive, saves itself under `$AE/autonomous`, installs a versioned release, creates `$AE/bin/uniomni`, runs a first cycle and serves the landing page at `http://127.0.0.1:6080`. `$AE` defaults to `$HOME/Æ`. It prints the local token file path; read that file locally and paste its contents into the local page only. The installer does not fetch or install packages. Install Python through your OS package manager if missing.

Linux desktop registration assigns `uniomni://` to the local landing page through xdg-mime. The server must be running. Crostini registration does not guarantee ChromeOS host interception. Termux uses the HTTP landing page; Android requires a separately installed intent-handler app for a custom scheme. An ordinary web manifest cannot register arbitrary `uniomni` as a web protocol handler (`web+uniomni` is a different scheme).

## Implemented cycle

| Phase | Implemented behavior |
| --- | --- |
| Observe | Bound vault metadata traversal, skip symlinks, cap at 2000 nodes; readable /proc checks and exact IPv4/IPv6 TCP LISTEN port check |
| Digest | Import explicitly supplied UTF-8 text, deduplicate by SHA-256, write Obsidian-compatible Markdown |
| Integrate | Persist folder-cluster graph and link canonical GAIA portal/MCP configuration |
| Stabilize | Verify release files and full ledger; regenerate shadow runtime copies only from matching release bytes |
| Shed | Preserve originals, old releases and ledger history; no automatic deletion or hash rewriting |

`uniomni watch --interval 90` repeats bounded checks. `uniomni cycle`, `uniomni verify`, `uniomni ingest --file export.txt` and `uniomni epub --file UNIOMNI.epub` are available. Runtime state, notes and `ss.*.log` live in `$HOME/Æ/uniomni` or `UNIOMNI_HOME`, outside the public source tree. The `vault` directory can be opened as an Obsidian vault. There is no account-wide ChatGPT/Gemini history importer: use authorized exports or Web Clipper on selected pages.

## Memory-aware molting and GAIA

Set `GEMINI_API_KEY` and an available `GEMINI_MODEL` in the server process, then use **Molt source**. No default model is assumed. The explicit checkbox includes up to three recent conversation notes (4000 characters each) in that provider request. Without it, only supplied source is sent. Generated output is archived under its hash and previewed in an opaque sandbox with CSP; it is never executed as system code or promoted over runtime files.

[GAIA portal](https://gaia-memory-portal.machackabook.chatgpt.site) · [Memory bridge](https://gaia-nexus-memory-bridge.machackabook.chatgpt.site) · [Authenticated MCP](https://gaia-nexus-memory-bridge.machackabook.chatgpt.site/mcp).

Import `docs/GAIA_MEMORY_HANDOFF.json` in a compatible MCP client and authenticate there. The optional local **Verify GAIA MCP access** endpoint performs MCP initialize + tools/call using a process-only `GAIA_MEMORY_TOKEN` issued to this client; it does not borrow ChatGPT's connector authorization. No private memory is copied into this repository. A successful connector memory_status was observed during authoring on 2026-10-30; that does not authenticate future installations.

## Supplied layers and extension boundary

`layers/manifest.json` records all 20 supplied files, exact byte counts, SHA-256 and handling. Thirteen complete requested text layers are preserved (plus the incomplete index placeholder); original archives/PDFs have provenance receipts. The arithmetic HTML has NUL bytes and is quarantined by receipt. Reference shell layers include `--yolo`, destructive sync, mounts, clipboard execution and unbounded daemons; those behaviors are not activated by this bootstrap. The existing HyperTerminal bundle is an upstream source, not a new runtime dependency or a verified full integration.

The Python Koopman engine and Mathematica patch are retained as optional extensions. `tools/extensions.py koopman -- ...` passes explicit CLI arguments to the preserved numerical engine; install `requirements-math.txt` separately in an isolated environment. `tools/extensions.py mathematica` checks wolframscript readiness and prints the dependency contract. The WL patch requires a caller-defined `AdvancedLiftDictionary`; its presence does not prove scientific consciousness metrics or a passing run. The uploaded proof manifest describes its own prior numerical run.

Total Commander WFX/WCX/WDX/WLX plugins require native host/ABI adapters and individual license/security review. They do not execute in HTML or automatically provide verified OS credential storage. `docs/capabilities.json` records connector states and official catalog links. attachInternals supplies custom element internals, especially forms/accessibility; attachShadow supplies encapsulation; sandboxed frames supply isolation. libtidy would clean markup, not grant cross-origin access. No native plugin bridge, J9 engine, local LLM, distributed peer fan-out or browser-extension auto-install is claimed.

`UNIOMNI_STAGE0.sh` is a self-preserving installer, not a formal mathematical quine. EPUB export is an EPUB 3 documentation container, not an executable shell engine. Optional `tools/extensions.py iso --output path.iso` uses an already installed xorriso to make a data ISO, never writes a disk. “fnz” and “iso beat” have no supplied executable specification and remain named unresolved requirements in the capability manifest.

## GitHub and Cloudflare

The public Cloudflare Worker is a separate source/download landing page and health manifest. It has no private vault or local control API. It links this repository and GAIA; it does not pretend to run a visitor's local environment. No existing crypticnews.org DNS records are changed. `cloudflare/wrangler.jsonc` can redeploy it with an account-scoped Workers edit token. GitHub CI uses contents:read and performs verification, Python contracts, JavaScript syntax, installer smoke test and packaging consistency. No unattended source pushes or private log uploads are enabled.

Build the reviewed monolith: `python3 tools/package.py`; verify: `python3 tools/verify.py`; test: `python3 -m unittest discover -s tests -v`. Keep the Git commit and release hash externally as your trust anchor. A self-contained embedded hash detects accidental corruption, not an attacker who rewrites both payload and hash.

Copyright: The Architect / Nexus / Cryptic News LLC / Project: The Nexus Generation: GaiaSSoul / SERIES: The Nexus of Gaia / ID: 137451921129154222|040592|433855274. Upstream layers retain their own notices. No blanket license for all Ghisler plugins is asserted.
