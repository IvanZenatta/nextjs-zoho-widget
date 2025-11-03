// test commit
// scripts/zet-sanitize.js
import fs from "fs";
import path from "path";

const dest = path.resolve("crm", "app");
const htmlFiles = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = fs.lstatSync(p);
    if (s.isDirectory()) walk(p);
    else if (name.endsWith(".html")) htmlFiles.push(p);
  }
}

walk(dest);

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, "utf8");
  // rewrite src="/..." -> src="./..."
  html = html.replace(/\ssrc="\//g, ' src="./');
  // rewrite href="/..." -> href="./..." (be careful if you use absolute links intentionally)
  html = html.replace(/\shref="\//g, ' href="./');
  fs.writeFileSync(file, html);
}
console.log(`✅ Rewrote absolute src/href to relative in ${htmlFiles.length} HTML files.`);

// remove a file or folder recursively if it exists
function rmrf(p) {
  if (!fs.existsSync(p)) return;
  const stat = fs.lstatSync(p);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(p)) rmrf(path.join(p, name));
    fs.rmSync(p, { recursive: true, force: true });
  } else {
    fs.unlinkSync(p);
  }
}

function removeIfMatches(dir, regexes) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    for (const re of regexes) {
      if (re.test(name)) {
        rmrf(path.join(dir, name));
        console.log(`🗑️ Removed ${path.join(dir, name)}`);
        break;
      }
    }
  }
}

(function run() {
  if (!fs.existsSync(dest)) {
    console.warn(`⚠️ Destination folder not found: ${dest}`);
    return;
  }

  // Match any folder/file starting with "__next" and containing "not-found"
  const items = fs.readdirSync(dest);
  for (const name of items) {
    const lower = name.toLowerCase();
    if (lower.includes("_not-found") || lower.includes("favicon")) {
      const target = path.join(dest, name);
      rmrf(target);
      console.log(`🗑️ Removed problematic file: ${name}`);
    }
  }

  const mediaDir = path.join(dest, "_next", "static", "media");
  removeIfMatches(mediaDir, [/^favicon.*\.ico$/i]);

  console.log("✅ ZET sanitize complete. Ready for packing!");
})();