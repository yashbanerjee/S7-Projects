import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "src/routes");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts"));

for (const f of files) {
  const full = path.join(dir, f);
  let s = fs.readFileSync(full, "utf8");
  if (!s.includes("req.params.")) continue;

  if (!s.includes('from "../lib/params.js"')) {
    // insert after first import block line
    const lines = s.split("\n");
    let insertAt = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) insertAt = i + 1;
      else if (insertAt > 0 && !lines[i].startsWith("import ")) break;
    }
    lines.splice(insertAt, 0, 'import { param } from "../lib/params.js";');
    s = lines.join("\n");
  }

  s = s.replace(/req\.params\.([a-zA-Z_]+)/g, 'param(req, "$1")');
  fs.writeFileSync(full, s);
  console.log("patched", f);
}
