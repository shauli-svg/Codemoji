import { readFileSync, existsSync } from "node:fs";

function fail(msg) {
  console.error("DESIGN GATE CHECK FAILED:");
  console.error(msg);
  process.exit(1);
}

const requiredDocs = [
  "docs/NEXT_STAGE_RITUAL_UI_SOURCE_OF_TRUTH.md",
  "docs/DESIGN_GATE_BINDING.md",
  "docs/SECURITY_CI_DEEP_CHECKS.md"
];

for (const doc of requiredDocs) {
  if (!existsSync(doc)) fail("Missing required design/security doc: " + doc);
}

const stage = readFileSync("docs/NEXT_STAGE_RITUAL_UI_SOURCE_OF_TRUTH.md", "utf8");
for (const token of ["RITUAL_UI_SECURITY_CI", "Design contract", "Motion contract", "Security contract", "CI contract"]) {
  if (!stage.includes(token)) fail("Stage Source of Truth missing token: " + token);
}

const binding = readFileSync("docs/DESIGN_GATE_BINDING.md", "utf8");
for (const gate of ["DESIGN_CONTRACT_GATE", "MOTION_CONTRACT_GATE", "PRODUCT_REALITY_GATE", "VISUAL_REALITY_GATE", "NO_FAKE_PASS_GATE"]) {
  if (!binding.includes(gate)) fail("Design binding missing gate: " + gate);
}

const index = readFileSync("index.html", "utf8");
if (!index.includes("src/styles/ritual.css")) fail("index.html must include ritual.css");

const ritualCss = readFileSync("src/styles/ritual.css", "utf8");
if (!ritualCss.includes("prefers-reduced-motion")) fail("ritual.css must include reduced-motion fallback");
if (!ritualCss.includes("focus-visible")) fail("ritual.css must include focus-visible states");

console.log("design-gate-binding-check: PASS");
