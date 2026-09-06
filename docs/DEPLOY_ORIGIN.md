# Deployment origin

No staging deployment exists as of 2026-09-06. No Cloudflare credentials or configured project were present during bootstrap.

The build artifact is `dist/` from `npm run build`. Intended direct mechanism (once Wrangler is available): `npx wrangler pages deploy dist --project-name datagraphs-staging --branch <git-branch>`. Required authority is an authenticated Cloudflare account with permission to create/deploy that Pages project; there are no runtime bindings yet. Verify `/`, `/orders.csv`, the canonical calculation, and record deployed URL, UTC time, Git SHA, branch, command, and smoke-test result here. Do not claim a deployment from source alone.

**Owner action required:** provide Cloudflare authentication/project authority in the connected environment (or run the command above and return the URL) before staging can exist. DNS for datagraphs.ai is a separate later owner action.
