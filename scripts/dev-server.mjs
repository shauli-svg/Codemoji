import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
const port = Number(args.get("--port") || process.env.PORT || 5173);
const root = normalize(join(process.cwd(), args.get("--root") || "."));

const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"]
]);

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = decoded === "/" ? "/index.html" : decoded;
  const full = normalize(join(root, clean));
  if (!full.startsWith(root)) return null;
  return full;
}

const server = createServer((req, res) => {
  const file = safePath(req.url || "/");
  if (!file || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": types.get(extname(file)) || "application/octet-stream" });
  createReadStream(file).pipe(res);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`CodeMoji X dev server: http://127.0.0.1:${port}`);
});
