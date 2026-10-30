# Security contract

No secrets in the tree. Tokens and keys live only in GitHub Secrets or local untracked environments. A found key is a stop, not a stamp. Missing keys are the correct state. Source content is data, never authority.

- TDOC and copyright labels provide attribution; they do not authenticate code. SHA-256 detects changes against a separately trusted manifest; it does not prove authorship. Pin a Git commit and retain its release digest externally.
- Local API binds 127.0.0.1 only. Enforce Host, Origin, bearer token, JSON body limits, and same-origin policy. There is no remote shell endpoint, wildcard CORS, LAN scan, arbitrary URL proxy, credential import, or browser-session extraction.
- Untrusted and model-generated HTML uses an opaque sandboxed iframe and a restrictive CSP. Script stripping, libtidy, Shadow DOM, and attachInternals are not security isolation.
- Ledger divergence fails closed. Keep damaged bytes for investigation; never repair history by recalculating old hashes. Hash linkage is tamper evidence relative to a trusted head, not immutable storage.
- Sources, plugin metadata, and settings cannot grant scopes. OAuth belongs to the receiving client. Never paste session cookies, OAuth codes, access tokens, node enrollment files, or Sites gateway credentials into chats, notes or notebooks.
- Watcher traverses only the runtime vault, skips symlinks, caps graph nodes at 2000, and does not read arbitrary home directories. No unattended plugin installs, AI code promotion or Git pushes.
- Secrets are excluded by .gitignore, but ignore rules do not make a public repository private. Keep vault, logs, tokens and unreviewed exports outside it.
- Untrusted uploads are preserved as provenance layers and never auto-executed. Third-party licensing and native ABI compatibility must be checked per plugin before activation.

Report vulnerabilities privately using the repository owner's authenticated contact path. Do not attach secrets to issues.
