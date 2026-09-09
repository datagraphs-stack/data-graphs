# Foundry architecture — proving stage

The desired architecture is Acquisition Fabric → Evidence Archive → Extraction Fabric → Identity & Resolution → Graph Compiler → Change & Signals → Intelligence Delivery → Intelligence Businesses. It is specified by the Owner blueprint, not yet an assertion of deployed components.

## Implemented first slice

`lib/foundry/policy.js` owns version-1 mission validation, strict HTTPS origin normalization, stable SHA-256 source IDs, status policy and hard mission bounds (up to 100 sources, 20 pages per source, 2,500 total requests, at least 1-second delay and at most 2 MB per response). These are initial implementation safety ceilings, not validated scale/cost promises. Every redirect, retry, robots and discovery request must consume the request budget when the crawler exists.

`lib/foundry/registry.js` owns D1-compatible source registration, idempotent origin deduplication, status/policy history, inspection/pagination, due-source selection, atomic leases and stale/revoked-holder rejection. Queries are parameterized. Inspection excludes lease tokens. Registration defaults to pending and performs no fetch; activation is a trusted operator action with a policy note, not proof of legal rights.

`migrations/0003_foundry_registry.sql` is additive. It does not modify Studio's existing tables. Application code does not automatically migrate D1. `lib/foundry/local-db.js` adapts Node's local SQLite for tests/CLI; it is not a live Cloudflare D1 emulator or approved production store. `scripts/foundry.js` validates missions and registers/inspects a **local** database, never the network or Cloudflare.

Examples:

```sh
node scripts/foundry.js validate path/to/mission.json
node scripts/foundry.js register path/to/mission.json /tmp/foundry.sqlite
node scripts/foundry.js inspect /tmp/foundry.sqlite
```

Mission JSON: version, lowercase id, name, 1–100 HTTPS source origins, and budget with maxPagesPerSource, maxRequests, requestDelayMs, maxResponseBytes. Unknown fields, duplicate canonical origins, private/literal IP inputs, custom ports, credentials and malformed origins are rejected. Hostname validation does NOT prove public DNS resolution or prevent rebinding; no network acquisition is implemented here.

## Next acquisition contract

A trusted staging worker should enforce source policy/robots, allowed-origin discovery, public-address/DNS protections on every request, manual redirect validation, bounded bytes/time, rate limits, total request budget, retries and opt-outs. Fetch only authorized public sources. Do not expose a public unauthenticated registration/crawl API. Preserve exact acquired bytes and acquisition metadata in R2 where appropriate, with D1 snapshot identity/metadata; graph observations must cite snapshots/spans. Archive custody is separate from public source-page republication.

Prefer deterministic parsers, no paid external data/AI dependencies, and measured adoption of Workers, Queues and Workflows. Do not create a broad scheduler until bounded acquisition can be proven. Five real company domains precede a claimed 100-company milestone.

## Product routes and compatibility

`/` is the foundry homepage; `/lab/` boots the existing Studio; `/g/*` loads the same Lab shell for existing shared DataGraphs. `/api/*` Functions and existing engine modules are unchanged. `scripts/build.js` emits both shells. The dev server mirrors Lab/share routing; it does not emulate Functions/D1. Browser/runtime and staging checks remain separate from static routing tests.

D1 adapter contract reference: https://developers.cloudflare.com/d1/worker-api/d1-database/ (prepare, parameter binding and atomic batch semantics; reviewed September 9, 2026).
