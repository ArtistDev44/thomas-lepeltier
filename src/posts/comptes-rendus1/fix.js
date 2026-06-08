import fs from "fs";
import path from "path";

const CONTENT_DIR = "./"; // change if needed

function walk(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith(".md") || filePath.endsWith(".njk")) {
      results.push(filePath);
    }
  }
  return results;
}

function fixFrontmatter(content) {
  if (!content.startsWith("---")) return { content, changed: false };

  const end = content.indexOf("\n---", 3);
  if (end === -1) return { content, changed: false };

  const fmRaw = content.slice(3, end).trim();
  const body = content.slice(end + 4);

  let lines = fmRaw.split("\n");

  let hasDescription = false;
  let hasTags = false;

  for (let line of lines) {
    if (line.startsWith("description:")) hasDescription = true;
    if (line.startsWith("tags:")) hasTags = true;
  }

  let changed = false;

  if (!hasDescription) {
    lines.push(`description: ""`);
    changed = true;
  }

  if (!hasTags) {
    lines.push(`tags: ["posts"]`);
    changed = true;
  }

  if (!changed) return { content, changed: false };

  const newFM = `---\n${lines.join("\n")}\n---`;
  return {
    content: newFM + body,
    changed: true,
  };
}

const files = walk(CONTENT_DIR);

let fixed = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf-8");
  const { content, changed } = fixFrontmatter(raw);

  if (changed) {
    fs.writeFileSync(file, content);
    fixed++;
  }
}

console.log(`✅ Fixed ${fixed} files out of ${files.length}`);
