# Runbook

## Local development

```bash
npm run dev               # http://127.0.0.1:5173
npm run verify            # the same gate CI runs (≈15s on a laptop)
npm run preview           # serves the built dist/ on port 4173
```

## Daily PR cycle

1. Branch off `main`.
2. Edit code.
3. `npm run verify` until green.
4. Commit, push, open PR.
5. CI runs `verify` again on a clean Ubuntu Node 22 image.
6. Squash-merge.

If `verify` fails locally but you cannot reproduce the failure on a
teammate's machine: check `node --version` is ≥ 22, then delete
`dist/` and rerun.

## Release to production

The default deploy is GitHub Pages.

1. Confirm `main` is green.
2. Bump `package.json` `version`.
3. Update `BUILD_ID.txt` automatically by running `npm run build`.
4. Tag: `git tag v<version>` and `git push --tags`.
5. The `Release` workflow:
   - Runs the full `verify`.
   - Configures Pages.
   - Uploads `dist/` as a Pages artifact.
   - Deploys.
6. After the workflow finishes, run
   `npm run smoke:live -- <production URL>` to confirm the live page
   loads.

## Adding Cloudflare Pages later

1. Create a Cloudflare Pages project, "direct upload" mode.
2. Create an API token with `Account.Cloudflare Pages: Edit`
   permission.
3. Store the token as the repo secret `CLOUDFLARE_API_TOKEN` and the
   account id as `CLOUDFLARE_ACCOUNT_ID`.
4. Add a `cloudflare-pages.yml` workflow that calls
   `cloudflare/pages-action@v1` with `directory: dist`.
5. Add a CNAME record pointing to the Pages project.
6. Decide which host is primary: keep both, or remove the GitHub Pages
   workflow.

## Hotfix

If a regression sneaks through:

1. Open a hotfix branch off the last released tag.
2. Fix + add a regression test in `tests/unit/` or `tests/static/`.
3. Tag with a patch version (`v1.0.1`) and let `release.yml` deploy.

## Incident triage

The product has no backend in V1, so most incidents are static-asset
issues:

- **Bubble not appearing** — check `service-worker.js` cache version;
  bump it.
- **WhatsApp share line is generic** — verify the teaser pool is
  shipped; if missing, the static check would have failed in CI.
- **Wrong sign always shown** — likely a `crypto.subtle` mismatch in
  the browser; check the user's browser version. The capsule format
  has not been broken.

## Resetting onboarding for testing

Open DevTools console on the page:

```js
localStorage.removeItem("cmx.onboarding.v1");
location.reload();
```
