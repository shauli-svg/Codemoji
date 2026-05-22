// Pick the smoke target with this precedence:
//   1. SMOKE_URL env var (explicit override, easy to set in CI).
//   2. The LAST argv that looks like a URL — this is robust against
//      `npm run smoke:live -- <url>` invocations where npm-script defaults
//      may inject extra args before the user-supplied one.
//   3. Fallback to local dev server.
const urlArgs = process.argv.slice(2).filter((a) => /^https?:\/\//i.test(a));
const rawTarget = process.env.SMOKE_URL || urlArgs.at(-1) || "http://127.0.0.1:5173";
const target = rawTarget.endsWith("/") ? rawTarget : `${rawTarget}/`;

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

const indexHtml = await fetchText(target);
assert(indexHtml.includes("CodeMoji"), "Missing CodeMoji marker in index.html");
assert(indexHtml.includes("src/app/main.js"), "Missing main.js script tag");
assert(indexHtml.includes("onboarding.css"), "Missing onboarding stylesheet link");
assert(/lang="he"/i.test(indexHtml), "Missing lang=he attribute");
assert(/dir="rtl"/i.test(indexHtml), "Missing dir=rtl attribute");
assert(/<meta\s+property="og:title"/i.test(indexHtml), "Missing og:title");

const manifestUrl = new URL("app.webmanifest", target).toString();
const manifest = JSON.parse(await fetchText(manifestUrl));
assert(manifest.start_url, "Manifest missing start_url");
assert(manifest.icons?.length, "Manifest missing icons");

const swUrl = new URL("service-worker.js", target).toString();
const sw = await fetchText(swUrl);
assert(sw.includes("codemoji-x-shell"), "service-worker.js missing cache marker");

const mainJsUrl = new URL("src/app/main.js", target).toString();
const mainJs = await fetchText(mainJsUrl);
assert(mainJs.includes("App"), "main.js does not reference App");

console.log(`smoke-live: PASS ${target}`);
