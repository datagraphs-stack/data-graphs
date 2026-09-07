# Project state — 2026-09-06

## Operational truth

Phase A and meaningful parts of B–G exist: a dependency-free static web Studio, robust basic CSV parser, conservative profile, a versioned canonical metric semantic, versioned constrained AnalysisPlan, structural and semantic validation, fixed-point decimal aggregation, deterministic comparison, explicit clarification, and execution-derived Verify evidence. The Studio now operates on a versioned serializable DataGraph envelope with one entity ID, exact source bytes/hash, profile and semantic hashes, content-addressed revisions/results, explicit parent lineage, plans, interpretations, traces, and visualization specifications. Tests prove exact round-trip recomputation and detect source, profile, semantic, result, and lineage tampering.

There is no AI integration or application authentication. D1 persistence, stable `/g/<dataGraphId>` routes, exact-envelope reload, immutable revision append, creator write tokens, deletion API, and cross-browser public-link sharing exist locally; staging proof is pending merge. Historical reload renders stored results without recomputation. The deterministic proving intent provider remains narrow. Currency stays unknown; cancelled/refunded policy is explicit. Average and percentage outputs still need an explicit rounding policy. The deployed release remains commit `6655301` until this persistence slice is merged. The canonical two-revision envelope measures 11,752 bytes, so D1 stores the complete envelope and R2 remains unearned. Public-link storage exposes exact source bytes to anyone with the URL and is disclosed before save; it is not private sharing.

## MVP distance and exact next slice

This work is `advancing_core`: it proves SOURCE → basic COMPUTATION → EVIDENCE → PRESENTATION locally. It does not prove the full loop.

Active dependency sequence: (1) semantic and ambiguity correction **complete**; (2) execution-derived evidence trace **complete and staging-verified**; (3) DataGraph envelope and identities **complete and staging-verified**; (4) persistence/reload/share **complete locally; staging pending this merge**; (5) bounded AI intent proposal **next**; (6) complete stranger/browser founding proof. After staging proves fresh-context reload and cross-browser identity preservation, the next slice is a bounded model-backed intent provider whose output remains untrusted and cannot supply authoritative values.

## Runtime verification status

- **local browser:** Chromium loaded the fixture, computed revision 1, selected the bounded follow-up, computed revision 2, opened Verify, found three ranked rows, and emitted no page errors.
- **staging:** merged commit `6655301` is deployed; HTTP served the DataGraph and identity modules, and Chromium verified stable source identity, distinct revision identities, parent lineage, result hashing, and no page errors.
- **discovered and corrected:** the static app previously imported CSS as a JavaScript module, which native browsers reject. The stylesheet is now loaded from `index.html`; the browser smoke is the first direct evidence that the runnable shell executes rather than merely builds.

GitHub repository access and Cloudflare account/project authority were verified without exposing credential values. Portfolio HQ was not modified. Git history plus this state file provide reconstruction evidence.
