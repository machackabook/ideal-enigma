const BASE_PATH = "/uniomni";
const PORTAL = "https://gaia-memory-portal.machackabook.chatgpt.site";
const BRIDGE = "https://gaia-nexus-memory-bridge.machackabook.chatgpt.site";
const CRYPTIC = "https://crypticnews.org";
const REPO = "https://github.com/machackabook/ideal-enigma";

const PUBLIC_INDEX = Object.freeze([
  {
    id: "ideal-enigma-readme",
    title: "UNIOMNI Stage 0 — repository search console",
    summary: "The public README describes the local vault, bounded observation cycle, SHA-256 release verification, EPUB export, optional model adapter, and the boundary between local and hosted capabilities.",
    tags: ["uniomni", "stage 0", "readme", "repository", "search", "vault", "integrity"],
    source: "ideal-enigma",
    status: "public",
    href: "https://github.com/machackabook/ideal-enigma/blob/main/README.md"
  },
  {
    id: "uniomni-installer",
    title: "UNIOMNI Stage 0 installer",
    summary: "A self-preserving local installer for supported Linux, Crostini, macOS, and Termux environments. It verifies its embedded archive, installs a versioned local runtime, and does not modify partitions or require root.",
    tags: ["installer", "termux", "crostini", "linux", "macos", "python", "shell"],
    source: "ideal-enigma",
    status: "public",
    href: "https://github.com/machackabook/ideal-enigma/blob/main/UNIOMNI_STAGE0.sh"
  },
  {
    id: "uniomni-runtime",
    title: "UNIOMNI local runtime",
    summary: "Local-only source ingestion, SHA-256 deduplication, hash-linked ledger, bounded vault topology, and release/shadow verification. It is not a hosted file service.",
    tags: ["runtime", "python", "ledger", "sha256", "vault", "local", "verification"],
    source: "ideal-enigma",
    status: "public",
    href: "https://github.com/machackabook/ideal-enigma/blob/main/runtime/uniomni.py"
  },
  {
    id: "uniomni-worker",
    title: "UNIOMNI public Cloudflare landing worker",
    summary: "The existing public worker exposes a landing page and health metadata only. It does not access a visitor's local vault, credentials, or private memory.",
    tags: ["cloudflare", "worker", "public", "health", "edge"],
    source: "ideal-enigma",
    status: "public",
    href: "https://github.com/machackabook/ideal-enigma/blob/main/cloudflare/worker.mjs"
  },
  {
    id: "gaia-memory-handoff",
    title: "GAIA Memory Bridge handoff contract",
    summary: "A portable connection guide for an OAuth-protected Streamable HTTP MCP endpoint. It contains no memory records or credentials; receiving clients authenticate independently.",
    tags: ["gaia", "memory", "bridge", "mcp", "oauth", "handoff", "privacy"],
    source: "ideal-enigma",
    status: "public guide",
    href: "https://github.com/machackabook/ideal-enigma/blob/main/docs/GAIA_MEMORY_HANDOFF.json"
  },
  {
    id: "gaia-memory-portal",
    title: "GAIA Memory Portal",
    summary: "Owner-authenticated portal for private project memory. This public index links to the portal but never returns private memory records.",
    tags: ["gaia", "memory", "portal", "owner", "authenticated"],
    source: "gaia-memory-bridge",
    status: "owner sign-in required",
    href: PORTAL
  },
  {
    id: "gaia-memory-mcp",
    title: "GAIA Nexus Memory Bridge — MCP endpoint",
    summary: "Owner-authenticated Streamable HTTP MCP endpoint. Use an authorized compatible client and its independent OAuth session; browser sign-in is not transferred.",
    tags: ["gaia", "nexus", "memory", "mcp", "oauth", "authenticated"],
    source: "gaia-memory-bridge",
    status: "owner sign-in required",
    href: BRIDGE + "/mcp"
  },
  {
    id: "cryptic-repository",
    title: "Cryptic — public source and capability boundaries",
    summary: "The browser-first public command environment separates browser-executable features from native, provider, and device operations that require authenticated adapters.",
    tags: ["cryptic", "nexus", "hyperterminal", "source", "security", "capabilities"],
    source: "Cryptic",
    status: "public",
    href: "https://github.com/machackabook/Cryptic"
  },
  {
    id: "cryptic-public",
    title: "Cryptic News — public entry",
    summary: "Public Cryptic News entry point. The root page and the HyperTerminal route are separate public surfaces.",
    tags: ["cryptic", "crypticnews", "public page", "gateway"],
    source: "Cryptic",
    status: "public",
    href: CRYPTIC + "/"
  },
  {
    id: "cryptic-hyperterminal",
    title: "Cryptic HyperTerminal",
    summary: "The public browser-facing HyperTerminal surface, routed separately from protected private APIs and local native bridges.",
    tags: ["cryptic", "hyperterminal", "nexus", "browser", "terminal"],
    source: "Cryptic",
    status: "public",
    href: CRYPTIC + "/nexus/"
  },
  {
    id: "sos-protected-api",
    title: "S.O.S / Cryptic mesh API",
    summary: "Protected S.O.S mesh API route. Cloudflare Access authentication is required; this index does not contain bridge tokens, agent secrets, or private job data.",
    tags: ["sos", "cryptic", "mesh", "cloudflare", "access", "protected"],
    source: "Cryptic",
    status: "owner authentication required",
    href: CRYPTIC + "/api/cryptic-mesh/"
  },
  {
    id: "sos-mesh-review",
    title: "S.O.S mesh integration — source review",
    summary: "Public draft pull request for the Cryptic-owned mesh gateway. The PR explicitly leaves agent pairing and the complete request-to-result cycle unverified.",
    tags: ["sos", "mesh", "gateway", "cryptic", "draft", "review"],
    source: "Cryptic",
    status: "draft — not production verified",
    href: "https://github.com/machackabook/Cryptic/pull/27"
  },
  {
    id: "tdoc-lineage-review",
    title: "TDOC 00000–10124 lineage integration",
    summary: "Public draft for evidence-first sequential TDOC catalog discovery. The PR does not claim that every historical record exists or that archived scripts are executable.",
    tags: ["tdoc", "lineage", "catalog", "evidence", "ideal-enigma", "draft"],
    source: "ideal-enigma",
    status: "draft — validation outstanding",
    href: "https://github.com/machackabook/ideal-enigma/pull/1"
  },
  {
    id: "gaia-nexus-generation",
    title: "Gaia — The Nexus Generation",
    summary: "Public project repository for the GAIA / NEXUS architecture and its documented source lineage.",
    tags: ["gaia", "nexus", "generation", "architecture", "source"],
    source: "Gaia-The-Nexus-Generation",
    status: "public",
    href: "https://github.com/machackabook/Gaia-The-Nexus-Generation"
  }
]);

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cache-Control": "public, max-age=60",
  "X-Robots-Tag": "noindex, nofollow"
};

function json(data, status = 200, head = false) {
  return new Response(head ? null : JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function normalizedPath(pathname) {
  if (pathname === BASE_PATH) return "/";
  if (pathname.startsWith(BASE_PATH + "/")) return pathname.slice(BASE_PATH.length) || "/";
  return pathname || "/";
}

function searchIndex(query) {
  const terms = String(query || "").toLowerCase().trim().split(/\s+/).filter(Boolean).slice(0, 8);
  if (!terms.length) return PUBLIC_INDEX.slice(0, 8);
  return PUBLIC_INDEX.map((entry) => {
    const title = entry.title.toLowerCase();
    const tags = entry.tags.join(" ").toLowerCase();
    const summary = entry.summary.toLowerCase();
    const source = entry.source.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (title.includes(term)) score += 5;
      if (tags.includes(term)) score += 3;
      if (summary.includes(term)) score += 2;
      if (source.includes(term)) score += 1;
    }
    return { entry, score };
  })
    .filter((item) => item.score > 0 && item.entry.href.startsWith("https://"))
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 20)
    .map((item) => item.entry);
}

function page(nonce) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<title>UNIOMNI · Public Knowledge Browser</title>
<meta name="description" content="Search the curated public GAIA, NEXUS, Cryptic, and UNIOMNI project index. Private memory remains owner-authenticated.">
<style nonce="${nonce}">
:root{color-scheme:dark;font:16px/1.55 Inter,ui-sans-serif,system-ui,sans-serif;background:#050b14;color:#e8f3fb}
*{box-sizing:border-box}html,body{margin:0;min-height:100%;background:#050b14}body{min-height:100vh;overflow-x:hidden}
#sky{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;background:radial-gradient(ellipse at 18% 18%,#173c53 0,transparent 48%),radial-gradient(ellipse at 80% 76%,#1b2852 0,transparent 44%),linear-gradient(145deg,#050b14,#081624 55%,#090d1e)}
.topbar{position:fixed;z-index:3;top:14px;left:14px}
button,input{font:inherit}.toggle{border:1px solid #80c8d7;background:#071522dd;color:#d8f5ff;border-radius:999px;padding:9px 14px;cursor:pointer;backdrop-filter:blur(12px)}
.shell{position:relative;z-index:1;max-width:1040px;margin:0 auto;padding:84px 22px 48px;transition:opacity .25s ease,transform .25s ease}
.hero{max-width:780px;margin:0 auto 28px;text-align:center}.eyebrow{letter-spacing:.18em;text-transform:uppercase;color:#84c9d9;font-size:.75rem}
h1{font-size:clamp(2.3rem,7vw,5.3rem);line-height:1.02;letter-spacing:-.045em;margin:.3em 0;color:#f1fbff}
.lede{color:#b8cbd9;max-width:680px;margin:0 auto 22px}
.search{display:flex;gap:10px;max-width:760px;margin:0 auto;background:#0b1a29dd;border:1px solid #31546a;border-radius:18px;padding:9px;box-shadow:0 22px 80px #0007;backdrop-filter:blur(14px)}
.search input{min-width:0;flex:1;background:transparent;color:#f4fbff;border:0;outline:0;padding:10px 12px}
.search input::placeholder{color:#8299a9}.search button{background:#8bd8df;color:#06202a;border:0;border-radius:12px;padding:10px 17px;font-weight:700;cursor:pointer}
.nav{display:flex;flex-wrap:wrap;justify-content:center;gap:9px;margin:18px 0 34px}.nav a,.links a{color:#b8e9f1;text-decoration:none;border:1px solid #315064;background:#0a1928b8;border-radius:999px;padding:7px 12px;font-size:.88rem}
.nav a:hover,.links a:hover{background:#173349}
.meta{display:flex;justify-content:space-between;gap:12px;align-items:center;color:#91a9b9;font-size:.84rem;margin:0 0 12px}
.results{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:12px}
.card{border:1px solid #27465b;background:#071522d9;border-radius:16px;padding:17px;backdrop-filter:blur(12px);min-height:164px}
.card h2{font-size:1.05rem;margin:0 0 8px;color:#e5f8ff}.card p{color:#b4c7d5;font-size:.92rem;margin:0 0 14px}
.card a{color:#8fe0e6;text-decoration:none}.card a:hover{text-decoration:underline}
.tags{display:flex;flex-wrap:wrap;gap:5px;margin:0 0 12px}.tag{font-size:.72rem;color:#a7c4d1;border:1px solid #284658;border-radius:999px;padding:2px 7px}
.status{font-size:.75rem;color:#e2c78e;margin-bottom:8px}
.footer{color:#8da5b5;text-align:center;font-size:.82rem;margin-top:26px}.footer a{color:#a9e0e7}
.empty{grid-column:1/-1;text-align:center;color:#b4c7d5;border:1px dashed #36576b;padding:28px;border-radius:16px}
body.visualize .shell{opacity:0;transform:scale(.985);pointer-events:none}
body.visualize .topbar{opacity:1}
@media(max-width:620px){.shell{padding:82px 14px 34px}.search{flex-direction:column}.search button{width:100%}.meta{align-items:flex-start;flex-direction:column}}
@media(prefers-reduced-motion:reduce){.shell{transition:none}}
</style>
</head>
<body>
<canvas id="sky" aria-hidden="true"></canvas>
<div class="topbar"><button class="toggle" id="visualize" type="button" aria-pressed="false">Clear UI · Visualize</button></div>
<main class="shell" id="shell">
<section class="hero">
<div class="eyebrow">GAIA · NEXUS · CRYPTIC · UNIOMNI</div>
<h1>Public Knowledge Browser</h1>
<p class="lede">Search the curated public project index. Private GAIA memory remains behind its own owner authentication; this page never exposes private memory records or bridge credentials.</p>
<form class="search" id="searchForm">
<input id="query" type="search" maxlength="160" autocomplete="off" placeholder="Search UNIOMNI, TDOC, Cryptic, S.O.S, memory bridge…" aria-label="Search public project knowledge">
<button type="submit">Search</button>
</form>
<nav class="nav" aria-label="Project destinations">
<a href="https://crypticnews.org/" rel="noopener">Cryptic News</a>
<a href="https://crypticnews.org/nexus/" rel="noopener">HyperTerminal</a>
<a href="https://github.com/machackabook/ideal-enigma" rel="noopener">ideal-enigma</a>
<a href="${PORTAL}" rel="noopener">GAIA Memory Portal ↗</a>
<a href="${BRIDGE}/mcp" rel="noopener">Memory Bridge MCP ↗</a>
<a href="https://crypticnews.org/api/cryptic-mesh/" rel="noopener">S.O.S API · Auth required</a>
</nav>
</section>
<section aria-label="Search results">
<div class="meta"><span id="resultLabel" aria-live="polite">Loading public index…</span><span>Public index only · no private memory retrieval</span></div>
<div class="results" id="results"></div>
</section>
<footer class="footer">UNIOMNI · Public read-only index · <a href="${REPO}">source</a> · <a href="https://github.com/machackabook/Cryptic">Cryptic source</a></footer>
</main>
<script nonce="${nonce}">
(() => {
  const base = location.pathname === "/uniomni" || location.pathname.startsWith("/uniomni/") ? "/uniomni" : "";
  const input = document.getElementById("query");
  const results = document.getElementById("results");
  const label = document.getElementById("resultLabel");
  const form = document.getElementById("searchForm");
  const button = document.getElementById("visualize");
  let timer = 0;
  function render(items, query) {
    results.replaceChildren();
    label.textContent = items.length + " public result" + (items.length === 1 ? "" : "s") + (query ? " for “" + query + "”" : " · curated index");
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No public index matches. Try a project name, module, or document keyword.";
      results.append(empty);
      return;
    }
    for (const item of items) {
      const article = document.createElement("article");
      article.className = "card";
      const state = document.createElement("div");
      state.className = "status";
      state.textContent = item.status;
      const title = document.createElement("h2");
      title.textContent = item.title;
      const desc = document.createElement("p");
      desc.textContent = item.summary;
      const tags = document.createElement("div");
      tags.className = "tags";
      for (const tag of item.tags.slice(0, 5)) {
        const chip = document.createElement("span");
        chip.className = "tag";
        chip.textContent = tag;
        tags.append(chip);
      }
      const link = document.createElement("a");
      link.href = item.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open source ↗";
      article.append(state, title, desc, tags, link);
      results.append(article);
    }
  }
  async function search(query) {
    label.textContent = "Searching public index…";
    try {
      const response = await fetch(base + "/api/search?q=" + encodeURIComponent(query), { headers: { "Accept": "application/json" } });
      if (!response.ok) throw new Error("Search unavailable (" + response.status + ")");
      const data = await response.json();
      render(data.results, query);
    } catch (error) {
      results.replaceChildren();
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = error.message;
      results.append(empty);
      label.textContent = "Search error";
    }
  }
  form.addEventListener("submit", event => { event.preventDefault(); search(input.value.trim()); });
  input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => search(input.value.trim()), 140); });
  button.addEventListener("click", () => {
    const active = document.body.classList.toggle("visualize");
    button.setAttribute("aria-pressed", String(active));
    button.textContent = active ? "Restore UI" : "Clear UI · Visualize";
  });
  search("");
  const canvas = document.getElementById("sky");
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0, height = 0, frame = 0;
  const points = Array.from({length:72}, (_,i) => ({x:(i*7919%997)/997,y:(i*3571%991)/991,r:0.6+(i%4)*0.35,p:(i%9)*0.7}));
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width*dpr); canvas.height = Math.floor(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function draw(time=0) {
    ctx.clearRect(0,0,width,height);
    for (const p of points) {
      const drift = reduced ? 0 : Math.sin(time*0.00018+p.p)*8;
      const x = p.x*width+drift, y = p.y*height;
      ctx.beginPath(); ctx.arc(x,y,p.r,0,Math.PI*2);
      ctx.fillStyle = "rgba(160,220,238,"+(0.22+0.2*Math.sin(time*0.0005+p.p))+")";
      ctx.fill();
    }
    if (!reduced) frame = requestAnimationFrame(draw);
  }
  resize(); window.addEventListener("resize",resize,{passive:true});
  if (reduced) draw(0); else frame = requestAnimationFrame(draw);
  document.addEventListener("visibilitychange",() => {
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    else if (!document.hidden && !reduced && !frame) frame = requestAnimationFrame(draw);
  });
})();
</script>
</body>
</html>`;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = normalizedPath(url.pathname);
    const method = request.method.toUpperCase();
    if (!["GET", "HEAD"].includes(method)) {
      return new Response("Method not allowed", {
        status: 405,
        headers: { ...JSON_HEADERS, Allow: "GET, HEAD" }
      });
    }
    if (path === "/api/health") {
      return json({
        schema: "uniomni.public-knowledge-health.v1",
        service: "uniomni-public-knowledge-browser",
        mode: "public-read-only",
        public_index_records: PUBLIC_INDEX.length,
        private_memory_exposed: false,
        memory_bridge: "owner-authenticated-link-only",
        status: "ready"
      }, 200, method === "HEAD");
    }
    if (path === "/api/index") {
      return json({
        schema: "uniomni.public-knowledge-index.v1",
        scope: "curated-public-sources-only",
        private_memory_exposed: false,
        count: PUBLIC_INDEX.length,
        results: PUBLIC_INDEX
      }, 200, method === "HEAD");
    }
    if (path === "/api/search") {
      const query = url.searchParams.get("q") || "";
      if (query.length > 160) return json({ error: "Query exceeds 160 characters." }, 400);
      const results = searchIndex(query);
      return json({
        schema: "uniomni.public-search.v1",
        scope: "curated-public-sources-only",
        private_memory_exposed: false,
        query,
        count: results.length,
        results
      }, 200, method === "HEAD");
    }
    if (path !== "/" && path !== "/index.html") {
      return new Response("Not found", { status: 404, headers: JSON_HEADERS });
    }
    const nonce = Array.from(crypto.getRandomValues(new Uint8Array(18)), (value) => value.toString(16).padStart(2, "0")).join("");
    const headers = {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "default-src 'none'; script-src 'nonce-" + nonce + "'; style-src 'nonce-" + nonce + "'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "X-Frame-Options": "DENY",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow"
    };
    return new Response(method === "HEAD" ? null : page(nonce), { status: 200, headers });
  }
};
