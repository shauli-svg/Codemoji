import { spawnSync } from "node:child_process";

const commands = [
  ["npm", ["run", "lint"]],
  ["npm", ["run", "typecheck"]],
  ["npm", ["run", "test:unit"]],
  ["npm", ["run", "test:static"]],
  ["npm", ["run", "build"]],
  ["npm", ["run", "test:e2e"]]
];

const results = [];
for (const [cmd, args] of commands) {
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  results.push({ command: cmd + " " + args.join(" "), ok: res.status === 0, status: res.status });
  if (res.status !== 0) {
    console.error(JSON.stringify({ ok: false, failed: results.at(-1), results }, null, 2));
    process.exit(res.status ?? 1);
  }
}

console.log(JSON.stringify({ ok: true, gate: "CODEMOJI_DEEP_CI", results }, null, 2));
