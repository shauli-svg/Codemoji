import { readFileSync } from "node:fs";

const sheet = readFileSync("src/features/share/ShareSheet.js", "utf8");

function fail(msg) {
  console.error("WHATSAPP-FIRST CHECK FAILED:");
  console.error(msg);
  process.exit(1);
}

const order = [];
const re = /data-channel:\s*"([^"]+)"|class:\s*"primary[^"]*",\s*\n[^}]*href:\s*links\.(\w+)/g;
let m;
while ((m = re.exec(sheet))) {
  if (m[1]) order.push(m[1]);
  if (m[2]) order.push(m[2]);
}

const waIndex = order.findIndex((c) => c === "whatsapp");
if (waIndex !== 0) {
  const ms = sheet.match(/links\.(whatsapp|telegram)/g) || [];
  if (ms[0] !== "links.whatsapp") {
    fail(`WhatsApp must be the first share link in ShareSheet. Order seen: ${ms.join(", ")}`);
  }
}

if (!sheet.includes('"primary primary-link"')) {
  fail("ShareSheet's WhatsApp button must use the primary-link styling.");
}

console.log("whatsapp-first-check: PASS");
