# Deployment origin

A Cloudflare Pages project named `datagraphs-staging` was created on 2026-09-06. Wrangler accepted a six-file preview deployment for branch `work` at `https://a3ce8e22.datagraphs-staging.pages.dev` with alias `https://work.datagraphs-staging.pages.dev`. There are no runtime bindings.

The artifact was produced by `npm run build` and uploaded with `npx wrangler pages deploy dist --project-name datagraphs-staging --branch work --commit-dirty=true`. This first upload preceded the implementation commit, so it is deployment-mechanism evidence rather than a Git-to-runtime receipt.

Runtime verification is not complete: repeated curl requests from this environment returned an upstream 503 for both preview hosts, while the undeployed production host returned Cloudflare's 404. Do not claim the application is reachable until `/`, `/orders.csv`, and the canonical calculation are independently exercised. DNS for datagraphs.ai remains a separate later owner action.
