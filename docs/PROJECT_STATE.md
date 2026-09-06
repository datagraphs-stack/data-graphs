# Project state — 2026-09-06

## Operational truth

Phase A and a narrow part of B–E exist locally: a dependency-free static web Studio, robust basic CSV parser, conservative profile, constrained canonical AnalysisPlan, semantic validation, deterministic aggregation, result chart/table, and Verify evidence. The commerce fixture includes cancellation, blank, zero, duplicate-like rows, multiple regions, boundary/leap dates, decimals, refund status, and empty metric behavior. Tests assert exact canonical values and safe invalid-plan failure.

There is no AI integration, plan revision/top-three/year comparison, persistence/share URL, source hash, immutable lineage, database, authentication, or staging runtime. The intent adapter deliberately recognizes only the canonical question. JavaScript floating-point currency is a recorded limitation.

## MVP distance and exact next slice

This work is `advancing_core`: it proves SOURCE → basic COMPUTATION → EVIDENCE → PRESENTATION locally. It does not prove the full loop.

Next slice: formalize/version and deeply validate AnalysisPlan; add fixed decimal money computation, top-N-by-series semantics, previous-year comparison, and exact tests for the canonical follow-up. Then wire an immutable v2 revision in the UI. This unlocks the required revision proof without introducing AI first.

## Blocker

- **id:** `STAGING-CF-AUTH-001`
- **description:** Cloudflare staging cannot be created without external account authority.
- **first_seen / last_checked:** 2026-09-06
- **evidence:** no `CLOUDFLARE_*`/`CF_*` environment variables or Wrangler executable; no configured project.
- **attempts:** inspected environment and executable path once.
- **root_cause:** owner-controlled external authentication/project.
- **owner_action_required:** yes.
- **exact_owner_action:** provide Cloudflare Pages deployment credentials/project access in this environment, or deploy the documented artifact and return its URL.
- **alternative_work:** all next computation, revision, persistence design, and local UX work remains unblocked.

Portfolio HQ was not modified; cross-repository access was not established. Git history plus this state file provide reconstruction evidence.
