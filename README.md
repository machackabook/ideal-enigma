# UNIOMNI Stage 0 · v1.0.0

## 🔎 SEARCH UNIOMNI — README index entry

**[⌕ TAP HERE TO TYPE A SEARCH QUERY — IDEAL-ENIGMA](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma&type=code)**

> **Search input:** the link opens GitHub's real, typeable search box already scoped to this repository. Enter a filename, keyword, exact phrase, extension, or code symbol and press Enter. This requires no custom JavaScript. GitHub README Markdown itself cannot host a functioning text-input/filter widget; an HTML `<input>` placed here would be inert or sanitized, so this index does not pretend otherwise.

**Find in this page:** use **Find in page** (mobile browser menu or Ctrl+F) to type a term and search the actual README records below.

**Quick query links:** [All files](https://github.com/machackabook/ideal-enigma/tree/main) · [Verified / proof](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma+verified&type=code) · [SHA-256](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma+SHA-256&type=code) · [Dotfiles](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma+path%3A.*&type=code) · [Markdown](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma+path%3A*.md&type=code) · [Python](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma+path%3A*.py&type=code) · [JavaScript](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma+path%3A*.js&type=code)

**Browse indexed records:** [File directory](#repository-file-directory) · [Local vault](#runtime-and-vault-paths) · [Cloud sources](#cloud-and-memory-source-directory) · [Verification terms](#verification-keyword-index) · [Coverage](#discovery-coverage-and-privacy).

**Target separation:** **README.md = primary searchable Markdown catalog**; `index.html` = separate runtime/web application, never a prerequisite for README search.

---

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


## UNIOMNI README Search Index — live Markdown directory

> **This README.md IS the searchable index.** It is not a specification pointing to `index.html`. The separately served HTML landing page is an independent interface and is **not** required to browse this index. GitHub renders the directory tables, anchors, hyperlinks, and keyword text below directly inside its README viewer. Browser **Find in page** searches the rendered index; GitHub repository/code search searches content beyond the entries shown here. GitHub does not execute custom JavaScript inside README files, so dropdowns and live client-side sorting cannot run here.

### 🔎 Search this index

**Find in this README:** use your browser's Find command (Ctrl+F / Find in page) for any filename, directory, phrase, extension, source, or evidence term. **Filter by category:** use the linked sections. **Search repository content:** follow the GitHub search links below. The tables are arranged by source and filename for predictable scanning; column-header sorting is not supported in GitHub Markdown.

| Search target | Open search |
| --- | --- |
| All repository code | [Search ideal-enigma](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma&type=code) |
| Verification / evidence | [verified OR proof](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma+%28verified+OR+proof%29&type=code) |
| Hash / integrity | [SHA-256](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma+SHA-256&type=code) |
| Hidden dotfile names | [Dotfile path search](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma+path%3A.*&type=code) |
| Markdown documents | [*.md paths](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma+path%3A*.md&type=code) |
| JavaScript | [*.js paths](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma+path%3A*.js&type=code) |
| Python | [*.py paths](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma+path%3A*.py&type=code) |
| All repository files | [GitHub file tree](https://github.com/machackabook/ideal-enigma/tree/main) |

**Jump to:** [Repository files](#repository-file-directory) · [Runtime and vault](#runtime-and-vault-paths) · [Cloud and memory](#cloud-and-memory-source-directory) · [Evidence keywords](#verification-keyword-index) · [Discovery coverage](#discovery-coverage-and-privacy) · [HTML distinction](#readme-versus-html-separate-targets).

### Repository file directory

These are **direct file/directory navigation links inferred from the existing Stage 0 README**. The README documents these paths; this table does not assert that every linked path was individually fetched and byte-verified in this indexing pass.

| Name / path | Kind | Keywords / function | Link | Evidence |
| --- | --- | --- | --- | --- |
| `README.md` | Markdown | index, documentation, search, source | [Open](./README.md) | **Fetched and updated** |
| `UNIOMNI_STAGE0.sh` | Shell | installer, bootstrap, serve, stage0 | [Open](./UNIOMNI_STAGE0.sh) | Documented path |
| `layers/manifest.json` | JSON | layers, byte count, SHA-256, provenance | [Open](./layers/manifest.json) | Documented path |
| `docs/GAIA_MEMORY_HANDOFF.json` | JSON | MCP, memory, handoff, authentication | [Open](./docs/GAIA_MEMORY_HANDOFF.json) | Documented path |
| `docs/capabilities.json` | JSON | connectors, availability, catalog | [Open](./docs/capabilities.json) | Documented path |
| `tools/extensions.py` | Python | Koopman, Mathematica, optional extension | [Open](./tools/extensions.py) | Documented path |
| `tools/package.py` | Python | build, monolith, packaging | [Open](./tools/package.py) | Documented path |
| `tools/verify.py` | Python | verify, validation, integrity | [Open](./tools/verify.py) | Documented path |
| `tests/` | Directory | tests, unittest, verification | [Browse](./tests/) | Documented path |
| `cloudflare/wrangler.jsonc` | Config | Cloudflare Worker, deploy, configuration | [Open](./cloudflare/wrangler.jsonc) | Documented path |

### Runtime and vault paths

These are **local device paths**, not public GitHub hyperlinks and not proof that any remote device was scanned.

| Local path / command | Type | Search terms | Visibility |
| --- | --- | --- | --- |
| `$HOME/Æ/uniomni` or `UNIOMNI_HOME` | Runtime directory | state, notes, logs, ledger | Local/private |
| `$HOME/Æ/uniomni/vault` (vault location as configured) | Knowledge directory | Obsidian, Markdown, notes | Local/private |
| `$AE/bin/uniomni` | CLI | command, launcher | Local/private |
| `$AE/autonomous` | Installer archive location | SS, bootstrap, preservation | Local/private |
| `uniomni cycle` | Command | Observe, Digest, Integrate, Stabilize, Shed | Local execution |
| `uniomni verify` | Command | checks, hash, ledger | Local execution |
| `uniomni watch --interval 90` | Command | monitoring, refresh | Local execution |

### Cloud and memory source directory

These are **navigation references**, not a public export of private Drive files or evidence of a live synchronized database.

| Provider / source | Search terms | Link | State |
| --- | --- | --- | --- |
| GitHub repository | code, commit, directory, README | [ideal-enigma](https://github.com/machackabook/ideal-enigma) | Repository located; README writable |
| GitHub history | commit, audit, change, lineage | [Commits](https://github.com/machackabook/ideal-enigma/commits/main/) | Navigation link |
| GitHub workflows | CI, tests, build, verified | [Actions](https://github.com/machackabook/ideal-enigma/actions) | Navigation link; no run claim |
| GAIA Memory Portal | memory, notes, knowledge | [Portal](https://gaia-memory-portal.machackabook.chatgpt.site) | External service; auth independent |
| GAIA Memory Bridge | bridge, MCP, identity | [Bridge](https://gaia-nexus-memory-bridge.machackabook.chatgpt.site) | External service; auth independent |
| Cloudflare | Workers, Pages, deploy | [Project configuration](./cloudflare/wrangler.jsonc) | Documented source path |
| Google Drive | files, folders, documents, provenance | [Drive](https://drive.google.com/drive/u/0/my-drive) | **User-authenticated navigation only**; no public file inventory |
| Device directories | Termux, Crostini, dotfiles, filesystem | Local authorized scanner (not yet integrated into README) | **Not scanned remotely** |

### Verification keyword index

Use browser Find or [GitHub code search](https://github.com/search?q=repo%3Amachackabook%2Fideal-enigma&type=code) with these indexed terms:

| Category | Search keywords / phrases |
| --- | --- |
| Validation | verified, verify, verification, validated, valid, validity, confirmed, confirmation, cross-verified, tested, passed, accepted, certified |
| Proof | proof, proven, evidence, corroborated, substantiated, documented, witnessed, reproducible, source of truth, chain of custody |
| Agreement | agreed, agreement, consensus, concurrence, acknowledged, affirmed, authorized, approved, signed off, ratified |
| Security | SHA-256, checksum, hash match, signature, integrity, authenticity, provenance, attestation, certificate, authenticated, tamper-evident |
| Engineering | CI green, build succeeded, test passed, heartbeat, operational, release, quality assurance, peer review, gate passed |
| Visual | checkmark, green tick, verified badge, certificate, audit stamp, seal of approval, status dashboard, signed receipt |
| File discovery | .md, .json, .js, .py, .sh, .html, .css, dotfile, hidden, directory, symlink, MIME, bytes, modified |

**Evidence levels:** discovered ≠ matched ≠ corroborated ≠ validated ≠ authenticated ≠ verified. A word or badge is never proof by itself. `SHA-256` in a description does not mean that this index independently recomputed the file's hash.

### Discovery coverage and privacy

| Source | Indexed here | Live automatic sync | Boundary |
| --- | --- | --- | --- |
| Existing README | Yes, actual navigable Markdown entries | No | Public |
| Repository files | Documented file links and GitHub search entry points | GitHub navigation, not an index crawler | Public repository |
| GitHub account-wide discovery | Not exported into this README | No | Private repositories excluded |
| Google Drive | Provider link only | No | Requires scoped consent and publication review |
| Device / Termux / Crostini | Documented local path labels | No | No remote scan or dotfile disclosure |
| Obsidian vault | Path and command references | No | Local/private |
| Cloudflare | Configuration path and service references | No | No deployment claimed |

**Publishing rule:** only deliberately approved, public metadata may be inserted into this README. Never publish tokens, private repository names, private Drive records, hidden-file contents, device identifiers, full home-directory paths, or sensitive logs. A future index refresh may update Markdown tables through a reviewed, least-privilege commit, with a timestamp and provenance record.

### README versus HTML: separate targets

| Surface | Purpose | Execution |
| --- | --- | --- |
| **`README.md` — THIS SEARCH INDEX** | Native searchable Markdown directory, anchors, source links, keyword tables, provider filters by section, GitHub search queries | **Works in GitHub's README viewer now**, without HTML or JavaScript |
| `index.html` / existing UNIOMNI landing page | Separate visual application, runtime interaction, advanced filters, local authentication | Runs only when its own web server/deployment is available |
| Optional future `reader/` | Independent richer UI, if explicitly requested | **Not required** for the README index |

**README acceptance check:** repository README renders the directory tables; anchors navigate within the README; links open their stated targets when those files exist; Find in page finds indexed phrases; GitHub search links open repository-scoped searches. Advanced live sorting, provider API querying and filesystem scanning are **not** GitHub README capabilities and are not falsely represented as active.

Copyright: The Architect / Nexus / Cryptic News LLC / Project: The Nexus Generation: GaiaSSoul / SERIES: The Nexus of Gaia / ID: 137451921129154222|040592|433855274. Upstream layers retain their own notices. No blanket license for all Ghisler plugins is asserted.
