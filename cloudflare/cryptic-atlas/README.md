# CRYPTIC Atlas HarvesterWebOmni

This is an additive Cloudflare Worker for bounded, mission-directed public-source discovery. It does not replace `cloudflare/worker.mjs`, the UNIOMNI Public Knowledge Browser, or the existing Pages Sentinel.

## Promise and flow

`ENTRY — DISCOVERY — SOURCE — EXTRACTION — COMMITMENT — TRANSFORM — VERIFICATION — ATLAS NODE — OUTCOME — RETURN TO ENTRY`

The em dash is a readable lineage connector, not a security primitive. HCCGN is a first-class coordinator. Every traversal skip must be recorded; the original source commitment is never overwritten by a derived interpretation.

## Search manifest

The default manifest targets food security, economic inclusion, resource coordination, accessibility, public accountability, and foundational research. Initial seeds: USDA ERS Food Access Research Atlas, USDA FNS, Feeding America, Arkansas Foodbank, Census, BLS, EPA sustainable food management, WFP, FAO, and World Bank. Geography: global, United States, Arkansas. Languages in the manifest: English, Spanish, French, Arabic, Portuguese, Chinese, and Hindi.

The Worker follows only HTTPS links on the exact host allowlist derived from the configured seeds. It is a bounded crawler, not an unrestricted search-engine spider or exhaustive web index. Query terms classify the mission; provider search discovery is a separate operation.

## Guardrails

- Respect robots.txt; fail closed if the robots policy cannot be fetched.
- No authentication, paywall, CAPTCHA, rate-limit, or access-control bypass.
- No personal profiles, recipient-level records, credentials, cookies, or private systems.
- Page, depth, host, link, byte, and delay budgets are enforced.
- Raw page bodies are not persisted; metadata and SHA-256 commitments are.
- Fetched text is untrusted data, never executable instructions.
- A hash commits to bytes; it does not prove authorship, truth, or invertibility.

## HCCGN and stride

Header: `HCCGN|BLOCK:{height}|STRIDE:{s}|PREV:{prevHash}`. Stride selection is coprime to each traversal batch size. Forward and reverse orderings are deterministic. Skips carry index, target, and reason; they do not skip integrity checks.

## Routes

- `GET /health` — readiness and privacy boundary.
- `GET /manifest` — bounded scope and limits.
- `POST /run` — manual run, requires `Authorization: Bearer <ATLAS_RUN_TOKEN>`.
- Scheduled execution uses the Wrangler cron only after deployment.

## Deployment is intentionally gated

Copy `wrangler.toml.example` to a local `wrangler.toml`, create/approve a dedicated D1 database, apply `migrations/0001_init.sql`, and set any manual-run secret outside Git. Do not bind the existing `cryptic-sos-mesh` or `cryptics` resources until their intended use is explicitly approved. Do not alter the existing Pages Sentinel schedule or routes.

## Verify

```bash
node --check cloudflare/cryptic-atlas/worker.mjs
node --test tests/cryptic-atlas.test.mjs
python3 -c "import sqlite3,pathlib; c=sqlite3.connect(':memory:'); c.executescript(pathlib.Path('cloudflare/cryptic-atlas/migrations/0001_init.sql').read_text()); print('D1 migration schema OK')"
```
