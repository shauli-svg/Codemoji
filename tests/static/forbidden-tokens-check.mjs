import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const forbidden = [
  "SecretMoji",
  "SM5:",
  "SM7",
  "encryptWithRandomCapsuleKey",
  "decrypt payload",
  "Decrypt payload",
  "payload error",
  "Invalid key",
  "decryption failed",
  "Decryption failed",
  "×§",
  "×¡",
  "×™",
  "ðŸ"
];

function walk(dir) {
  const files = [];
  for (const item of readdirSync(join(root, dir))) {
    const rel = join(dir, item);
    const abs = join(root, rel);
    if (statSync(abs).isDirectory()) files.push(...walk(rel));
    else if (/\.(js|html|css|md|json|webmanifest|yml)$/.test(item)) files.push(rel);
  }
  return files;
}

for (const file of [...walk("src"), ...walk("public"), "index.html", "README.md"]) {
  const text = readFileSync(join(root, file), "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) {
      console.error(`${file} contains forbidden token: ${token}`);
      process.exit(1);
    }
  }
}

console.log("forbidden-tokens-check: PASS");
