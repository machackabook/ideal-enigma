# UNIOMNI Public Knowledge Browser

This directory contains a separate, read-only Cloudflare Worker for the public UNIOMNI / GAIA / NEXUS / Cryptic index.

## Public routes

- `/uniomni/` — searchable public knowledge browser.
- `/uniomni/api/health` — readiness and privacy boundary.
- `/uniomni/api/index` — curated public index.
- `/uniomni/api/search?q=...` — bounded keyword search (maximum 160 characters).

The Worker also supports the same paths at its workers.dev root for preview.

## Privacy and memory boundary

The Worker does **not** connect to or query private GAIA memory. It serves only the static, curated references embedded in `worker.mjs`. The GAIA Memory Portal and MCP endpoint are links to a separate owner-authenticated service. Users authenticate independently in that service or a compatible MCP client. No OAuth token, bridge token, memory record, device identity, private ledger, or local vault content is embedded in this public Worker.

S.O.S is linked as an Access-protected endpoint. The source review link is labeled as a draft; no end-to-end agent pairing or production verification is implied.

## Cloudflare deployment

The intended Cloudflare account is the account that owns the active `crypticnews.org` zone. Deploy this Worker as `uniomni-public-search`, then attach the route `crypticnews.org/uniomni*`. Do not change the existing apex, `/nexus/*`, `/api/*`, or `bus.` routes.

With Wrangler authenticated to the intended account:

```bash
npx wrangler deploy --config cloudflare/knowledge-search/wrangler.toml
```

The Worker has no secrets, D1, KV, R2, or Durable Object bindings. The route is additive and can be rolled back by removing only the `crypticnews.org/uniomni*` route or reverting the Worker version.

## Verification

```bash
node --check cloudflare/knowledge-search/worker.mjs
node --test tests/public-knowledge-search.test.mjs
```

The test suite covers the browser response, nonce-based CSP, health contract, search results, privacy boundary, bounded query handling, methods, and not-found behavior.
