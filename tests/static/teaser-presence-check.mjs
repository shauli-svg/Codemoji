import { teaserTemplates } from "../../src/product/viralTeaser/teaserTemplates.js";
import { TeaserMood } from "../../src/product/viralTeaser/teaser.types.js";
import { readFileSync } from "node:fs";

function fail(msg) {
  console.error("TEASER-PRESENCE CHECK FAILED:");
  console.error(msg);
  process.exit(1);
}

const oldTerms = new RegExp(["\\u05E6\\u05D9\\u05D9\\u05E8", "\\u05E6\\u05D9\\u05D5\\u05E8", "\\u05D2\\u05DC\\u05D4", "\\u05DE\\u05D5\\u05DB\\u05DF \\u05DC\\u05D3\\u05E8\\u05DA", "\\u05D2\\u05E2, \\u05E6\\u05D9\\u05D9\\u05E8, \\u05D2\\u05DC\\u05D4", "\\u05E6\\u05D9\\u05D9\\u05E8 \\u05E2\\u05DC\\u05D9\\u05D5 \\u05D0\\u05EA \\u05D4\\u05E1\\u05D9\\u05DE\\u05DF"].join("|"), "u");
const matureHook = new RegExp(["\\u05E7\\u05D5\\u05D3 \\u05E4\\u05EA\\u05D9\\u05D7\\u05D4", "\\u05E7\\u05D5\\u05D3", "\\u05E1\\u05D5\\u05D3", "\\u05E4\\u05E8\\u05D8\\u05D9", "\\u05E0\\u05E2\\u05D5\\u05DC", "\\u05D4\\u05D7\\u05DC\\u05D9\\u05E7\\u05D5", "\\u05E4\\u05EA\\u05D7\\u05D5"].join("|"), "u");

if (teaserTemplates.length < 5) fail(`Expected at least 5 teaser templates, found ${teaserTemplates.length}.`);
const moods = new Set(teaserTemplates.map((t) => t.mood));
if (!moods.has(TeaserMood.PLAYFUL) || !moods.has(TeaserMood.MYSTERIOUS)) fail("Teaser pool must contain both playful and mysterious moods.");

for (const t of teaserTemplates) {
  if (!/[\u05D0-\u05EA]/u.test(t.body)) fail(`Template "${t.id}" must include Hebrew.`);
  if (!matureHook.test(t.body)) fail(`Template "${t.id}" must include a mature secret/code hook.`);
  if (oldTerms.test(t.body + t.emoji)) fail(`Template "${t.id}" contains old drawing/discovery language.`);
  if (t.body.length > 140) fail(`Template "${t.id}" is too long for mobile sharing.`);
}

const sheet = readFileSync("src/features/share/ShareSheet.js", "utf8");
if (!sheet.includes("share-preview")) fail("ShareSheet must render a visible share-preview block.");
if (!sheet.includes("buildSharePayload")) fail("ShareSheet must compose its preview through buildSharePayload.");
console.log(`teaser-presence-check: PASS templates=${teaserTemplates.length} moods=${[...moods].join("|")}`);
