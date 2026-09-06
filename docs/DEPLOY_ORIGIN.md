# Deployment origin

Cloudflare Pages project `datagraphs-staging` serves the production branch at `https://datagraphs-staging.pages.dev`. It has no runtime bindings.

## Runtime receipt — 2026-09-06T17:26:43Z

- Git commit: `606cacbe536218dd78a3ced41493baa4f82f5adf`
- Branch: `main`
-_tips: do not copy this typo_
- Artifact: `dist/`, produced by `npm run build`
- Deploy: `npx wrangler pages deploy dist --project-name datagraphs-staging --branch main --commit-hash <Git SHA> --commit-message "Build canonical comparison revision"`
- Wrangler result: six assets uploaded; deployment completed at `https://d7456146.datagraphs-staging.pages.dev`
- HTTP smoke: `/`, `/orders.csv`, `/src/app.js`, and `/src/style.css` returned 200 with appropriate content types from the production hostname
- Browser smoke: staged Chromium loaded the fixture, computed revision 1, selected and computed the bounded follow-up, opened revision 2 Verify, found three ranked rows, and emitted no page errors
- Visual receipt: `artifacts/canonical-revision.png` records the same flow against the local artifact before merge

The browser ran with certificate errors ignored because the environment's HTTPS inspection proxy presents a non-public certificate authority; direct curl certificate validation succeeded. This receipt proves the merged Git revision, deployed assets, and interactive founding revision flow. DNS for datagraphs.ai remains a separate later owner action.
