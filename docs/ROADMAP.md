# Dependency roadmap — web graph and intelligence

The founder correction of 9 September 2026 replaces the CSV-first roadmap. Start narrowly in coverage while building reusable web-data machinery. Milestones below are proposed implementation gates, not claims of delivered capability or calendar estimates.

## 1. Establish a bounded collection brief and buyer hypothesis

Choose a provisional topic, permitted source set, entity/relationship vocabulary, recurring buyer decision, and desired freshness. Compare existing products and current alternatives. Define source permissions, acquisition/retention restrictions, acceptance checks, spending limits, and the intended intelligence output. Product selection must remain labeled a hypothesis until tested; it must not become an unapproved permanent pivot.

Exit: a reproducible collection contract and a concrete example of intelligence a named buyer type would evaluate. Do not build an entire market-research platform before a bounded collector can be tested.

## 2. Build the collection and evidence loop

Implement a source registry and bounded crawl frontier; fetch approved sources; retain permitted source artifacts, retrieval metadata, content hashes, and versioned processing status. Handle redirects, denied sources, invalid content, retries, duplicates, request-size/time limits, and SSRF-safe network destinations. Schedule work within domain and account budgets. Prefer no-cost authorized feeds and APIs when more reliable than page parsing.

Exit: repeatable intake that produces identifiable source versions, does not duplicate unchanged material, and emits measurable acquisition costs and failures. No bypassing access restrictions.

## 3. Build the first connected knowledge graph

Extract candidate observations and supporting evidence; validate types and required fields; normalize entities; reconcile identifiers; store relationships and uncertainty. Keep merges reversible and contradictory observations visible. Support bounded useful queries over entities, claims, sources, and relationships.

Exit: records from multiple independent source documents link to the appropriate entities, each returned claim has inspectable evidence, and sampled false merges/extraction errors are measured. A chart or a count of downloaded pages is not this proof.

## 4. Prove maintained intelligence

Recrawl; distinguish source changes from retrieval failures; emit versioned events; apply a transparent product rule; publish a useful evidence-backed alert, searchable list, report, or API response. Reuse the existing deterministic analytics only where it adds value.

Exit: a real changed observation leads to the correct changed relationship or event and a relevant intelligence item without manual reconstruction. Measure freshness, false alerts, useful-signal yield, and total cost. A prospective buyer evaluates the output, not a CSV demo.

## 5. Validate a paid product and expand from its evidence

Test actual willingness to pay, a repeatable acquisition route, repeat use, and contribution margin after collection, extraction, storage, delivery, support, and payment costs. Measure shared-data reuse separately from user-specific processing. Expand coverage and introduce additional products only when quality, demand, permissions, and economics support them.

Revenue should fund justified growth; neither an expensive domain nor a large graph guarantees demand. No fixed launch date, revenue forecast, or internet-scale capacity is established by this roadmap.

## Progress scorecard

Track permitted source coverage, successful refresh rate, unique resolved entities, evidence-backed relationships, sampled extraction/matching accuracy, freshness, useful intelligence delivered, paid/repeat usage, and cost per useful signal. Page count and graph size are operational measures, not business success.

Historical roadmap: `history/pre-reset-2026-09-09/ROADMAP.md`.
