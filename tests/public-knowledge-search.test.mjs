import test from "node:test";
import assert from "node:assert/strict";
import worker from "../cloudflare/knowledge-search/worker.mjs";

async function request(path, method = "GET") {
  return worker.fetch(new Request("https://example.test" + path, { method }), {}, {});
}

test("serves the public browser with a per-response CSP nonce", async () => {
  const response = await request("/uniomni/");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /Public Knowledge Browser/);
  assert.match(html, /Clear UI/);
  assert.match(response.headers.get("content-security-policy"), /script-src 'nonce-[a-f0-9]+'/);
  assert.match(response.headers.get("content-security-policy"), /connect-src 'self'/);
  assert.equal(response.headers.get("x-frame-options"), "DENY");
});

test("health explicitly confirms that private memory is not exposed", async () => {
  const response = await request("/uniomni/api/health");
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.private_memory_exposed, false);
  assert.equal(body.memory_bridge, "owner-authenticated-link-only");
  assert.ok(body.public_index_records >= 10);
});

test("search returns curated public sources and labels draft work honestly", async () => {
  const response = await request("/uniomni/api/search?q=tdoc");
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.private_memory_exposed, false);
  assert.ok(body.results.some((item) => item.id === "tdoc-lineage-review"));
  assert.ok(body.results.every((item) => item.href.startsWith("https://")));
  assert.ok(body.results.every((item) => item.status));
  assert.ok(body.results.every((item) => !JSON.stringify(item).includes("MESH_SIGNING_SECRET")));
});

test("search supports the workers.dev root path as well as the crypticnews prefix", async () => {
  const response = await request("/api/search?q=cryptic");
  const body = await response.json();
  assert.ok(body.results.some((item) => item.id === "cryptic-repository"));
});

test("index only publishes curated references and owner-authenticated destinations", async () => {
  const response = await request("/uniomni/api/index");
  const body = await response.json();
  assert.equal(body.scope, "curated-public-sources-only");
  assert.equal(body.private_memory_exposed, false);
  assert.equal(body.count, body.results.length);
  const portal = body.results.find((item) => item.id === "gaia-memory-portal");
  assert.equal(portal.status, "owner sign-in required");
});

test("rejects oversized queries and unsupported methods", async () => {
  const tooLong = await request("/api/search?q=" + "x".repeat(161));
  assert.equal(tooLong.status, 400);
  const post = await request("/api/search", "POST");
  assert.equal(post.status, 405);
  assert.equal(post.headers.get("allow"), "GET, HEAD");
});

test("does not serve arbitrary paths", async () => {
  const response = await request("/uniomni/private-memory");
  assert.equal(response.status, 404);
});
