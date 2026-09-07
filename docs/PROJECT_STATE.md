# Project state — 2026-09-06

## Operational truth

Phase A and meaningful parts of B–G exist: a dependency-free static web Studio, robust basic CSV parser, conservative profile, a versioned canonical metric semantic, versioned constrained AnalysisPlan, structural and semantic validation, fixed-point decimal aggregation, deterministic comparison, explicit clarification, and execution-derived Verify evidence. The Studio now operates on a versioned serializable DataGraph envelope with one entity ID, exact source bytes/hash, profile and semantic hashes, content-addressed revisions/results, explicit parent lineage, plans, interpretations, traces, and visualization specifications. Tests prove exact round-trip recomputation and detect source, profile, semantic, result, and lineage tampering.

There is no AI integration, durable persistence/share URL, database, or application authentication. DataGraph identity and lineage currently survive serialization but not browser closure because no storage boundary exists. The deterministic proving intent provider remains narrow. Currency stays unknown; cancelled/refunded policy is explicit. Average and percentage outputs still need an explicit rounding policy. Cloudflare production staging serves the execution-trace release; the DataGraph envelope is locally proven pending this merge and deployment.

## MVP distance and exact next slice

This work is `advancing_core`: it proves SOURCE → basic COMPUTATION → EVIDENCE → PRESENTATION locally. It does not prove the full loop.

Active dependency sequence: (1) semantic and ambiguity correction **complete**; (2) execution-derived evidence trace **complete and staging-verified**; (3) DataGraph envelope and identities **complete locally; staging pending this merge**; (4) persistence/reload/share **next**; (5) bounded AI intent proposal; (6) complete stranger/browser founding proof. The next slice must measure the real envelope and implement the narrowest server-side persistence that supports exact reload and sharing; it must not silently recompute historical results.

## Runtime verification status

- **local browser:** Chromium loaded the fixture, computed revision 1, selected the bounded follow-up, computed revision 2, opened Verify, found three ranked rows, and emitted no page errors.
- **staging:** merged commit `1bf54cc` is deployed; HTTP served trace version 1, and Chromium verified four canonical operations, no trace for unresolved ambiguity, five comparison operations after clarification, actual 2024/2023 periods, and no page errors.
- **discovered and corrected:** the static app previously imported CSS as a JavaScript module, which native browsers reject. The stylesheet is now loaded from `index.html`; the browser smoke is the first direct evidence that the runnable shell executes rather than merely builds.

GitHub repository access and Cloudflare account/project authority were verified without exposing credential values. Portfolio HQ was not modified. Git history plus this state file provide reconstruction evidence.
