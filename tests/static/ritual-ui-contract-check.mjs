import { readFileSync } from "node:fs";

function fail(msg) {
  console.error("RITUAL UI CONTRACT CHECK FAILED:");
  console.error(msg);
  process.exit(1);
}

const patternGrid = readFileSync("src/features/reveal/PatternGrid.js", "utf8");
for (const token of ["pattern-lines", "pattern-line-path", "aria-pressed", "pattern-ready", "pointsToLine"]) {
  if (!patternGrid.includes(token)) fail("PatternGrid missing ritual feedback token: " + token);
}

const secretBubble = readFileSync("src/features/reveal/SecretBubble.js", "utf8");
for (const token of ["aria-live", "data-state", "הסוד נפתח", "סוד נעול"]) {
  if (!secretBubble.includes(token)) fail("SecretBubble missing reveal/accessibility token: " + token);
}

const compose = readFileSync("src/features/compose/ComposeScreen.js", "utf8");
for (const token of ["ritual-stage", "ritual-step", "char-counter", "updateReadyState"]) {
  if (!compose.includes(token)) fail("ComposeScreen missing ritual token: " + token);
}

const receive = readFileSync("src/features/receive/ReceiveScreen.js", "utf8");
if (!receive.includes("resetAction")) fail("ReceiveScreen must reset unlock action after wrong sign");

console.log("ritual-ui-contract-check: PASS");
