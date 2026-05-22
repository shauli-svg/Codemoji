import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function walk(dir) {
  const files = [];
  for (const item of readdirSync(dir)) {
    if (["node_modules", "dist", ".git"].includes(item)) continue;
    const abs = join(dir, item);
    if (statSync(abs).isDirectory()) files.push(...walk(abs));
    else if (/\.(js|mjs)$/.test(item)) files.push(abs);
  }
  return files;
}

for (const file of walk(process.cwd())) {
  const res = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (res.status !== 0) process.exit(res.status ?? 1);
}
console.log("check-js-syntax: PASS");
