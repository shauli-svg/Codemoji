import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const target = existsSync(join(root, "dist")) ? join(root, "dist") : root;
const MAX_JS_KB = 180;
const MAX_CSS_KB = 80;

function walk(dir) {
  const out = [];
  for (const item of readdirSync(dir)) {
    if (["node_modules", ".git"].includes(item)) continue;
    const abs = join(dir, item);
    if (statSync(abs).isDirectory()) out.push(...walk(abs));
    else out.push(abs);
  }
  return out;
}

function kb(bytes) {
  return Math.round(bytes / 1024);
}

let js = 0;
let css = 0;
for (const file of walk(target)) {
  const size = statSync(file).size;
  if (file.endsWith(".js")) js += size;
  if (file.endsWith(".css")) css += size;
}

if (kb(js) > MAX_JS_KB) {
  console.error(`JS budget exceeded: ${kb(js)}KB > ${MAX_JS_KB}KB`);
  process.exit(1);
}
if (kb(css) > MAX_CSS_KB) {
  console.error(`CSS budget exceeded: ${kb(css)}KB > ${MAX_CSS_KB}KB`);
  process.exit(1);
}
console.log(`bundle-budget: PASS js=${kb(js)}KB css=${kb(css)}KB`);
