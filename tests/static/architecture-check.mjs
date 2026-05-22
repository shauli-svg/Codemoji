import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function fail(message) {
  console.error("ARCHITECTURE CHECK FAILED:");
  console.error(message);
  process.exit(1);
}

const requiredDirs = [
  "src/core/capsule",
  "src/core/crypto",
  "src/core/transport",
  "src/core/storage",
  "src/features/receive",
  "src/features/compose",
  "src/features/reveal",
  "src/features/share",
  "src/features/reply",
  "src/features/onboarding",
  "src/product/viralTeaser",
  "src/styles",
  "docs/ADR"
];

for (const dir of requiredDirs) {
  try {
    if (!statSync(join(root, dir)).isDirectory()) fail(`Missing required directory: ${dir}`);
  } catch {
    fail(`Missing required directory: ${dir}`);
  }
}

function listFiles(dir) {
  const full = join(root, dir);
  const out = [];
  for (const item of readdirSync(full)) {
    const abs = join(full, item);
    const rel = join(dir, item);
    if (statSync(abs).isDirectory()) out.push(...listFiles(rel));
    else if (/\.js$/.test(item)) out.push(rel);
  }
  return out;
}

const IMPORT_RE = /(?:import\s[^"']*from\s*|import\s*)["']([^"']+)["']/g;

function importsOf(body) {
  const out = [];
  let m;
  while ((m = IMPORT_RE.exec(body))) out.push(m[1]);
  return out;
}

const rules = [
  { path: "src/core/crypto", forbiddenImportFragments: ["features/", "styles/"], forbiddenTokens: ["preact", "React"] },
  { path: "src/core/capsule", forbiddenImportFragments: ["features/", "styles/"], forbiddenTokens: ["preact", "React"] },
  { path: "src/core/transport", forbiddenImportFragments: ["features/", "styles/", "core/crypto/patternKey"], forbiddenTokens: [] },
  { path: "src/core/storage", forbiddenImportFragments: ["features/", "styles/"], forbiddenTokens: [] },
  { path: "src/product", forbiddenImportFragments: ["features/", "styles/"], forbiddenTokens: ["preact", "React"] }
];

for (const rule of rules) {
  for (const file of listFiles(rule.path)) {
    const body = readFileSync(join(root, file), "utf8");
    const imports = importsOf(body);
    for (const spec of imports) {
      for (const frag of rule.forbiddenImportFragments) {
        if (spec.includes(frag)) fail(`${file} must not import ${spec} (forbidden fragment: ${frag})`);
      }
    }
    for (const token of rule.forbiddenTokens) {
      if (body.includes(token)) fail(`${file} must not reference ${token}`);
    }
  }
}

console.log("architecture-check: PASS");
