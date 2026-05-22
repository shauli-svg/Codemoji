/**
 * Block recent-Unicode emojis (Emoji 13.0+) in user-visible strings.
 *
 * Recipients on older Android/iOS or stale WhatsApp Desktop render
 * unsupported codepoints as U+FFFD ("diamond with question mark").
 * The viral loop depends on the recipient SEEING the curiosity hook,
 * so we hard-fail any reintroduction of a known-fragile emoji.
 */

import { readFileSync } from "node:fs";
import { teaserTemplates } from "../../src/product/viralTeaser/teaserTemplates.js";

function fail(msg) {
  console.error("FORBIDDEN-EMOJIS CHECK FAILED:");
  console.error(msg);
  process.exit(1);
}

// Codepoint, name, first Emoji version it appeared in.
const FORBIDDEN = [
  { cp: 0x1FAE7, name: "BUBBLE",            since: "Emoji 14.0" },
  { cp: 0x1FAA9, name: "DISCO BALL",        since: "Emoji 13.0" },
  { cp: 0x1FA84, name: "MAGIC WAND",        since: "Emoji 13.0" },
  { cp: 0x1FA9E, name: "MIRROR",            since: "Emoji 13.0" },
  { cp: 0x1FA9F, name: "WINDOW",            since: "Emoji 13.0" },
  { cp: 0x1FA9C, name: "LADDER",            since: "Emoji 13.0" },
  { cp: 0x1FAE0, name: "MELTING FACE",      since: "Emoji 14.0" },
  { cp: 0x1FAE1, name: "SALUTING FACE",     since: "Emoji 14.0" },
  { cp: 0x1FAE2, name: "FACE WITH OPEN EYES AND HAND OVER MOUTH", since: "Emoji 14.0" },
  { cp: 0x1FAE3, name: "FACE WITH PEEKING EYE", since: "Emoji 14.0" },
  { cp: 0x1FAE4, name: "FACE WITH DIAGONAL MOUTH", since: "Emoji 14.0" },
  { cp: 0x1FAE5, name: "DOTTED LINE FACE",  since: "Emoji 14.0" },
  { cp: 0x1FAE6, name: "BITING LIP",        since: "Emoji 14.0" },
  { cp: 0x1FA77, name: "PINK HEART",        since: "Emoji 15.0" },
  { cp: 0x1FA75, name: "LIGHT BLUE HEART",  since: "Emoji 15.0" },
  { cp: 0x1FA76, name: "GREY HEART",        since: "Emoji 15.0" }
];

function containsForbidden(text) {
  const hits = [];
  for (const f of FORBIDDEN) {
    if (text.includes(String.fromCodePoint(f.cp))) hits.push(f);
  }
  return hits;
}

// Pass 1: structured check on the template registry itself.
for (const t of teaserTemplates) {
  const where = [`emoji:${t.emoji}`, `body:${t.body.replace(/\n/g, "\\n")}`].join(" / ");
  const hits = [...containsForbidden(t.emoji), ...containsForbidden(t.body)];
  if (hits.length) {
    const names = hits.map((h) => `${h.name} (${h.since}) U+${h.cp.toString(16).toUpperCase()}`).join(", ");
    fail(`Template "${t.id}" contains forbidden emoji(s): ${names}\n  ${where}`);
  }
}

// Pass 2: scan copy.js for stringly-typed user copy (text after a ":" inside an object).
const copyFile = readFileSync("src/product/copy.js", "utf8");
const stringLiterals = copyFile.match(/"(?:[^"\\]|\\.)*"/g) || [];
for (const lit of stringLiterals) {
  const hits = containsForbidden(lit);
  if (hits.length) {
    const names = hits.map((h) => `${h.name} (${h.since})`).join(", ");
    fail(`src/product/copy.js literal ${lit} contains forbidden emoji(s): ${names}`);
  }
}

// Pass 3: scan onboarding copy.
const onboardingCopyFile = readFileSync("src/features/onboarding/onboardingCopy.js", "utf8");
const onbStrings = onboardingCopyFile.match(/"(?:[^"\\]|\\.)*"/g) || [];
for (const lit of onbStrings) {
  const hits = containsForbidden(lit);
  if (hits.length) {
    const names = hits.map((h) => `${h.name} (${h.since})`).join(", ");
    fail(`src/features/onboarding/onboardingCopy.js literal ${lit} contains forbidden emoji(s): ${names}`);
  }
}

console.log(`forbidden-emojis-check: PASS scanned ${teaserTemplates.length} templates + copy + onboardingCopy`);
