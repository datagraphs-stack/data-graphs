# Project state — September 9, 2026 founding reset

## Direction and active work

DataGraphs is an internet data foundry and graph intelligence platform. The active target is one perfect 100-company Market Graph, not the CSV MVP. Full Owner commissions are in `commission/`; old records remain unmodified in `history/`. ADR-013 supersedes the former company strategy while preserving Studio as the Lab.

This campaign is on `build/foundry-reset-2026-09-09`, based on main `979b64eb1a21bd5a43c7ee5ae9dbc92838de80e5`. Integration status and exact CI receipts must be refreshed after review/merge.

## Built in this campaign

- Canonical reset, full source commissions, operating directive, dependency roadmap, architecture and explicit strategy supersession.
- Foundry homepage artifact and preserved `/lab/` plus `/g/*` Studio routes; no production deployment made.
- D1-compatible source registry: stable origin identities, idempotent registration, policy audit, due selection, atomic leases and stale-holder protection. Mission validation is bounded and fail-closed. Additive migration `0003_foundry_registry.sql` is **not applied remotely**.
- Local SQLite development adapter/CLI. Sources default to pending. No public write/crawl API or network fetch loop exists.
- Automatic GitHub CI with pinned actions, read-only permissions, tests, syntax checks and build; no secrets or deploy step.

## Proof and non-proof

36 focused local tests pass, covering source/mission policy, persistence after reopen, SQL rollback, scheduling, stale/revoked leases and static Lab/share routing. Baseline GitHub run `34414148738` for `c9b0f0f` passed the pre-existing suite, syntax and build. Full-campaign CI and merged-state evidence are pending at this draft state. The local CLI successfully validated a fixture mission, registered two pending fixture sources and reopened them read-only; no websites were contacted. Offline Chromium rendering of the authored homepage passed desktop/mobile layout checks with no page errors or mobile horizontal overflow; HTTP browser navigation was not verified because the local URL returned `ERR_BLOCKED_BY_ADMINISTRATOR`.

Existing Studio engine, API functions and data are preserved. Historical last deployed runtime is recorded in `DEPLOY_ORIGIN.md` (`fec07f5`; production `93111df8`, staging `bd351d20`). Those are historical receipts, not new Cloudflare reads in this session. The old CSV founding proof does not satisfy the reset MVP.

No real company pages were acquired in this campaign; no R2 snapshots, graph entities or real change events were produced; no live Market Graph, scheduled crawler or unattended coding agent was installed. CI validates commits only.

## Exact current blocker

Cloudflare — DataGraphs `search` and a read-only `execute` of GET Pages project `datagraphs-staging` both returned **`FORBIDDEN: This conversation does not support developer MCPs`** before an API response. This is a conversation/tool-runtime rejection, not a Cloudflare credential rejection. No write, deployment, D1 mutation, DNS change, secret change or paid service was attempted through an alternate route.

Required changed condition: a supported session/connector execution route that can actually invoke the existing Cloudflare connection. Do not repeatedly retry the same blocked call without new evidence or claim regranting account permissions is proven necessary. No missing secret has been established.

## Exact next dependency

Finish review/integration and record full CI. Once Cloudflare execution is available, perform bounded staging read/write/cleanup and deployment verification, then apply the reviewed additive registry migration to staging only and inspect registered real source origins. Phase 1 is implemented locally but is not runtime-proven on D1.

Independent work may continue on crawler fixtures and bounded robots/source-policy, DNS/redirect, byte/time/rate/budget and archive contracts without another routine Owner approval. Do not begin a live crawl with only hostname syntax validation. Phase 2 real proof requires five approved public company domains and actual evidence custody. Production, secrets, paid providers, destructive migrations and broad acquisition remain outside this campaign.
