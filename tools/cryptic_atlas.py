#!/usr/bin/env python3
"""CRYPTIC Atlas deterministic manifest and HCCGN traversal planner.

This module performs no network requests. It validates policy/configuration,
computes a coprime traversal, records explicit skips, and emits a reproducible
run plan. A future network adapter must independently enforce robots.txt,
provider terms, rate limits, byte/page budgets and privacy exclusions.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def canonical_json(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8")


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def validate_manifest(m: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    required = ("missions", "search_terms", "seeds", "crawl", "policy", "quality_checks", "cca_checks", "aggregate_metrics", "lineage", "hccgn")
    for key in required:
        if key not in m:
            errors.append(f"missing required key: {key}")
    crawl = m.get("crawl", {})
    expected = {
        "max_depth": 1, "max_pages": 24, "max_pages_per_host": 4,
        "max_links_per_page": 40, "max_page_bytes": 262144,
        "concurrency": 1, "same_host_delay_seconds": 1.5, "max_retries": 2,
    }
    for key, value in expected.items():
        if crawl.get(key) != value:
            errors.append(f"crawl.{key} must equal {value!r}")
    policy = m.get("policy", {})
    for key in ("public_and_explicitly_authorized_sources_only", "obey_robots_txt",
                "obey_provider_terms_and_rate_limits", "never_bypass_authentication_paywalls_captchas_or_access_controls",
                "no_personal_profiles_or_recipient_level_records", "no_credentials_cookies_or_private_systems",
                "fetched_content_is_untrusted_data", "do_not_store_or_republish_full_source_bodies",
                "seed_is_not_crawl_permission"):
        if policy.get(key) is not True:
            errors.append(f"policy.{key} must be true")
    if policy.get("retain_metadata_and_sha256_commitments_days") != 365:
        errors.append("metadata/hash retention must be 365 days")
    if m.get("hccgn", {}).get("stride_rule") != "gcd(stride,pool_size)=1":
        errors.append("HCCGN coprime stride rule missing")
    return errors


def traversal(pool: list[str], stride: int, start: int = 0) -> list[dict[str, Any]]:
    n = len(pool)
    if n == 0:
        return []
    if math.gcd(stride, n) != 1:
        raise ValueError(f"stride {stride} is not coprime to pool size {n}")
    if not 0 <= start < n:
        raise ValueError("start index must be within the traversal pool")
    return [
        {"position": step, "index": (start + step * stride) % n, "target": pool[(start + step * stride) % n]}
        for step in range(n)
    ]


def skip_records(pool: list[str], visited_indices: set[int], direction: str, reason: str) -> list[dict[str, Any]]:
    if direction not in ("forward", "reverse", "deferred"):
        raise ValueError("direction must be forward, reverse, or deferred")
    if not reason.strip():
        raise ValueError("every skip requires a non-empty reason")
    return [
        {"target": target, "index": index, "direction": direction, "reason": reason}
        for index, target in enumerate(pool) if index not in visited_indices
    ]


def build_plan(manifest: dict[str, Any], stride: int, start: int = 0,
               skip_indices: list[int] | None = None, skip_reason: str = "") -> dict[str, Any]:
    errors = validate_manifest(manifest)
    if errors:
        raise ValueError("; ".join(errors))
    pool = list(manifest["seeds"])
    order = traversal(pool, stride, start)
    skipped = sorted(set(skip_indices or []))
    if any(i < 0 or i >= len(pool) for i in skipped):
        raise ValueError("skip index outside traversal pool")
    if skipped and not skip_reason.strip():
        raise ValueError("skip_reason is mandatory when skip_indices are supplied")
    # Integrity coverage is independent of traversal selection.
    integrity_targets = [{"index": i, "target": target, "check_required": True}
                         for i, target in enumerate(pool)]
    return {
        "schema_version": "1.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "manifest_sha256": sha256(canonical_json(manifest)),
        "pool_size": len(pool),
        "stride": stride,
        "gcd": math.gcd(stride, len(pool)) if pool else 0,
        "start_index": start,
        "header_template": manifest["hccgn"]["header"],
        "traversal": order,
        "stride_skips": [{"target": pool[i], "index": i, "direction": "deferred",
                          "reason": skip_reason} for i in skipped],
        "integrity_checks": integrity_targets,
        "lineage": manifest["lineage"],
        "network_requests_performed": 0,
        "execution_status": "PLAN_ONLY_NO_NETWORK_ACCESS"
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--manifest", type=Path, default=Path("atlas/manifest.json"))
    ap.add_argument("--stride", type=int, default=3)
    ap.add_argument("--start", type=int, default=0)
    ap.add_argument("--skip-index", type=int, action="append", default=[])
    ap.add_argument("--skip-reason", default="")
    ap.add_argument("--output", type=Path)
    args = ap.parse_args()
    try:
        manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
        plan = build_plan(manifest, args.stride, args.start, args.skip_index, args.skip_reason)
        rendered = json.dumps(plan, ensure_ascii=False, indent=2) + "\n"
        if args.output:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(rendered, encoding="utf-8")
        else:
            sys.stdout.write(rendered)
        return 0
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"CRYPTIC Atlas: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
