import { writeFileSync } from "node:fs";
const id = `cmx-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;
writeFileSync("BUILD_ID.txt", `${id}\n`, "utf8");
console.log(`BUILD_ID=${id}`);
