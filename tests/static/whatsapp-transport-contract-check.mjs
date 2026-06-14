import { readFileSync } from "node:fs";

function fail(message) {
  console.error("whatsapp-transport-contract-check: FAIL");
  console.error(message);
  process.exit(1);
}

function rx(parts, flags = "u") {
  return new RegExp(parts.join(""), flags);
}

const scanFiles = [
  "src/core/transport/whatsapp.js",
  "src/core/transport/shareText.js",
  "src/core/transport/shareService.js",
  "tests/unit/transport.test.mjs",
  "tests/unit/shareService.test.mjs",
  "tests/e2e/viral-share-flow.test.mjs",
  "tests/static/whatsapp-first-check.mjs",
  "docs/STAGE_B_WHATSAPP_TRANSPORT_CONTRACT.md",
  "docs/VIRAL_LOOP.md",
  "docs/STAGE_A_HEBREW_COPY_ONLY.md"
];

const oldSlogan = "\u05d2\u05e2, \u05e6\u05d9\u05d9\u05e8, \u05d2\u05dc\u05d4";
const oldSign = "\u05e6\u05d9\u05d9\u05e8 \u05e2\u05dc\u05d9\u05d5 \u05d0\u05ea \u05d4\u05e1\u05d9\u05de\u05df";

const forbidden = [
  ["runtime_bad_char", /\uFFFD/u],
  ["legacy_property_contract", rx(["Extended", "_", "Pictographic"])],
  ["legacy_emoji_contract", rx(["emoji", " ", "teaser", "|", "pictographic", " ", "curiosity"])],
  ["legacy_drawing_copy", rx([oldSlogan, "|", oldSign])]
];

for (const file of scanFiles) {
  const text = readFileSync(file, "utf8");
  for (const [label, pattern] of forbidden) {
    if (pattern.test(text)) {
      fail(label + " remains in " + file);
    }
  }
}

const whatsapp = readFileSync("src/core/transport/whatsapp.js", "utf8");
if (!whatsapp.includes("cleanWhatsappText")) fail("whatsapp.js must sanitize WhatsApp text.");
if (!whatsapp.includes("encodeURIComponent(text)")) fail("whatsapp.js must encode sanitized text.");
if (!whatsapp.includes("https://wa.me/?text=")) fail("whatsapp.js must keep direct WhatsApp share URL.");

console.log("whatsapp-transport-contract-check: PASS");
