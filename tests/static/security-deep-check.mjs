import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function fail(msg) {
  console.error("SECURITY DEEP CHECK FAILED:");
  console.error(msg);
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const item of readdirSync(join(root, dir))) {
    if (["node_modules", ".git", "dist", ".stage-backups"].includes(item)) continue;
    const rel = join(dir, item);
    const abs = join(root, rel);
    if (statSync(abs).isDirectory()) out.push(...walk(rel));
    else if (/\.(js|mjs|html|css|md|json|webmanifest|yml)$/i.test(item)) out.push(rel);
  }
  return out;
}

for (const doc of ["docs/SECURITY_MODEL.md", "docs/SECURITY_DISCLOSURE.md", "docs/SECURITY_CI_DEEP_CHECKS.md"]) {
  if (!existsSync(doc)) fail("Missing security doc: " + doc);
}

const index = readFileSync("index.html", "utf8");
if (/<script(?![^>]+type=["']module["'][^>]+src=["']\.\/src\/app\/main\.js["'])/i.test(index)) {
  fail("index.html may only load the local module app entry script");
}
if (/https?:\/\//i.test(index)) fail("index.html must not load third-party URLs");

const sensitiveName = /(secret|message|plaintext|plainText|cipher|capsule|pattern)/i;
for (const file of walk("src")) {
  const text = readFileSync(join(root, file), "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, idx) => {
    if (/console\.(log|debug|info|warn|error)\s*\(/.test(line) && sensitiveName.test(line)) {
      fail(file + ":" + (idx + 1) + " logs a sensitive-looking value");
    }
    if (/localStorage\.setItem\s*\(/.test(line) && sensitiveName.test(line)) {
      fail(file + ":" + (idx + 1) + " stores a sensitive-looking value in localStorage");
    }
  });
}

const copy = readFileSync("src/product/copy.js", "utf8");
for (const forbidden of ["decrypt", "encrypt", "cipher", "payload", "AES", "PBKDF2", "capsule"]) {
  if (copy.toLowerCase().includes(forbidden.toLowerCase())) {
    fail("User copy must not expose technical term: " + forbidden);
  }
}

console.log("security-deep-check: PASS");
