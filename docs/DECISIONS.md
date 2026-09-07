# Architectural decisions

## ADR-001 — Browser-first vertical with Cloudflare-compatible static output

**Accepted 2026-09-06.** Use dependency-free JavaScript modules and Node's test runner for the first vertical. A tiny build copier produces static Cloudflare Pages assets. The engine is UI-independent. This avoids a blocked package registry and minimizes dependencies while proving computation. Add a framework and Workers/D1/R2 only when product complexity, persistence, or server-side custody requires them.

## ADR-002 — `AnalysisPlan` is the constrained execution contract

**Accepted 2026-09-06.** A plan names a source, filters, dimensions/date buckets, metrics/aggregations, sorts, limit, and visualization. Validate structure/fields/types before execution. No arbitrary SQL or generated code. The schema may evolve under versions; the boundary may not be bypassed.

## ADR-003 — Source strings are preserved; inference is conservative

**Accepted 2026-09-06.** CSV parsing preserves cells as source strings. Profiling may infer ISO dates, strict finite numbers, and booleans; `*_id` remains string. Blanks are explicit. Coercion occurs only within an operation that requires it.

## ADR-004 — Current money arithmetic is provisional

**Superseded by ADR-005 on 2026-09-06.** The initial proof used JavaScript number addition and exact two-decimal fixture inputs.

## ADR-005 — Decimal aggregation uses source-derived fixed-point integers

**Accepted 2026-09-06.** Numeric source strings are converted to base-10 integers at the greatest decimal scale present in each result group before sum, minimum, or maximum aggregation. Conversion to a JavaScript number occurs only after the exact integer operation. This removes binary floating-point addition from authoritative totals without prematurely declaring currency semantics for every numeric column. Average divides the exact integer total and remains subject to a future explicit rounding policy.

## ADR-006 — Comparison ranking is latest-period-first

**Accepted 2026-09-06.** A ranked previous-year comparison first aggregates every year/series pair, selects the latest observed year, ranks series by that year's declared metric with a stable dimension-name tie-break, retains the requested count, and then left-matches those series to the immediately preceding calendar year. A missing or zero baseline yields an explicit unknown percentage; it is never silently treated as zero. The validated plan must declare the ranked dimension, metric, limit, latest-period basis, year dimension, and previous-year offset.

## ADR-007 — Plans reference declared semantics; material intent ambiguity blocks execution

**Accepted 2026-09-06.** A metric operation references a versioned semantic definition that declares its source field, aggregation, time field, null/status policy, unit state, and qualifications. The canonical context declares currency unknown and includes refunded rows while excluding cancelled rows. Intent providers return untrusted `RESOLVED`, `NEEDS_CLARIFICATION`, or `QUALIFIED` interpretations; only interpretations carrying an accepted candidate plan may execute. The deterministic proving adapter is not product AI.

## ADR-008 — Verify renders a normalized deterministic execution trace

**Accepted 2026-09-07.** Successful execution emits an immutable, versioned trace containing source and semantic identities, ordered operations, validated operation inputs, meaningful row counts, warnings, plan version, engine version, and final row count. Verify renders these trace facts rather than maintaining a separate description of canonical calculations. Invalid or unresolved intent never produces an execution trace.

## ADR-009 — DataGraph entity IDs and content identities are distinct

**Accepted 2026-09-07.** DataGraphs and revisions have non-content entity IDs so one address or event remains distinct from its content. Exact source bytes, source profile, semantic context, result rows, and revision content use SHA-256 identities over bytes or canonical JSON. Revision content identity binds its parent content hash, source, semantics, interpretation, validated plan, execution trace, result, visualization, and warnings while entity IDs and creation time remain non-authoritative metadata. The source artifact is retained as base64 in the versioned envelope for the narrow proof; persistence architecture must measure the actual envelope before choosing D1, R2, or a split.

## ADR-010 — The founding share proof stores the complete envelope in D1

**Accepted 2026-09-07.** The measured two-revision canonical DataGraph is 11,752 bytes including its 1,137-byte source, so the first persistence boundary stores one validated JSON envelope per DataGraph in D1. R2 is deferred until measured source or envelope size justifies separate object custody. Reads are public to anyone holding the unlisted entity URL; exact source bytes are therefore public to link recipients and this is disclosed before save. A random write token is returned only on creation, stored as a SHA-256 hash in D1, retained locally by the creator, and required to append immutable revision history or delete the object. Historical loads render stored results; recomputation remains an explicit later action.
