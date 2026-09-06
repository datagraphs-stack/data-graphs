# Project state — 2026-09-06

## Operational truth

Phase A and meaningful parts of B–E exist: a dependency-free static web Studio, robust basic CSV parser, conservative profile, versioned constrained AnalysisPlan, structural and semantic validation, fixed-point decimal aggregation, deterministic latest-period top-N and previous-year comparison, result chart/table, immutable in-session revisions, and Verify evidence. The commerce fixture includes cancellation, blank, zero, duplicate-like rows, multiple regions, boundary/leap dates, decimals, refund status, and empty metric behavior. Tests assert exact canonical values, exact `0.1 + 0.2` behavior, unknown output for an all-blank metric group, and safe malformed-plan failure.

There is no AI integration, durable persistence/share URL, source hash, cross-session lineage, database, or application authentication. The bounded intent adapter recognizes only the canonical question and its explicit top-three/previous-year follow-up. Average and percentage outputs still need an explicit rounding policy. A local Chromium smoke exercised both revisions and Verify with no page errors; `artifacts/canonical-revision.png` records the rendered second revision. Cloudflare production staging now serves merged commit `606cacb`; HTTP asset checks and a full staged Chromium run verified both revisions and Verify with no page errors.

## MVP distance and exact next slice

This work is `advancing_core`: it proves SOURCE → basic COMPUTATION → EVIDENCE → PRESENTATION locally. It does not prove the full loop.

Next slice: add source hashing and a stable local share/reload representation for the two validated revisions, then make Verify reconstruct source identity, revision ancestry, semantics, operations, and runtime identity. This advances persistence evidence without introducing AI or server custody first.

## Runtime verification status

- **local browser:** Chromium loaded the fixture, computed revision 1, selected the bounded follow-up, computed revision 2, opened Verify, found three ranked rows, and emitted no page errors.
- **staging:** merged commit `606cacb` is deployed; HTTP checks passed for the shell, fixture, JavaScript, and stylesheet, and Chromium completed the two-revision flow with three ranked rows and no page errors.
- **discovered and corrected:** the static app previously imported CSS as a JavaScript module, which native browsers reject. The stylesheet is now loaded from `index.html`; the browser smoke is the first direct evidence that the runnable shell executes rather than merely builds.

GitHub repository access and Cloudflare account/project authority were verified without exposing credential values. Portfolio HQ was not modified. Git history plus this state file provide reconstruction evidence.
