# Foundry reset implementation and verification receipt

## Repository operation evidence

Repository: `datagraphs-stack/data-graphs`. Change record: PR #26, branch `build/foundry-reset-2026-09-09`.

The connected repository permission response returned admin, maintain, pull, push and triage as true. Live branch creation, Git tree creation, commit creation, non-forced branch update and PR creation succeeded. Repository permissions are not proof that every GitHub account-level operation was tested.

Base: `979b64eb1a21bd5a43c7ee5ae9dbc92838de80e5`.
CI installation: `c9b0f0ff1c0cb5c10f39fd46bfeaa063a332ac2b`.
Feature: `94f05457c79f6b7bc6b3ce6f2951952407ef4e1a`.
Feature tree: `129147d7b64e30f78adcd31e8eef422cb3ebb343`.

## Full-repository execution

Baseline run `34414148738` passed the prior repository suite, syntax and build.

PR run `34415364723`, job `102678930823`, checked out PR merge candidate `c1910bbdb35a1c5006653371ba7b7e3df8fefacf` (feature `94f0545` against base `979b64e`). Actual job logs show:

```
node: v22.16.0
# tests 68
# pass 68
# fail 0
# cancelled 0
# skipped 0
# todo 0
Syntax checked 26 JavaScript modules.
Built DataGraphs foundry homepage and preserved Studio / Lab in dist/
```

The 36 new focused tests cover origin/mission validation, default pending policy, idempotency, additive migration, policy audit and lease invalidation, atomic claims, stale/expired ownership, bounded inspection, transaction rollback, disk reopen persistence and static homepage/Lab/share routing. Existing deterministic computation, intent, provenance and persistence tests also passed. SQL testing used local SQLite through the D1-compatible adapter, not Cloudflare D1.

Local CLI validated a bounded fixture mission, registered two pending fixture sources and reopened the database read-only. It made no web acquisition or Cloudflare calls. Offline Chromium rendered the authored homepage at desktop 1440×1000 and mobile 390×844 with zero page errors and no mobile horizontal overflow. HTTP navigation in the local environment returned `ERR_BLOCKED_BY_ADMINISTRATOR`; neither live HTTP routing nor live Studio browser behavior is claimed from that render.

## Review scope

Self-review examined the feature code and complete changed-file list: parameterized SQL; conservative source defaults; explicit activation notes; idempotent registration without silent policy overwrite; atomic lease ownership and revocation; additive tables; no public mutation/fetch endpoint; no model-generated authoritative facts; preservation of Studio source modules and Functions; no changes to Wrangler, DNS, credentials or existing data; no deployment in CI. Independent review was not available and is not claimed. GitHub reported main unprotected and no requested reviewers on this PR; no protection was altered or bypassed. Merge results remain independently observable in the PR/Git history.

The registry is not the crawler. Hostname syntax checks are not DNS/rebinding protection. Mission budgets are validated configuration, not an implemented crawl scheduler. Source IDs are not company identities. Phase 1 runtime/real-domain proof and the new MVP remain incomplete.

## Cloudflare access attempt and exact boundary

The OpenAPI search operation and a separate read-only GET for `datagraphs-staging` through the execute action both returned:

```
ToolError: FORBIDDEN: This conversation does not support developer MCPs
```

The rejection occurred before a Cloudflare API response; it does not demonstrate a Cloudflare credential rejection or identify a missing secret. No Cloudflare write, deployment, D1 mutation, DNS update, paid commitment or secret change was performed. No alternate path was used to bypass the runtime restriction. Historical deployment evidence remains historical only.

Changed condition required: the existing connection must be callable in a supported conversation/runtime. Repeating identical failed calls without a changed condition is not useful. Meanwhile, local/repository acquisition fixtures and bounded safety/archive implementation can continue under ordinary engineering authorization.

## Automation boundary

Installed automation is GitHub CI on pushes/PRs, with read-only contents permission, pinned actions and test/syntax/build steps. It does not create code, schedule crawls, deploy or keep an engineering agent running after a chat session ends. The full Owner directive remains the target operating model, not a falsely declared always-on capability.
