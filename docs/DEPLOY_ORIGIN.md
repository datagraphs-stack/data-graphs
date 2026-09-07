# Deployment origin

Cloudflare Pages project `datagraphs-staging` serves the staging application at `https://staging.datagraphs.ai` (and its fallback `https://datagraphs-staging.pages.dev`). Its `DB` binding targets the `datagraphs-staging` D1 database. Staging operations must pass `--config wrangler.staging.jsonc` where Wrangler supports custom configuration (including D1 migrations).

Cloudflare Pages project `datagraphs` serves production at `https://datagraphs.ai` and `https://app.datagraphs.ai` (with fallback `https://datagraphs.pages.dev`). Its `DB` binding targets the isolated `datagraphs-production` D1 database. The root `wrangler.jsonc` is the production deployment configuration; apply migrations with `npx wrangler d1 migrations apply datagraphs-production --remote` before deploying dependent code. The apex and `app` hostnames intentionally serve the same production deployment; no canonical-host redirect is asserted yet.

## Merged production and staging release — 2026-09-07T04:03Z

- Git commit: `7ba7604` (merged PR #21; no other pull requests were open)
- Production deploy: `https://6cde5014.datagraphs.pages.dev`, served through `https://datagraphs.ai` and `https://app.datagraphs.ai`
- Staging deploy: `https://cf454e3b.datagraphs-staging.pages.dev`, served through `https://staging.datagraphs.ai`
- Database state: both production and staging D1 migration checks reported no pending migrations
- HTTP smoke: all three custom domains and both immutable deployment URLs returned HTTP 200 with the DataGraphs shell
- API smoke: both custom-domain APIs reached the Functions/D1 boundary and returned the expected JSON 404 for a valid but absent DataGraph identity
- Browser smoke: headless Chromium rendered the production frontend successfully; `artifacts/production-front-end.png` is the visual receipt

## External-hardening runtime receipt — 2026-09-07T03:03Z

- Git commit: `41ede26` (merged PR #19)
- Branch: `main`
- Deploy: `npx wrangler pages deploy dist --project-name datagraphs-staging --branch main --commit-hash <Git SHA> --commit-dirty=false`
- Wrangler result: exact merged release deployed at `https://964e20e7.datagraphs-staging.pages.dev`
- Compatibility proof: an incompatible CSV missing `net_revenue` displayed the concrete issue and left computation disabled
- Intent recovery proof: an intercepted HTTP 429 displayed `INTENT UNAVAILABLE`, produced no authoritative result, and caused no page error
- Publication proof: opening the publication review made no persistence request; confirmation began disabled; only checking the exact-source/public-link acknowledgment enabled a successful create
- Lost-key proof: a fresh browser context loaded the resulting stable route and explicitly reported read-only status because no creator key existed in that browser
- Browser outcome: no page errors
- Durable hardening proof: `https://datagraphs-staging.pages.dev/g/dg_45d917a0-5eff-4ce7-8c36-970f473e7d81`
- Remaining evidence boundary: automated fresh-context testing is not an independent human usability session

## Founding-proof runtime receipt — 2026-09-07T02:40Z

- Git commit: `fcadb4a` (merged PR #16)
- Branch: `main`
- Deploy: `npx wrangler pages deploy dist --project-name datagraphs-staging --branch main --commit-hash <Git SHA> --commit-dirty=false`
- Wrangler result: Pages assets, Functions, D1, and Workers AI binding deployed at `https://fb24b853.datagraphs-staging.pages.dev`
- Migration: `npx wrangler d1 migrations apply datagraphs-staging --remote` applied `0002_intent_usage.sql`
- Upload/profile: a fresh Chromium context uploaded `public/orders.csv`; Studio reported 13 rows and 11 columns
- Intent boundary: both questions returned HTTP 200 from Workers AI model `@cf/meta/llama-3.3-70b-instruct-fp8-fast` using prompt `datagraph-plan-v1`; Verify retained this provenance
- Trust proof: the initial proposal passed deterministic compilation/validation before computation; the annual follow-up did not execute until one of three grain interpretations was explicitly confirmed
- Revision/persistence proof: revision 1 created through API HTTP 201 and revision 2 appended through authenticated HTTP 200
- Reload/share proof: after closing the creator context, a fresh context loaded the stable route read-only, preserved exact source and result identities, and rendered the stored historical result without recomputation
- Browser outcome: no page errors
- Durable DataGraph: `https://datagraphs-staging.pages.dev/g/dg_a9ece9eb-b90e-402b-ba92-39be3d4f01ee`
- Visual receipt: `artifacts/founding-proof.png`
- Conclusion: the exact merged release passes the repository definition of one perfect canonical DataGraph; it is not yet a private, authenticated, general-purpose MVP

## Runtime receipt — 2026-09-07T02:02Z

- Git commit: `1f3f19f` (merged PR #14, following persistence PR #13 at `72508c8`)
- Branch: `main`
- Deploy: `npx wrangler pages deploy dist --project-name datagraphs-staging --branch main --commit-hash <Git SHA> --commit-dirty=false`
- Wrangler result: static assets and the Pages Functions bundle deployed at `https://8d191ac4.datagraphs-staging.pages.dev`
- HTTP smoke: the production hostname returned 200 and the expected DataGraphs shell
- Browser/API proof: Chromium created revision 1 through `POST`, appended revision 2 through authenticated `PUT`, closed the creator context, and reopened the stable route in a fresh browser context
- Identity proof: source and latest-result identities matched before and after reload; the shared context had no creator token and rendered read-only
- Historical proof: reload displayed `STORED HISTORICAL RESULT`; it did not silently recompute; no browser page errors occurred
- Durable proving route: `https://datagraphs-staging.pages.dev/g/dg_c96a717a-381f-43e6-8b0b-4d55b0a07cd5`
- Deployment correction: the first post-PR #13 publish failed because the generated Functions bundle required `node:stream`; PR #14 added the explicit Pages `nodejs_compat` runtime flag, after which the exact merged revision deployed and passed the workflow




## Runtime receipt — 2026-09-07T01:03:37Z

- Git commit: `665530139c0909ca1ffc1994922d1645c158bfbb`
- Branch: `main`
- Deploy: `npx wrangler pages deploy dist --project-name datagraphs-staging --branch main --commit-hash <Git SHA> --commit-message "Create versioned DataGraph envelope and identities"`
- Wrangler result: eleven assets present; deployment completed at `https://a0203c8f.datagraphs-staging.pages.dev`
- HTTP smoke: `/`, `/src/datagraph.js`, and `/src/identity.js` returned 200
- Browser smoke: source identity remained stable across two revisions; revision identities were distinct; revision 2 linked to revision 1; result SHA-256 was visible; no page errors

## Prior runtime receipt — 2026-09-07T00:56:31Z

- Git commit: `1bf54cc5db75a5b5da7c4dce7b56728f63d03ca2`
- Branch: `main`
- Deploy: `npx wrangler pages deploy dist --project-name datagraphs-staging --branch main --commit-hash <Git SHA> --commit-message "Derive Verify from deterministic execution trace"`
- Wrangler result: nine assets present; deployment completed at `https://9c51ddba.datagraphs-staging.pages.dev`
- HTTP smoke: `/` and `/src/trace.js` returned 200
- Browser smoke: four canonical trace operations; no trace while intent was unresolved; five clarified comparison operations with actual 2024/2023 periods; no page errors

## Prior runtime receipt — 2026-09-06T17:56:13Z

- Git commit: `246fcc209e4136b748cb5303bcf57341990ee252`
- Branch: `main`
- Deploy: `npx wrangler pages deploy dist --project-name datagraphs-staging --branch main --commit-hash <Git SHA> --commit-message "Make canonical semantics and ambiguity explicit"`
- Wrangler result: eight assets present; deployment completed at `https://1a2c760a.datagraphs-staging.pages.dev`
- HTTP smoke: `/`, `/orders.csv`, `/src/intent.js`, and `/src/semantics.js` returned 200
- Browser smoke: ambiguous follow-up did not alter the authoritative result; three choices rendered; confirmed annual-total interpretation executed; unknown currency and refunded-row policy appeared in Verify; no page errors

## Prior runtime receipt — 2026-09-06T17:26:43Z

- Git commit: `606cacbe536218dd78a3ced41493baa4f82f5adf`
- Branch: `main`
- Artifact: `dist/`, produced by `npm run build`
- Deploy: `npx wrangler pages deploy dist --project-name datagraphs-staging --branch main --commit-hash <Git SHA> --commit-message "Build canonical comparison revision"`
- Wrangler result: six assets uploaded; deployment completed at `https://d7456146.datagraphs-staging.pages.dev`
- HTTP smoke: `/`, `/orders.csv`, `/src/app.js`, and `/src/style.css` returned 200 with appropriate content types from the production hostname
- Browser smoke: staged Chromium loaded the fixture, computed revision 1, selected and computed the bounded follow-up, opened revision 2 Verify, found three ranked rows, and emitted no page errors
- Visual receipt: `artifacts/canonical-revision.png` records the same flow against the local artifact before merge

The browser ran with certificate errors ignored because the environment's HTTPS inspection proxy presents a non-public certificate authority; direct curl certificate validation succeeded. This receipt proves the merged Git revision, deployed assets, and interactive founding revision flow. DNS for datagraphs.ai remains a separate later owner action.

## Custom-domain and production isolation receipt — 2026-09-07T03:37Z

- Git commit deployed to the production project: `a040b70be277665720d6c58850e948619068656d`
- Production deployment: `https://2de9566f.datagraphs.pages.dev`
- Staging mapping: `staging.datagraphs.ai` → `datagraphs-staging` Pages project → `datagraphs-staging` D1 database
- Production mappings: `datagraphs.ai` and `app.datagraphs.ai` → `datagraphs` Pages project → `datagraphs-production` D1 database
- Database initialization: both repository migrations applied successfully to the isolated production database before deployment
- Cloudflare status: all three custom domains reached active verification and certificate validation
- HTTP smoke: all three custom HTTPS origins returned `200` with the DataGraphs shell
- Functions smoke: a missing DataGraph request on each origin reached the API and returned the expected structured `404`
- Boundary: this receipt proves domain routing, deployment, and environment isolation; it does not turn public-link storage into private sharing or supply independent-human usability evidence
