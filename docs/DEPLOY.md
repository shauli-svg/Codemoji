# Deploy

CodeMoji X is a static site. Anything that serves files works.

## Primary path — GitHub Pages

Two workflows ship with the repo:

- `.github/workflows/release.yml` — runs on tag pushes (`v*`) and on
  manual `workflow_dispatch`. Builds, verifies, publishes to
  `github-pages`.
- `.github/workflows/pages-deploy.yml` — runs on every push to `main`.
  Same build + verify pipeline, then a live smoke check against the
  published URL.

Required one-time setup:

1. Repository **Settings → Pages → Source**: GitHub Actions.
2. Set the repository secret `LIVE_BASE_URL` to the Pages URL once it's
   known (e.g. `https://yourorg.github.io/codemoji-x-product/`). The
   smoke job uses it for a post-deploy check.

Manual release:

```bash
git tag v1.0.0
git push origin v1.0.0
# Release workflow runs automatically
```

Live smoke run on demand (against any URL):

```bash
npm run smoke:live -- https://yourorg.github.io/codemoji-x-product/
```

## Alternative — Cloudflare Pages (planned)

A future workflow (`.github/workflows/cloudflare-pages.yml`) can use
`cloudflare/pages-action@v1` against an account-scoped API token. The
build output is identical: `dist/` contains everything. See
[`RUNBOOK.md`](RUNBOOK.md) for the human checklist.

## What gets shipped

`scripts/build-static.mjs` writes to `dist/`:

```
dist/
├── BUILD_ID.txt          stamped at build time
├── README.md             user-facing
├── docs/                 product + decisions
├── index.html            with <meta name="build-id">
├── public/
│   ├── icons/
│   ├── manifest.webmanifest
│   └── service-worker.js
└── src/                  ES modules, no bundling required
```

Bundle budgets enforced by CI: JS ≤ 180 KB, CSS ≤ 80 KB. The current
build is ~27 KB JS / ~7 KB CSS — well under budget.

## Caching

`public/service-worker.js` uses `codemoji-x-shell-v2`:

- `install`: pre-caches the shell.
- `activate`: deletes stale `codemoji-x-shell-*` versions and claims
  clients.
- `fetch`: network-first with cache fallback (so HTML revalidates).

Bump the constant when the shell asset list changes; the next visit
will replace the cached shell.
