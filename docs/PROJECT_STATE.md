# Project state — 2026-09-06

## Operational truth

Phase A and meaningful parts of B–G exist: a dependency-free static web Studio, robust basic CSV parser, conservative profile, a versioned canonical metric semantic, versioned constrained AnalysisPlan, structural and semantic validation, fixed-point decimal aggregation, deterministic latest-period top-N and previous-year comparison, result chart/table, immutable in-session revisions, explicit clarification, and Verify evidence. The commerce fixture includes cancellation, blank, zero, duplicate-like rows, multiple regions, boundary/leap dates, decimals, refund status, and empty metric behavior. Tests assert exact values, semantic-policy enforcement, unknown currency, visible refund qualification, and that ambiguous intent cannot execute.

There is no AI integration, durable persistence/share URL, source hash, cross-session lineage, database, or application authentication. The deterministic proving intent provider recognizes only the canonical question and follow-up; it is explicitly behind an intent-provider boundary and returns untrusted interpretations. The follow-up now blocks before execution and presents three time-grain choices; only the explicitly confirmed annual-total interpretation is supported. Currency remains unknown, while the canonical status policy explicitly excludes cancelled and includes refunded rows. Average and percentage outputs still need an explicit rounding policy. Cloudflare production staging serves merged commit `246fcc2`; HTTP and Chromium checks prove that ambiguous intent leaves the authoritative result unchanged, three clarification choices render, confirmed execution succeeds, currency remains unknown, and refund policy is visible with no page errors.

## MVP distance and exact next slice

This work is `advancing_core`: it proves SOURCE → basic COMPUTATION → EVIDENCE → PRESENTATION locally. It does not prove the full loop.

Active dependency sequence: (1) semantic and ambiguity correction **complete for the canonical context**; (2) execution-derived evidence trace **next**; (3) DataGraph envelope and identities; (4) persistence/reload/share; (5) bounded AI intent proposal; (6) complete stranger/browser founding proof. The next slice must make Verify render a normalized trace emitted by deterministic execution rather than handwritten calculation narration.

## Runtime verification status

- **local browser:** Chromium loaded the fixture, computed revision 1, selected the bounded follow-up, computed revision 2, opened Verify, found three ranked rows, and emitted no page errors.
- **staging:** merged commit `246fcc2` is deployed; HTTP checks passed for the shell, fixture, intent provider, and semantic context, and Chromium proved clarification blocks execution until confirmation before completing revision 2 with visible semantics and no page errors.
- **discovered and corrected:** the static app previously imported CSS as a JavaScript module, which native browsers reject. The stylesheet is now loaded from `index.html`; the browser smoke is the first direct evidence that the runnable shell executes rather than merely builds.

GitHub repository access and Cloudflare account/project authority were verified without exposing credential values. Portfolio HQ was not modified. Git history plus this state file provide reconstruction evidence.
