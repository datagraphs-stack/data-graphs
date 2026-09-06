# Architectural decisions

## ADR-001 — Browser-first vertical with Cloudflare-compatible static output

**Accepted 2026-09-06.** Use dependency-free JavaScript modules and Node's test runner for the first vertical. A tiny build copier produces static Cloudflare Pages assets. The engine is UI-independent. This avoids a blocked package registry and minimizes dependencies while proving computation. Add a framework and Workers/D1/R2 only when product complexity, persistence, or server-side custody requires them.

## ADR-002 — `AnalysisPlan` is the constrained execution contract

**Accepted 2026-09-06.** A plan names a source, filters, dimensions/date buckets, metrics/aggregations, sorts, limit, and visualization. Validate structure/fields/types before execution. No arbitrary SQL or generated code. The schema may evolve under versions; the boundary may not be bypassed.

## ADR-003 — Source strings are preserved; inference is conservative

**Accepted 2026-09-06.** CSV parsing preserves cells as source strings. Profiling may infer ISO dates, strict finite numbers, and booleans; `*_id` remains string. Blanks are explicit. Coercion occurs only within an operation that requires it.

## ADR-004 — Current money arithmetic is provisional

**Accepted 2026-09-06.** The proof uses JavaScript numbers and exact two-decimal fixture inputs. Before accepting arbitrary currency computation, use a decimal/fixed-minor-unit policy and test rounding. The current limitation must remain visible in project state.
