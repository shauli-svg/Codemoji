import { teaserTemplates } from "../../src/product/viralTeaser/teaserTemplates.js";
import { TeaserMood } from "../../src/product/viralTeaser/teaser.types.js";
import { readFileSync } from "node:fs";

function fail(msg) {
  console.error("TEASER-PRESENCE CHECK FAILED:");
  console.error(msg);
  process.exit(1);
}

if (teaserTemplates.length < 5) {
  fail(`Expected at least 5 teaser templates, found ${teaserTemplates.length}.`);
}

const moods = new Set(teaserTemplates.map((t) => t.mood));
if (!moods.has(TeaserMood.PLAYFUL) || !moods.has(TeaserMood.MYSTERIOUS)) {
  fail("Teaser pool must contain both playful and mysterious moods.");
}

for (const t of teaserTemplates) {
  if (!/\p{Extended_Pictographic}/u.test(t.body)) {
    fail(`Template "${t.id}" body must include at least one pictographic curiosity hook.`);
  }
  if (!/[\u05D0-\u05EA]/.test(t.body)) {
    fail(`Template "${t.id}" body must include Hebrew (the V1 audience is Hebrew-first).`);
  }
}

const sheet = readFileSync("src/features/share/ShareSheet.js", "utf8");
if (!sheet.includes("share-preview")) {
  fail("ShareSheet must render a visible share-preview block.");
}
if (!sheet.includes("buildSharePayload")) {
  fail("ShareSheet must compose its preview through buildSharePayload.");
}

console.log(`teaser-presence-check: PASS templates=${teaserTemplates.length} moods=${[...moods].join("|")}`);
