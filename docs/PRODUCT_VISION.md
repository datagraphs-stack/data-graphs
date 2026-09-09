# Product vision — Internet Data Foundry

DataGraphs turns the fragmented public internet into structured, temporal, provenance-backed graphs that humans, applications and agents can use as intelligence. The canonical detailed blueprint is `commission/FOUNDING_RESET_2026-09-09.md`.

## What a DataGraph contains

Entities and aliases; attributes; relationships; events; observations; source claims; immutable snapshots; temporal validity; provenance; confidence; contradictions; deterministic derived metrics; history; computed signals; product-specific projections. Company, Product, Regulatory, Property and Industry DataGraphs share these primitives but retain domain-specific semantics. A domain/source ID is not proof of a company identity.

## Trust architecture

**SOURCE → SNAPSHOT → OBSERVATION → CLAIM / FACT → ENTITY → RELATIONSHIP → GRAPH STATE → EVENT / SIGNAL → INTELLIGENCE PRODUCT.**

An observation comes from a particular snapshot, not universal truth. Conflicting claims coexist. Entity resolution preserves uncertainty, merge/split history and reversibility. Historical graph states must be reconstructable. Meaningful signals require supported changes, not merely changed bytes. Missing evidence means a claim cannot be published.

AI may classify, propose extraction/ontology/relationship/entity-match candidates, normalize semantics, summarize changes and interpret queries. AI is not the evidence, cannot silently establish authoritative values and must not fuse ambiguous identities. Use deterministic parsers, validation and calculations wherever possible.

## Eight system layers

A. **Acquisition Fabric:** seeds, domain discovery, sitemaps, feeds, authorized APIs, open/bulk data, bounded browser rendering when justified, scheduling, budgets, rate limits and failures.
B. **Evidence Archive:** immutable raw snapshots where appropriate, hashes, timestamps, HTTP metadata, source identity, meaningful-content fingerprints and history.
C. **Extraction Fabric:** deterministic and AI-assisted candidates, structured observations, schema validation, source spans and confidence.
D. **Identity & Resolution Engine:** canonical IDs, aliases, exact identifiers, scored candidates, conflicts, reversible decisions and review.
E. **Graph Compiler:** entities, edges, facts, temporal properties, provenance, event history, projections and domain ontologies.
F. **Change & Signal Engine:** meaningful supported product, pricing, hiring, leadership, location, partnership and regulatory changes.
G. **Intelligence Delivery:** public pages, explorers, search, dashboards, alerts, reports, APIs, feeds, datasets and eventually SDK/MCP/embedded interfaces.
H. **Intelligence Businesses:** vertical products and reusable portfolio infrastructure.

## First product: Market Graph

Prove one bounded 100-company market from first-party public sources. Explore companies, products, categories, supported competitor clusters, changes, events, timelines and underlying evidence. Free exploration can support discovery; paid monitoring, history, alerts, comparison, exports, saved competitors and APIs may create recurring value. Free/Professional/Team/Business packaging and every exact price remain hypotheses until validated.

Revenue paths: vertical intelligence; graph APIs; maintained data feeds/datasets; managed DataGraph builds; internal infrastructure for future products. The customer buys intelligence and decisions, not a crawler or graph picture.

Defensibility should compound through historical evidence, source registry/acquisition knowledge, parsers, ontology, identity-resolution decisions, relationship histories, provenance, temporal events, useful domain signals and customer feedback. Crawling, raw HTML, an LLM prompt and visualizations alone are not the moat.

## Portfolio and platform

Cloudflare Workers, Workflows, Queues, R2, D1 and selective Workers AI are the initial architecture vocabulary, not a claim they are all deployed. Browser Rendering is exceptional. Start at hundreds, measure, and evolve storage/query infrastructure only when needed. No paid external tools, data providers or separate AI subscriptions are approved.

BusinessPermitGuide, Averdane and W3Africa are potential regulatory, property and Africa-focused intelligence consumers. Do not force premature rewrites; converge shared primitives only when it reduces duplication.

## Studio / Lab and non-goals

Preserve the deterministic Studio for demonstration, future private-data enrichment/analysis, and debugging. Do not rebuild a CSV-first company, generic chatbot, chart generator, spreadsheet replacement, graph database, text-to-SQL wrapper, enterprise BI clone, proxy business or scraper-for-hire.

Source policy favors official websites, public documentation, registries/filings, government/open data, feeds and permitted corpora. No anti-bot circumvention, private sources or sensitive profile harvesting. Do not republish full copyrighted source pages as the product. Internal evidence custody and public citations/structured claims are separate decisions; support opt-outs, budgets and rate controls.
