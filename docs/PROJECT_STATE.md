# Project state — September 9, 2026 founding reset

## Direction and repository record

DataGraphs is an **internet data foundry and graph intelligence platform**. The target is **one perfect 100-company Market Graph**, not the CSV MVP. Full Owner commissions are in `commission/`; original historical records remain unmodified in `history/`. ADR-013 supersedes the former company strategy while preserving Studio as the Lab.

Change record: **PR #26**, `build/foundry-reset-2026-09-09`, based on main `979b64eb1a21bd5a43c7ee5ae9dbc92838de80e5`. Feature revision: `94f05457c79f6b7bc6b3ce6f2951952407ef4e1a`. Git and the PR are the authority for merge/current-HEAD status. This record update changes documentation only. Detailed proof: `reports/FOUNDRY_RESET_2026-09-09.md`.

## What is built and proven

- Canonical reset, preserved full commissions, autonomous operating directive, dependency roadmap, architecture and explicit strategy supersession.
- Foundry homepage artifact; Studio preserved at `/lab/` with existing `/g/*` share routing. Existing Studio engine, API functions, data and deployment configurations were not changed.
- D1-compatible source registry: stable origin identities, idempotent registration, policy history, due selection, atomic leases and stale/revoked-holder protection. Bounded mission validation, additive migration `0003_foundry_registry.sql` and local-only SQLite CLI are implemented. Sources default to pending. No public write API or network acquisition exists.
- GitHub CI automatically runs tests, syntax checks and build using pinned actions and read-only permissions. No deployment step, secrets, schedule or code-generation agent is installed.

**Full repository verification:** GitHub PR run `34415364723`, job `102678930823`, tested PR merge candidate `c1910bbdb35a1c5006653371ba7b7e3df8fefacf` for feature `94f0545` against base `979b64e`: **68 tests passed, 0 failed; 26 JavaScript modules syntax-checked; build passed**. This includes 36 new focused tests. Local CLI validation, two pending fixture-source registrations and read-only reopen succeeded. Offline Chromium desktop/mobile homepage rendering had no page errors or mobile horizontal overflow; HTTP browser navigation returned `ERR_BLOCKED_BY_ADMINISTRATOR` and is not verified. Review was self-review, not independent review.

## What is not deployed or proven

No Cloudflare migration or deployment was made. Historical last deployed code remains the record in `DEPLOY_ORIGIN.md` (`fec07f5`; production `93111df8`, staging `bd351d20`), not a newly verified runtime. The new homepage is a tested artifact, not a claim about the live website. The local SQLite adapter does not establish live D1 compatibility.

No real company pages, R2 snapshots, graph entities or real change events were produced. The 100-company Market Graph, scheduled crawling and an unattended coding agent are not built. CI validates commits only. Phase 0 is reconciled in this revision; Phase 1 has a working local registry slice but is not proven on Cloudflare or real company domains. The old CSV proof does not satisfy the reset MVP.

## Exact blocker and next dependency

Cloudflare — DataGraphs OpenAPI `search` and a read-only `execute` GET of Pages project `datagraphs-staging` both returned **`FORBIDDEN: This conversation does not support developer MCPs`** before any Cloudflare API response. This is a conversation/tool-runtime rejection, not an established credential problem. No missing secret was demonstrated. No alternate route was used to bypass the rejection.

Required changed condition: a session/connector execution route that supports the existing Cloudflare connection. Do not repeatedly retry unchanged calls or assert that regranting permissions is proven necessary.

Next runtime dependency: bounded staging read/write/cleanup and deployment verification; then apply the reviewed additive registry migration to staging only and inspect approved real source origins. Independent work may continue on bounded crawler fixtures and robots/source-policy, DNS/redirect, byte/time/rate/budget and archive contracts. URL syntax validation alone is not SSRF protection. The first real acquisition proof requires five approved public company domains and evidence custody. Production, DNS, paid services, secrets, destructive mutations and broad acquisition remain outside this campaign.
