# DataGraphs

**Internet data foundry and graph intelligence platform.**

DISCOVER → ACQUIRE → ARCHIVE → EXTRACT → RESOLVE → GRAPH → MONITOR → SIGNAL → PRODUCT.

The first proving target is one perfect 100-company Market Graph: public first-party sources, preserved evidence, durable entities and relationships, temporal history and meaningful changes. This is in development, not a launched 100-company dataset.

Start with `AGENTS.md`, `docs/FOUNDING_RECORD.md`, `docs/PRODUCT_VISION.md`, `docs/AUTONOMOUS_BUILD_DIRECTIVE.md`, `docs/ROADMAP.md` and `docs/PROJECT_STATE.md`. The full Owner commissions are preserved in `docs/commission/`.

## Development

Node 22.16 or compatible newer Node 22 with `node:sqlite` is required for local registry tests. No npm dependencies or paid providers are needed for the current test/build pipeline.

```sh
npm test
npm run check
npm run build
npm run dev
```

`/` is the foundry homepage; `/lab/` is the preserved DataGraph Studio / Lab; existing `/g/*` share routes continue loading the Studio. Local development does not emulate the Cloudflare Functions APIs.

The initial foundry source registry and mission validator are in `lib/foundry/`. They perform no web acquisition. A D1-compatible adapter, additive migration and a local development CLI are present; this is not evidence that the migration has been applied to Cloudflare. See `docs/architecture/FOUNDRY.md` and current state.

CI automatically runs tests, syntax checks and build on PRs and main/build branch pushes. It does not generate code, deploy, crawl or establish an unattended agent service. Staging/production deployment status must be established by actual runtime receipts.
