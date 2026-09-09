# ADR-013 — Internet Data Foundry founding reset

**Accepted September 9, 2026, by explicit Owner commission.**

## Context
The existing founding record and roadmap describe a commerce-CSV analytics wedge. The Owner explicitly supersedes that direction with an internet data foundry and graph intelligence platform and a default-autonomous engineering directive. Full commissions are retained in `../commission/` and unmodified prior canonical records in `../history/`.

## Decision
The company loop is DISCOVER → ACQUIRE → ARCHIVE → EXTRACT → RESOLVE → GRAPH → MONITOR → SIGNAL → PRODUCT. The first proving target is one perfect 100-company Market Graph, with durable identity, evidence and temporal changes. The previous CSV proof is retained as DataGraph Studio / Lab, not the new MVP or company narrative.

Supersede the old founding customer, wedge, CSV-first roadmap and company-wide interpretation of earlier browser-first decisions. Preserve ADR-002 through ADR-012 where they govern the existing Lab and compatible deterministic/provenance boundaries. ADR-001's dependency-free JavaScript remains useful but browser-first is not a foundry-wide restriction. ADR-010's D1 envelope choice remains the Lab persistence decision; it does not defer R2 for foundry raw snapshots.

Add foundry modules under `lib/foundry/` and additive D1 tables prefixed `foundry_`. Existing Studio tables, data, APIs and implementation remain untouched. Source IDs identify canonical HTTPS origins, not organizations; do not merge www/apex or distinct domains without evidence. Registration defaults to pending; activation requires an explicit policy note. Leases are atomic and revocable, and policy changes are recorded. The local SQLite adapter is development/test infrastructure, not a non-Cloudflare production database.

Separate the homepage from the Lab and preserve `/g/*` routes. This is an artifact change until a deployment is actually made. CI gets read-only repository permissions, pinned actions, no secrets and no deployment steps. Production, DNS, paid providers and credentials are not changed by this decision.

## Consequences and proof
Future agents follow the full Owner directive, fail closed on data truth and continue ordinary authorized engineering without fake gates. A CI workflow is not a self-building service. Cloudflare runtime tests remain a separate requirement; local SQLite tests cannot establish D1 deployment or API authority. The new MVP is incomplete until the full source-to-intelligence loop runs on a real bounded market.
