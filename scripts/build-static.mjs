import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
const items = [
  "index.html",
  "src",
  "public",
  "BUILD_ID.txt",
  "README.md",
  "docs",
  "service-worker.js",
  "app.webmanifest",
  ".nojekyll",
  "404.html"
];
for (const item of items) {
  try {
    cpSync(join(root, item), join(dist, item), { recursive: true });
  } catch (err) {
    if (err?.code !== "ENOENT") throw err;
  }
}
const buildId = readFileSync(join(root, "BUILD_ID.txt"), "utf8").trim();
const indexPath = join(dist, "index.html");
const html = readFileSync(indexPath, "utf8").replace("<title>CodeMoji</title>", `<title>CodeMoji</title>\n    <meta name="build-id" content="${buildId}" />`);
writeFileSync(indexPath, html, "utf8");
console.log("build-static: PASS dist/");
