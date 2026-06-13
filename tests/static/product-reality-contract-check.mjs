import { readFileSync } from "node:fs";

function fail(msg) {
  console.error("PRODUCT REALITY CHECK FAILED:");
  console.error(msg);
  process.exit(1);
}

const compose = readFileSync("src/features/compose/ComposeScreen.js", "utf8");
const receive = readFileSync("src/features/receive/ReceiveScreen.js", "utf8");
const share = readFileSync("src/features/share/ShareSheet.js", "utf8");

for (const [name, text, tokens] of [
  ["compose", compose, ["encryptWithPattern", "PatternGrid", "onReady", "primary"]],
  ["receive", receive, ["parseCapsule", "decryptWithPattern", "ReplyPrompt", "PatternGrid"]],
  ["share", share, ["links.whatsapp", "shareNativeOrCopy", "copyToClipboard", "manual-link"]]
]) {
  for (const token of tokens) {
    if (!text.includes(token)) fail(name + " missing product loop token: " + token);
  }
}

console.log("product-reality-contract-check: PASS");
