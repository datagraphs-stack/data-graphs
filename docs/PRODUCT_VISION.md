# Product vision — web data to intelligence

## The company

DataGraphs is a web-data and intelligence business, not a customer-upload analytics application. Its core is an owned system that collects permitted internet information and turns it into maintained, connected, evidence-backed knowledge. Product interfaces consume this shared foundation.

The intended advantage is useful coverage, accurate identity resolution, freshness, history, source evidence, and integration into recurring decisions. Raw page volume, a crawler, an AI wrapper, or a graph visualization alone is not evidence of a durable business.

## The underlying graph

Use stable entities such as organizations, domains, products, services, locations, categories, and public opportunities as a starting vocabulary. Add relationship types only when supported by an intelligence use case and evidence.

Preserve source observations separately from interpreted entities and edges. A published claim is not automatically a true fact. Each material claim should carry a source reference, retrieval time, source publication or event time when known, extraction version, supporting content location, and quality/uncertainty state. Record when a claim was first and last observed. Keep contradictions, corrections, and reversible merge/split decisions.

Never overwrite an earlier observation simply because a newer source differs. Detect explicit changes separately from temporary fetch failures and disappearance. Inferred links must be labeled as inferences; deterministic derived metrics must retain their calculation evidence.

The existing version-1 DataGraph analytical envelope is a demo artifact. The new entity/claim graph needs an explicit separate schema and migration boundary; do not reinterpret old saved objects as knowledge-graph entities.

## Shared machinery

Source discovery and permission registry -> budgeted crawl frontier -> fetch and evidence storage -> structured extraction -> normalization and entity resolution -> graph storage and indexes -> temporal change detection -> product-specific signals and delivery.

Provide deduplication, retries, idempotent processing, domain-level politeness, size/time limits, quality sampling, and spend accounting. Prefer structured feeds and deterministic extraction where suitable; reserve optional model extraction for bounded cases where measured value justifies the cost. Model output is untrusted input, never proof by itself.

A starting Cloudflare design may use Workers for controlled acquisition and APIs, D1 for indexed operational records and bounded graph queries, R2 for permitted source artifacts and larger records, and a scheduled queue-backed processing path when justified. This is a proposed architecture, not implemented infrastructure or an unlimited-scale guarantee. Keep durable data formats exportable and source keys stable.

## Products built from the graph

Candidate outputs include vertical opportunity feeds, competitor/product change monitoring, supplier/market discovery, and APIs or evidence packs for other products. A customer should be able to receive useful intelligence without bringing a CSV, operating a graph database, or commissioning a generic research project.

The initial product selection remains open pending competition, source access, freshness, unit-cost, and buyer evidence. Near-term subscription hypotheses may be tested inside the founder's earlier $10-$100/month range; these are neither approved prices nor revenue forecasts. Enterprise data access and licensed packages may follow where rights and demand support them.

## What the CSV Studio becomes

Retain it as a demonstration and source of reusable provenance, identity, validation, and calculation components. Do not prioritize additional CSV SaaS features or private-upload monetization as the route to the graph business. Do not hide known public-link exposure. Preserve the current deployment until a separately reviewed change replaces or relabels its public presentation.

Historical vision: `history/pre-reset-2026-09-09/PRODUCT_VISION.md`.
