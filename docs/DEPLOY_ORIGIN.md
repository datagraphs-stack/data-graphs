# Deployment origin

Cloudflare Pages project `datagraphs-staging` serves the production branch at `https://datagraphs-staging.pages.dev`. It has no runtime bindings.




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
