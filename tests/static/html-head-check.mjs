import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");

function fail(msg) {
  console.error("HTML-HEAD CHECK FAILED:");
  console.error(msg);
  process.exit(1);
}

const required = [
  /<meta\s+charset=/i,
  /<meta\s+name="viewport"[^>]+width=device-width/i,
  /<meta\s+name="theme-color"/i,
  /<meta\s+name="description"/i,
  /<meta\s+property="og:title"/i,
  /<meta\s+property="og:description"/i,
  /<link\s+rel="manifest"\s+href="\.\/app\.webmanifest"/i,
  /<link\s+rel="icon"/i,
  /<title>[^<]+<\/title>/i
];

for (const re of required) {
  if (!re.test(html)) fail(`Missing required head tag matching ${re}`);
}

if (!/dir="rtl"/i.test(html) || !/lang="he"/i.test(html)) {
  fail("HTML must declare lang=he and dir=rtl for the Hebrew audience.");
}

if (!/onboarding\.css/.test(html)) {
  fail("index.html must include the onboarding stylesheet.");
}

console.log("html-head-check: PASS");
