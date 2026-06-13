import { readFileSync } from "node:fs";

function fail(message) {
  console.error("copy-hebrew-contract-check: FAIL");
  console.error(message);
  process.exit(1);
}

const files = [
  "index.html",
  "src/product/copy.js",
  "src/features/onboarding/onboardingCopy.js",
  "src/features/compose/ComposeScreen.js",
  "src/features/receive/ReceiveScreen.js",
  "src/features/reveal/PatternGrid.js",
  "src/features/share/ShareSheet.js",
  "src/features/reply/ReplyPrompt.js",
  "src/product/viralTeaser/teaserTemplates.js",
  "src/product/viralTeaser/teaserGenerator.js"
];

const forbidden = [
  ["draw_verb", "\u05E6\u05D9\u05D9\u05E8"],
  ["drawing_noun", "\u05E6\u05D9\u05D5\u05E8"],
  ["discover_old", "\u05D2\u05DC\u05D4"],
  ["ready_to_road", "\u05DE\u05D5\u05DB\u05DF \u05DC\u05D3\u05E8\u05DA"],
  ["touch_draw_discover_comma", "\u05D2\u05E2, \u05E6\u05D9\u05D9\u05E8, \u05D2\u05DC\u05D4"],
  ["touch_draw_discover_slash", "\u05D2\u05E2 / \u05E6\u05D9\u05D9\u05E8 / \u05D2\u05DC\u05D4"],
  ["draw_on_sign", "\u05E6\u05D9\u05D9\u05E8 \u05E2\u05DC\u05D9\u05D5 \u05D0\u05EA \u05D4\u05E1\u05D9\u05DE\u05DF"],
  ["sign_old", "\u05D4\u05E1\u05D9\u05DE\u05DF"]
];

const required = [
  ["opening_code", "\u05E7\u05D5\u05D3 \u05E4\u05EA\u05D9\u05D7\u05D4"],
  ["swipe", "\u05D4\u05D7\u05DC\u05D9\u05E7\u05D5"],
  ["lock_plural", "\u05E0\u05E2\u05DC\u05D5"],
  ["open_plural", "\u05E4\u05EA\u05D7\u05D5"],
  ["whatsapp", "\u05E9\u05DC\u05D7\u05D5 \u05D1\u05D5\u05D5\u05D0\u05D8\u05E1\u05D0\u05E4"],
  ["copy_link", "\u05D4\u05E2\u05EA\u05D9\u05E7\u05D5 \u05E7\u05D9\u05E9\u05D5\u05E8"]
];

const combined = files.map((file) => file + "\n" + readFileSync(file, "utf8")).join("\n---\n");

for (const [label, term] of forbidden) {
  if (combined.includes(term)) fail("Forbidden Hebrew UI term remains: " + label);
}

for (const [label, term] of required) {
  if (!combined.includes(term)) fail("Required Hebrew UI term missing: " + label);
}

console.log("copy-hebrew-contract-check: PASS");
