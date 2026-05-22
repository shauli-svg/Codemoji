import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function fail(msg) {
  console.error("A11Y CHECK FAILED:");
  console.error(msg);
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const item of readdirSync(join(root, dir))) {
    const rel = join(dir, item);
    const abs = join(root, rel);
    if (statSync(abs).isDirectory()) out.push(...walk(rel));
    else if (item.endsWith(".js")) out.push(rel);
  }
  return out;
}

const BUTTON_RE = /el\(\s*"button"\s*,\s*\{([^}]*)\}/g;

for (const file of walk("src/features")) {
  const text = readFileSync(join(root, file), "utf8");
  let m;
  while ((m = BUTTON_RE.exec(text))) {
    const attrs = m[1];
    const hasLabel =
      /text\s*:/.test(attrs) ||
      /"aria-label"\s*:/.test(attrs) ||
      /aria-label\s*:/.test(attrs);
    if (!hasLabel) {
      fail(`Button without text or aria-label in ${file}: ${m[0].slice(0, 80)}…`);
    }
  }
}

console.log("a11y-check: PASS");
