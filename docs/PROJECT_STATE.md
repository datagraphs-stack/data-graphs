# Project state — 2026-09-06

## Operational truth

Phase A and a narrow part of B–E exist: a dependency-free static web Studio, robust basic CSV parser, conservative profile, versioned constrained AnalysisPlan, structural and semantic validation, fixed-point decimal aggregation, result chart/table, and Verify evidence. The commerce fixture includes cancellation, blank, zero, duplicate-like rows, multiple regions, boundary/leap dates, decimals, refund status, and empty metric behavior. Tests assert exact canonical values, exact `0.1 + 0.2` behavior, unknown output for an all-blank metric group, and safe malformed-plan failure.

There is no AI integration, plan revision/top-three/year comparison, persistence/share URL, source hash, immutable lineage, database, or application authentication. The intent adapter deliberately recognizes only the canonical question. Average aggregation still needs an explicit rounding policy. A Cloudflare Pages staging project and commit-linked preview deployment now exist. HTTP smoke checks verified the deployed root and canonical CSV; interactive browser verification remains outstanding because this environment has no browser executable.

## MVP distance and exact next slice

This work is `advancing_core`: it proves SOURCE → basic COMPUTATION → EVIDENCE → PRESENTATION locally. It does not prove the full loop.

Next slice: add top-N-by-series semantics, previous-year comparison, and exact tests for the canonical follow-up. Then wire an immutable v2 revision in the UI. This unlocks the required revision proof without introducing AI first.

## Runtime verification limitation

- **id:** `STAGING-BROWSER-SMOKE-001`
- **description:** The staged root and canonical CSV return 200, but the interactive compute-and-Verify flow has not been exercised against staging.
- **first_seen / last_checked:** 2026-09-06
- **evidence:** curl verified `/` and `/orders.csv`; no Chromium, Chrome, or Firefox executable is installed in this environment.
- **owner_action_required:** no; exercise the staged UI from a browser or add a browser test runtime.
- **alternative_work:** local engine tests verify the exact canonical calculation and static checks verify the shipped application modules.

GitHub repository access and Cloudflare account/project authority were verified without exposing credential values. Portfolio HQ was not modified. Git history plus this state file provide reconstruction evidence.
