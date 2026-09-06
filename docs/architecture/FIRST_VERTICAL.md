# First vertical architecture

`public/orders.csv` → `parseCsv` → preserved row strings → `profileDataset` → `AnalysisPlan` candidate → `validatePlan` → `executePlan` → result rows plus evidence → table/chart and Verify UI.

`src/engine.js` owns parsing, profiling, validation, and execution; it has no DOM dependency. `src/app.js` orchestrates interaction and presentation but cannot calculate authoritative values. The current intent adapter recognizes only the canonical wording and explicitly refuses other questions rather than guessing. It is a temporary bounded seam for later model-backed candidate generation.

Current operations: equality/inequality filtering; dimensions; ISO calendar-month bucketing; sum/count/average/min/max; sorting; result limit. Evidence records source and filtered/result counts, columns, plan, warnings, and engine version. Missing: source hashing, full plan structural validation, decimal policy, global top-N semantics, previous-year comparisons, immutable revisions, persistence, and server custody.
