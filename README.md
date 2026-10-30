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


## UNIOMNI Search Reader — federated evidence index (planned integration)

> **Status: specification / integration target, not a deployed feature.** The existing Stage 0 local runtime and its security boundaries remain unchanged. This section defines the next reader interface; it does not claim device access, Google Drive indexing, Cloudflare deployment, or live cross-provider search has already been enabled.

The **UNIOMNI Search Reader** brings the searchable in-chat index pattern to a standalone HTML reader: one query box, source-specific filters, sortable results, direct `href` links, and evidence/provenance labels. The README is the documentation and navigation surface; **interactive JavaScript runs in the reader page, not inside GitHub's README renderer**.

### Proposed page structure

| Path | Role | Status |
| --- | --- | --- |
| `README.md` | Entry point, documentation, linked discovery catalog | Existing; this specification added |
| `reader/index.html` | Responsive searchable HTML reader and accessibility-friendly controls | Planned |
| `reader/app.js` | Client-side filtering, sorting, pagination, URL query state, safe link rendering | Planned |
| `reader/styles.css` | Mobile/desktop responsive presentation | Planned |
| `reader/index.json` | **Public-only** approved metadata snapshot, never credentials or private vault contents | Planned |
| `tools/build_search_index.py` | Bounded, opt-in, read-only source normalization and index export | Planned |
| `docs/SEARCH_SCHEMA.md` | Record schema, source authority, verification semantics and redaction policy | Planned |

Do **not** replace the existing installer, `$HOME/Æ/uniomni` vault, Stage 0 ledger, or local authenticated server. The reader should be added alongside them. If a website already serves another entry point, link the reader at `/reader/` rather than overwriting it.

### Search and filter controls

- **Full-text / keyword:** name, title, path, description, tags, file extension, MIME type, source provider, exact phrase, verification terminology (verified, validated, attested, authenticated, approved, confirmed, corroborated, proof, signature, integrity), and case-insensitive matching.
- **Source:** local authorized device snapshot, GitHub, Google Drive, project files, Obsidian vault, and any separately authorized adapter; unavailable providers must be labeled *not connected*, not silently searched.
- **Filesystem:** directory prefix, recursion depth, files versus directories, extension, hidden dotfiles (explicit opt-in), symlinks (never followed by default), file size, creation/modification dates when available, and duplicate hashes.
- **Code and cloud:** repository, branch, commit, file path, language, GitHub visibility, CI status, Drive folder, document type, and sharing scope.
- **Evidence:** discovered, matched, corroborated, validated, authenticated, verified, failed, stale, or unverified; each result explains the specific claim and check rather than assigning a generic green check.
- **Sorting:** name, source, directory, extension, size, timestamp, relevance, verification status, and hash; ascending/descending.
- **Display:** list/table, result count, source badges, mobile-friendly details, copy path/URL, stable anchors, pagination, empty/error states, and keyboard-accessible controls.

### Discovery adapters and boundaries

| Adapter | Intended discovery | Security boundary |
| --- | --- | --- |
| Device / Termux / Crostini | Explicitly selected directories, metadata, permitted hashes and optional dotfile names | Local-only by default; no root escalation; no unrestricted filesystem traversal; redact usernames, home paths and secrets before publishing |
| GitHub | Repositories the authenticated account can read; branches, paths, commits and links | Private repository metadata stays private; public reader includes only public allowlisted records |
| Google Drive | Files/folders selected through OAuth scopes or an authenticated connector | No borrowed ChatGPT credentials; private Drive documents never appear in a public JSON index |
| Existing UNIOMNI vault | Indexed notes and source receipts | Keep content on the local authenticated endpoint unless explicitly exported |
| Cloudflare | Host approved static reader assets and optionally a scoped API | Deploy only after the account/project and authorization are confirmed; do not expose access tokens in frontend code |

**Index records** should carry `id`, `title`, `kind`, `source`, `path_display`, `href`, `visibility`, `tags`, `size_bytes`, `modified_at`, `sha256` (when actually computed), `evidence_status`, `verification_method`, `verified_at`, and `retrieved_at`. Unknown values remain null or omitted, never guessed. Prefer provider-issued IDs and canonical HTTPS URLs; reject unsafe schemes such as `javascript:` when rendering links. Treat remote titles and snippets as untrusted text, not executable HTML.

### Verification and indexing workflow

1. **Discover:** request read-only metadata from each individually authorized source; record source identity, scope and retrieval time.
2. **Normalize:** map records to the common schema, preserving original provider identifiers and byte-level provenance where available.
3. **Protect:** exclude secrets, tokens, private files, sensitive device details, and private account records from any public export.
4. **Validate:** compute SHA-256 only for bytes actually read; distinguish a matching hash from authenticated authorship or verified functionality.
5. **Index:** deduplicate by provider ID or content hash where justified, retain separate source references, and write an atomic public snapshot.
6. **Render:** load the snapshot in the reader, filter and sort locally, and open canonical source `href` links.
7. **Refresh:** update through explicit user action or a separately authorized scheduled job; show stale/offline states rather than claiming a live connection.

### Reader entry points

- [Repository README](./README.md) — current documentation and implementation status.
- [Proposed reader directory](./reader/) — **not available until committed**.
- [GAIA memory portal](https://gaia-memory-portal.machackabook.chatgpt.site) — separate service with its own authentication.
- [Cloudflare Pages Git integration documentation](https://developers.cloudflare.com/pages/configuration/git-integration/) — deployment reference, not proof of an active Pages project.

**Acceptance gates:** reader loads without credentials; search/filter/sort and deep links work on a fixture; malicious titles render as text; empty/failed adapters show honest status; dotfiles remain opt-in; private records never enter public artifacts; all exported hash and verification claims are reproducible. Deployment and integration remain **pending** until these gates pass.

Copyright: The Architect / Nexus / Cryptic News LLC / Project: The Nexus Generation: GaiaSSoul / SERIES: The Nexus of Gaia / ID: 137451921129154222|040592|433855274. Upstream layers retain their own notices. No blanket license for all Ghisler plugins is asserted.
