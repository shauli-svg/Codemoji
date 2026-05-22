import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir) {
  const files = [];
  for (const item of readdirSync(dir)) {
    if (["node_modules", "dist", ".git"].includes(item)) continue;
    const abs = join(dir, item);
    if (statSync(abs).isDirectory()) files.push(...walk(abs));
    else if (/\.(js|mjs|html|css|md|json|webmanifest|yml)$/.test(item)) files.push(abs);
  }
  return files;
}

let failed = false;
for (const file of walk(process.cwd())) {
  const text = readFileSync(file, "utf8");
  if (text.includes("\u0000")) {
    console.error(`NUL byte in ${file}`);
    failed = true;
  }
  if (/console\.log\([^`'"]*secret/i.test(text)) {
    console.error(`Possible secret logging in ${file}`);
    failed = true;
  }
  if (/plainText\s*[:=]\s*['\"]/.test(text) && !file.includes("tests") && !file.includes("cryptoEngine")) {
    console.error(`Suspicious plaintext literal in ${file}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log("lint-basic: PASS");
