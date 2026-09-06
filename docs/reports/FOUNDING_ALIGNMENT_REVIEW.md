# DataGraphs founding alignment — forensic review packet

**Prepared:** 2026-09-06  
**Audience:** founder and independent founding-vision reviewer  
**Purpose:** determine whether current work reduces distance to the first perfect DataGraph, identify where prior reporting overstated maturity, and define the next evidence-bearing sequence.  
**Scope:** repository history through merged commit `4aacd3e`, the production-staging origin, current product code/tests, and durable founding documents. This is an internal architecture/product audit, not external user validation or a security audit.

## Executive finding

**Verdict: directionally aligned, materially incomplete, with one interpretation error that must be corrected before calling the canonical revision authoritative.**

The work has established a useful deterministic kernel: preserved CSV strings, conservative profiling, a constrained plan, validation before execution, fixed-point aggregation, exact fixture assertions, result rendering, and a visible Verify surface. This is real progress toward the trust architecture—not an AI chart mockup.

It has **not** established the founding primitive as a durable product object. There is no persisted DataGraph envelope, source hash/version, declared metric semantics, stable share/reload route, cross-session lineage, claims model, or real intent-proposal boundary. The UI recognizes two prompts by substring and selects hard-coded plans. Most importantly, the follow-up silently changes monthly analysis into annual totals even though the prompt admits multiple material interpretations. That violates the stated rule that ambiguity remains visible.

The project should not expand into connectors, dashboards, Signals, MCP, collaboration, or billing. The next work should finish one perfect DataGraph: resolve/represent follow-up ambiguity, define minimal semantics, create source and result identity, persist the complete object, reload it, and share it at a stable route.

## 1. Founding thesis reconstructed

### Company

DataGraphs is intended to become **the trusted computation layer between raw data and decisions**. Its category is not “AI charting.” Its durable unit of value is an executable analytical object that can serve humans and software while retaining a reconstruction path.

### Primitive

A DataGraph should bind, without collapsing, the following layers:

`source → structure → semantics → intent → validated plan → deterministic computation → result → visualization → claim → evidence`

“Graph” deliberately refers both to dependencies/provenance *of* the data and graphical/intelligence outputs *from* the data.

### Trust boundary

- AI may propose an interpretation.
- A schema validator must constrain its shape.
- semantic validation must reject invalid or unresolved meanings.
- deterministic code alone may compute authoritative analytical values.
- presentation and prose must remain downstream of computation.
- unknown and material ambiguity must remain visible.

### First user and painful job

The founding user is a founder/operator in a small, spreadsheet-heavy commerce business. The job is not “make a chart.” It is “answer a consequential recurring question and be able to prove the answer later without installing BI infrastructure.”

### Narrow proof

The founding proof is one orders CSV, a useful profile, the canonical monthly-net-revenue question, a validated deterministic answer, Verify, a follow-up revision, exact values, persistence, stable reload/share, and staging evidence. Expansion is earned only after this closed loop works.

## 2. Evidence and reconstruction method

This review followed repository source-of-truth order rather than remembered conversation:

1. read `AGENTS.md` and `docs/CONTINUITY.md`;
2. read founding, vision, decision, roadmap, state, architecture, and deployment records;
3. inspected the worktree and complete Git history;
4. inspected the plan definitions, intent adapter, engine, UI, fixture, and exact tests;
5. queried GitHub PR state and inline review comments;
6. ran the required test, syntax, and build commands;
7. sent HTTP checks to the recorded staging origin.

No inline review comments exist on PRs #2–#5. All five repository PRs are merged. The worktree was clean before this report branch.

### Confidence vocabulary

- **Proven:** directly exercised by an automated exact-value or runtime check.
- **Implemented, partially proven:** code exists and some behavior is exercised, but the founding claim is broader.
- **Prototype:** deliberately narrow or hard-coded behavior useful for learning, not a product-complete capability.
- **Missing:** no implementation evidence.
- **Unknown:** evidence is insufficient; this report does not infer success.

## 3. Process reconstruction

### Stage 1 — founding memory and first vertical

The repository was initialized, then PR #1 created the durable founding documents, dependency roadmap, static Studio, canonical fixture, CSV parser/profile, deterministic engine, plan, tests, and Verify UI. This appropriately optimized for an end-to-end skeleton rather than broad infrastructure.

### Stage 2 — computation-boundary hardening

PR #2 added plan versioning, deeper structural/semantic validation, fixed-point decimal aggregation, explicit unknown output for all-blank groups, and a Cloudflare staging receipt. This was aligned with authoritative computation and unknown-preservation.

### Stage 3 — canonical follow-up and browser proof

PR #3 added previous-year fixture rows, ranking/comparison operations, in-session revision snapshots, a comparison presentation, and richer Verify output. A real browser run exposed that the static app had imported CSS as JavaScript; the stylesheet was moved to HTML and the flow was then exercised locally and on staging. PRs #4–#5 recorded and corrected the deployment receipt.

### Process strengths

- Work moved in dependency order from source to computation to evidence to revision.
- Values, not merely object existence, were asserted.
- Staging was created and tied to a Git implementation SHA.
- A runtime defect missed by syntax/build checks was found through browser execution.
- Known limitations were generally recorded in `PROJECT_STATE` rather than rewritten into founding history.

### Process weaknesses and forensic corrections

1. **Activity was occasionally reported as proof.** Earlier summaries treated PR, merge, and deployment completion as if the founding loop were nearly complete. They are conveyor events, not customer-capability proof.
2. **The first deployment claim preceded browser execution.** Static build success did not prove the native browser could start; it could not because of the CSS module import. The later Chromium test corrected the defect and the evidence standard.
3. **The follow-up semantics were selected too quickly.** The implementation chose annual totals without first representing the ambiguity in “compare them with the previous year.” Deterministic execution of an undocumented assumption is reproducible but not trustworthy.
4. **“Immutable revision” was initially overstated.** Revisions are deeply frozen only in memory. They have no durable ID, persisted parent, reload behavior, or historical source binding.
5. **The fixture was changed to enable comparison.** Adding 2023 rows is reasonable, but it changed the canonical first answer. The expected results were updated; a reviewer should confirm that the intended founding fixture truly includes two years rather than treating this as incidental test setup.
6. **Review independence was weak.** GitHub shows no inline reviewer comments on the relevant PRs. Automated checks and self-review exist; independent product/semantic review does not.
7. **Presentation code contains policy narration.** Verify steps are handwritten in the UI rather than derived from a normalized execution trace. They can drift from engine behavior.

## 4. Capability ledger

| Layer | State | Evidence | Material gap |
|---|---|---|---|
| Source upload | Implemented, partially proven | Browser loads sample; file input parses CSV | Uploaded bytes are not durably retained or identified |
| Source identity/version | Missing | Filename and row count only | No content hash, stable dataset ID, byte length, or version |
| Structure/profile | Implemented, partially proven | Columns, types, null/unique counts, samples, numeric/date bounds | No explicit confidence or ambiguous-value report |
| Semantics | Prototype | Source field types constrain operations | No metric/entity definitions, currency/unit, grain, status/refund policy, or time semantics |
| Intent | Prototype | Two substring patterns choose two constant plans | No candidate-generation interface, interpretation display, confidence, or clarification |
| Plan contract | Implemented, partially proven | Versioned plan and field/operator/type validation | Hand-written validation; no serialized schema artifact or explicit ambiguity array |
| Computation | Proven for fixture cases | Exact canonical and comparison assertions | Operation surface is small; average/percentage rounding policy unresolved |
| Unknown handling | Partially proven | All-blank metric becomes `null`; missing/zero comparison baseline suppresses percent | UI distinction among missing baseline, zero baseline, and invalid source value is incomplete |
| Visualization | Implemented, partially proven | Monthly and comparison views exercised in Chromium | Not a declarative grammar; UI is specialized to these result shapes |
| Evidence/Verify | Prototype-to-partial | Counts, columns, plan, warning, engine/arithmetic metadata | No source hash, semantics, trace-derived operations, contributors, result hash, or runtime Git ID |
| Revision | Prototype | Deep-frozen in-session snapshots and displayed ancestry text | No stable revision ID, parent pointer, plan diff, persistence, or immutable source binding |
| Persistence | Missing | None | Reload loses the DataGraph |
| Stable share/reload | Missing | None | No stable URL or reconstruction contract |
| Claims | Missing | None | No computed claim object connected to evidence |
| Staging | Proven for current narrow flow | HTTP and Chromium receipts for merged implementation SHA | No automated recurring smoke or public product-domain DNS |
| AI | Intentionally missing | None | Must wait until semantics/ambiguity and persistence boundaries are real |
| Signals/agents/connectors | Correctly deferred | Roadmap only | Building now would be drift risk |

## 5. What has actually been built

### Deterministic engine

The browser-independent engine parses CSV while preserving source strings, profiles fields conservatively, validates plans, filters/groups rows, buckets ISO dates, aggregates numeric strings with base-10 fixed-point integers, sorts/limits results, ranks the latest year, and joins a previous-calendar-year baseline.

The tests currently prove:

- 13-row/11-column fixture profiling facts;
- ID fields remain strings;
- exact monthly regional totals excluding cancelled orders;
- an all-blank group remains `null` rather than becoming zero;
- exact current/prior/change values for three regions;
- malformed plans fail before execution;
- `0.1 + 0.2` aggregates to `0.3` under fixed-point addition;
- malformed CSV is rejected.

### Studio

The static browser Studio provides:

- sample loading and local CSV upload;
- schema/profile inspection;
- a central result visualization and result table;
- a narrow intent box;
- a follow-up affordance;
- revision numbering and ancestry text;
- Verify with question, filename, row flow, columns, engine/arithmetic labels, warning, narrated steps, and structured plan.

### Staging and operations

Cloudflare Pages serves the static artifact at `https://datagraphs-staging.pages.dev`. The recorded implementation receipt points to commit `606cacb`; later merged commits only adjust deployment documentation. HTTP checks during this review returned 200 for the root, fixture, app module, and engine module.

### Durable memory

The repository can answer the company thesis, target customer, wedge, trust boundary, long-term surfaces, first proof, non-goals, current implementation, deployment origin, dependency roadmap, and next slice. This is a meaningful success of the cold-start requirement.

## 6. Misalignment and risk analysis

### Critical product gap: no persistent DataGraph

The UI state is not the product primitive. A DataGraph needs a stable identity and a serialized reconstruction contract. Until reload/share works, the application is a session-bound analytical demo even though its computation kernel is trustworthy for the fixture.

### Critical trust gap: semantics are inferred from column names

“Net revenue” is not defined. The code assumes `net_revenue` is summable and excludes only `cancelled` because the plan says so. The fixture includes `refunded`; whether a refund belongs in net revenue is a material business interpretation. Currency is also unknown. A correct sum of the wrong semantic set is still the wrong business answer.

### Critical interpretation gap: follow-up time grain

The first plan is monthly. The second plan becomes annual. The prompt could instead mean monthly values compared year-over-year after selecting the top regions. The product should either:

1. ask a clarification;
2. present a qualified proposed interpretation for confirmation; or
3. use an explicitly declared workspace semantic/default and show it.

It must not make the choice invisible.

### Evidence drift risk

Verify narration is duplicated in `app.js`. The engine returns a plan but not a normalized execution trace. If engine behavior changes and UI prose does not, Verify could confidently misdescribe the calculation. Evidence should be emitted by deterministic execution and rendered generically.

### Numerical scope risk

Fixed-point aggregation protects additions, minimums, maximums, and exact changes before result conversion. Average and percentage use division into JavaScript numbers without a declared scale/rounding mode. The UI formats percentages to one decimal, but presentation rounding is not yet a governed semantic policy.

### Generalization risk

The plan looks generic, but source validation is hard-coded to `orders`, the intent adapter has two cases, and the renderer knows fixed output field names. This is acceptable while proving one DataGraph, but documentation and marketing must call it a founding vertical rather than a general engine.

### Security/privacy boundary

CSV processing is currently browser-local, which limits custody risk. Persistence/share will change that boundary. A local encoded URL may leak source data; server persistence introduces access control, retention, deletion, abuse, and content-security concerns. The persistence design must explicitly choose what the URL contains and who can retrieve it.

## 7. Recommended next conveyor

### Slice 1 — semantic and ambiguity correction (`advancing_core`)

**Unlock:** ensures the canonical computation answers an agreed question rather than a silently chosen one.

- Define the minimal `net_revenue` semantic object: label, source field, aggregation, unit/currency status, null policy, status exclusion, time field, grain.
- Represent ambiguities and qualifications in the interpretation/plan boundary.
- Preserve monthly grain in the follow-up unless a confirmed interpretation changes it, or visibly ask whether “previous year” means monthly year-over-year or annual totals.
- Add fixtures for missing prior year, zero prior year, ties, refund policy, incomplete current year, and a fourth region so “top three” actually excludes a candidate.
- Derive Verify steps from an engine execution trace rather than handwritten UI prose.

**Exit evidence:** a reviewer can state exactly what “net revenue,” “top three,” and “previous year” mean; tests distinguish alternatives; no material assumption is hidden.

### Slice 2 — minimal DataGraph envelope and identity (`advancing_core`)

**Unlock:** turns disconnected UI state into the founding primitive.

Define a serializable, versioned envelope containing at minimum:

- `dataGraphId`, `revisionId`, `parentRevisionId`, timestamps;
- source filename, byte length, SHA-256, row count, profile/version;
- semantic definitions and unresolved/accepted qualifications;
- original question and structured interpretation;
- validated plan and plan-schema version;
- deterministic execution trace and engine version;
- result rows/result hash;
- visualization specification;
- warnings and evidence.

IDs and hashes must be deterministic where identity is claimed. Timestamps and random IDs must not participate in result authority.

**Exit evidence:** serialize → parse → validate → recompute produces the expected result and matching result hash from the exact source bytes.

### Slice 3 — persistence and stable reload/share (`advancing_core`)

**Unlock:** completes the last missing founding-loop behavior.

Start with the narrowest privacy-responsible mechanism:

- persist the canonical DataGraph and its revisions;
- use a stable route such as `/g/<id>`;
- reload and render without silently recomputing against changed bytes;
- distinguish stored historical result from an explicit rerun;
- show parent/child revision lineage;
- reject corrupted or incompatible envelopes visibly.

Choose browser storage only if the “share” claim is explicitly limited to the same browser. Cross-user sharing requires Cloudflare server custody and a minimal threat/retention/access design; do not encode private CSV contents into a public URL.

**Exit evidence:** create v1 → revise to v2 → reload stable URL in a fresh context → reproduce both exact results and source hash → share into another authorized context if cross-user sharing is claimed.

### Slice 4 — bounded intent proposal (`advancing_core`, after the boundary above)

**Unlock:** proves the AI role without surrendering computation authority.

- Define an intent-provider interface whose output is untrusted candidate data.
- validate candidate structure and semantics;
- surface ambiguity/clarification states;
- store prompt/provider/model metadata as provenance, never as numerical authority;
- run only accepted validated plans through the deterministic engine;
- retain a deterministic fixture adapter for offline tests.

**Exit evidence:** canonical paraphrases succeed, materially ambiguous prompts pause, invalid model output fails safely, and no model-produced number reaches the result.

### Slice 5 — final founding proof and reassessment (`advancing_core`)

**Unlock:** earns a decision about expansion.

- Run a clean-browser stranger path on staging with the canonical CSV.
- Verify profile facts, plan/semantics, exact v1 values, clarified v2 values, lineage, save, fresh reload, and stable share.
- record Git SHA, source hash, DataGraph/revision IDs, URLs, exact expected values, test/browser evidence, and known qualifications.
- obtain one independent product/semantic review.
- update `PROJECT_STATE` and decide whether evidence supports AI refinement, richer operations, or customer testing next.

No later platform surface is authorized merely by completing code. Expansion should respond to observed failure or user demand.

## 8. Independent reviewer decision checklist

The third-party reviewer should answer each item **yes**, **no**, or **insufficient evidence**:

### Founding alignment

- Is the persistent object the DataGraph rather than the transcript or chart?
- Are source, semantics, computation, evidence, and presentation distinct?
- Can AI influence interpretation without becoming numerical authority?
- Are missing and ambiguous meanings visible?

### Canonical correctness

- Is “net revenue” explicitly defined, including refunds, cancellations, blanks, currency, and grain?
- Is “top three” ranked over an explicit population and period?
- Is “previous year” comparison grain/window explicit and appropriate?
- Do exact fixtures include excluded candidates, ties, missing/zero baselines, and partial periods?

### Reproducibility

- Does the analytical object bind to exact source bytes?
- Can another runtime validate and recompute it?
- Does Verify derive from actual execution rather than parallel prose?
- Are engine/schema/semantic versions present?

### Product proof

- Can a stranger complete the flow without knowing the accepted keywords?
- Can v1 and v2 be saved and reloaded?
- Does a stable URL recover the intended object?
- Does sharing preserve privacy and historical context?
- Is staging demonstrably tied to the reviewed Git SHA?

### Drift control

- Is each next slice required for the first perfect DataGraph?
- Are connectors, dashboards, Signals, agents, collaboration, and billing still deferred?
- Is documentation reporting capability evidence rather than activity?

A single **no** on numerical authority, hidden material ambiguity, source binding, or historical reproducibility should prevent declaring the first perfect DataGraph green.

## 9. Questions requiring founder/reviewer confirmation—not engineering permission

Engineering can proceed autonomously with ambiguity representation and persistence primitives. These questions should be confirmed as product semantics, not used as reasons to stall:

1. For the canonical follow-up, should the graph retain monthly grain with prior-year monthly comparison, or intentionally become annual regional totals?
2. Does a `refunded` row remain in source-provided `net_revenue`, or should the canonical metric exclude/refactor refunds?
3. Is the fixture currency known (for example USD), declared by upload context, or intentionally unknown?
4. Does “share” in the first proof require another person/browser, or is a stable same-browser reload route sufficient for the first persistence slice?

Until answered, the product should display these as qualifications or clarification choices rather than assume them.

## 10. Bottom line

The project is **not wasting time in its core architectural direction**: a validated deterministic engine, exact fixtures, visible evidence, and a staged human workflow are the correct narrow foundations.

It **would begin wasting time** if it expanded now or treated hard-coded prompt routing, inferred semantics, in-memory revisions, and a successful deployment as a completed DataGraph. The shortest path is not more chart types or more AI. It is to make the existing answer semantically explicit, content-addressed, reconstructable, persistent, and shareable.

The current implementation should be described as:

> **A staged deterministic vertical that proves important computation and presentation mechanics for one DataGraph, while the defining persistence, semantic, ambiguity, and provenance guarantees remain under construction.**

That is credible progress. It is not yet the first perfect DataGraph.
