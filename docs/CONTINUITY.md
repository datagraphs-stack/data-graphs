# Continuity

## Cold-start order

1. `AGENTS.md`; 2. `docs/FOUNDING_RECORD.md`; 3. `docs/PRODUCT_VISION.md`; 4. `docs/DECISIONS.md`; 5. `docs/ROADMAP.md`; 6. `docs/PROJECT_STATE.md`; 7. `docs/architecture/FIRST_VERTICAL.md`; 8. inspect worktree, Git log, tests, and any runtime receipt; 9. `docs/DEPLOY_ORIGIN.md`.

Present implementation truth ranks: worktree, Git, deployed runtime, PROJECT_STATE, current architecture docs, historical reports, remembered conversation. Founding truth ranks: commission, FOUNDING_RECORD, PRODUCT_VISION, accepted decisions, ROADMAP.

The next agent should run `npm test && npm run check && npm run build`, load `public/orders.csv`, and compare UI results to `test/engine.test.js`. Update PROJECT_STATE, not founding history, when reality changes. A change drifts if it bypasses validation/deterministic computation, obscures ambiguity/evidence, or builds an unearned later platform surface.
