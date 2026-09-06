# Deployment origin

A Cloudflare Pages project named `datagraphs-staging` exists with no runtime bindings. The commit-linked preview for branch `work` is `https://5f93f1db.datagraphs-staging.pages.dev`, aliased at `https://work.datagraphs-staging.pages.dev`.

## Runtime receipt — 2026-09-06T17:08:16Z

- Git commit: `edf8246f2e443b2d9d45b0c58736254ed75b65c4`
- Branch: `work`
- Artifact: `dist/`, produced by `npm run build`
- Deploy: `npx wrangler pages deploy dist --project-name datagraphs-staging --branch work --commit-hash <Git SHA> --commit-message "Harden deterministic decimal computation"`
- Wrangler result: six assets present; deployment completed successfully
- HTTP smoke: `/` returned 200 `text/html`; `/orders.csv` returned 200 `text/csv`
- Deterministic calculation: canonical exact-value test passed locally against the same source and shipped engine
- Interactive staging smoke: not run because this environment has no browser executable

This receipt proves Git-linked artifact deployment and HTTP availability, but does not fabricate browser execution evidence. DNS for datagraphs.ai remains a separate later owner action.
