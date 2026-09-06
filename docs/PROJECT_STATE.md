# Project state — 2026-09-06

## Operational truth

Phase A and a narrow part of B–E exist: a dependency-free static web Studio, robust basic CSV parser, conservative profile, versioned constrained AnalysisPlan, structural and semantic validation, fixed-point decimal aggregation, result chart/table, and Verify evidence. The commerce fixture includes cancellation, blank, zero, duplicate-like rows, multiple regions, boundary/leap dates, decimals, refund status, and empty metric behavior. Tests assert exact canonical values, exact `0.1 + 0.2` behavior, unknown output for an all-blank metric group, and safe malformed-plan failure.

There is no AI integration, plan revision/top-three/year comparison, persistence/share URL, source hash, immutable lineage, database, or application authentication. The intent adapter deliberately recognizes only the canonical question. Average aggregation still needs an explicit rounding policy. A Cloudflare Pages staging project and preview deployment now exist, but runtime smoke requests from this environment receive an upstream 503 and therefore are not claimed as verified.

## MVP distance and exact next slice

This work is `advancing_core`: it proves SOURCE → basic COMPUTATION → EVIDENCE → PRESENTATION locally. It does not prove the full loop.

Next slice: add top-N-by-series semantics, previous-year comparison, and exact tests for the canonical follow-up. Then wire an immutable v2 revision in the UI. This unlocks the required revision proof without introducing AI first.

## Runtime verification limitation

- **id:** `STAGING-SMOKE-503-001`
- **description:** Cloudflare accepted the Pages upload and returned preview URLs, but HTTP requests from this environment receive an upstream 503 for preview aliases.
- **first_seen / last_checked:** 2026-09-06
- **evidence:** successful Wrangler project creation and six-file deployment; repeated curl requests to the unique and branch preview hosts returned 503.
- **owner_action_required:** no; retry from another network or after propagation before treating staging as runtime-verified.
- **alternative_work:** local deterministic tests, static build checks, and subsequent core computation work remain unblocked.

GitHub repository access and Cloudflare account/project authority were verified without exposing credential values. Portfolio HQ was not modified. Git history plus this state file provide reconstruction evidence.
