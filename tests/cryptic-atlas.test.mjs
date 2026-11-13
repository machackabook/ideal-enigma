import test from "node:test";
import assert from "node:assert/strict";
import {gcd,chooseCoprimeStride,strideOrder,buildHccgnHeader,canonicalUrl,parseRobots,robotsAllowed,sha256Hex,SEEDS,LIMITS} from "../cloudflare/cryptic-atlas/worker.mjs";

test("coprime stride visits every pool position exactly once",()=>{const n=28160,s=chooseCoprimeStride(n,23),v=strideOrder(n,17,s).indices;assert.equal(gcd(s,n),1);assert.equal(v.length,n);assert.equal(new Set(v).size,n);});
test("reverse traversal preserves the indexed pool",()=>{const a=strideOrder(17,3,5,false).indices,b=strideOrder(17,3,5,true).indices;assert.deepEqual(new Set(a),new Set(b));assert.equal(a[0],b[0]);});
test("URL canonicalization requires HTTPS and exact host allowlist",()=>{const h=new Set(["www.example.org"]);assert.equal(canonicalUrl("http://www.example.org/a",null,h),null);assert.equal(canonicalUrl("https://evil.example.org/a",null,h),null);assert.equal(canonicalUrl("https://www.example.org/a?utm_source=x&b=2#top",null,h),"https://www.example.org/a?b=2");});
test("robots rules apply longest matching path and allow wins ties",()=>{const r=parseRobots("User-agent: *\nDisallow: /private\nAllow: /private/public\n");assert.equal(robotsAllowed("/public",r),true);assert.equal(robotsAllowed("/private/secret",r),false);assert.equal(robotsAllowed("/private/public/report",r),true);});
test("HCCGN header preserves height, stride, and previous commitment",()=>{const h="a".repeat(64);assert.equal(buildHccgnHeader(7,5,h),"HCCGN|BLOCK:7|STRIDE:5|PREV:"+h);assert.throws(()=>buildHccgnHeader(0,5,h));assert.throws(()=>buildHccgnHeader(7,5,"bad"));});
test("search scope is bounded and mission-directed",()=>{assert.equal(SEEDS.length,10);assert.equal(LIMITS.maxPages,24);assert.equal(LIMITS.maxDepth,1);assert.ok(LIMITS.maxBytes>0);});
test("SHA-256 produces a 256-bit commitment",async()=>{assert.equal((await sha256Hex("cryptic-promise")).length,64);});
