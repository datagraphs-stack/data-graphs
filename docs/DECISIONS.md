# Architectural and product decisions

## ADR-013 — Founder-directed web graph business reset

**Founder direction recorded 9 September 2026.** The current mission is to collect permitted internet data, build maintained evidence-backed graphs of entities and relationships, and power intelligence products. The founder explicitly rejects CSV-upload analytics as the business and allows the existing application to remain a demonstration.

This supersedes the CSV-first beneficiary, commercial plan, milestone sequence, and the requirement to earn graph development through CSV usability. It does not invalidate tested implementation details within the demonstration. The implementation sequence in the current roadmap is a proposed response to the founder directive, not evidence that a market, price, or additional spending has been approved.

### Consequences

- Preserve the current demo and reusable source identity, provenance, validation, versioning, and deterministic computation. No deletion or production cutover is authorized by this documentation reset.
- Make the web collection -> entity/claim graph -> maintained intelligence loop the core development path.
- Use a separate explicit schema for entities, source observations, relationships, and change events. Existing analytical envelopes retain their existing meaning.
- Separate source assertions, model-extracted candidates, inferred links, and calculated values. Evidence and consistent hashes are necessary checks, not proof that an external claim is true.
- Make source permissions, safe acquisition, privacy boundaries, uncertainty/correction, idempotency, freshness, and spending controls foundational.
- Keep deployment within the small approved Cloudflare baseline. Use owned code and suitable open-source/no-cost sources. Do not add paid external dependencies or automatic budget increases as assumptions.
- Treat any pilot market as provisional. A bounded initial graph should build reusable machinery, not silently redefine the long-term company.

### Earlier decisions

ADR-001 through ADR-012 are preserved without alteration in `history/pre-reset-2026-09-09/DECISIONS.md`. Their browser-first execution, full-envelope D1 storage, canonical commerce semantics, and CSV publication decisions describe the demo. Reuse those components only where they fit the new source/claim graph; they do not mandate its architecture.

### Verification boundary

This decision changes project intent and planning. It does not deploy a crawler, implement knowledge-graph storage, establish customer demand, or prove unit economics.
