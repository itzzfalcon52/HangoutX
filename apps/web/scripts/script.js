import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "public/avatars");

const result = {};

const characters = fs.readdirSync(ROOT);

for (const char of characters) {
  const folder = path.join(ROOT, char);
  if (!fs.statSync(folder).isDirectory()) continue;

  result[char] = {};

  const files = fs.readdirSync(folder);

  for (const file of files) {
    if (!file.endsWith(".png")) continue;

    // character_femaleAdventurer_walk7.png
    const match = file.match(/character_(.+?)_(.+?)(\d*)\.png/);
    if (!match) continue;

    const action = match[2]; // walk, idle, attack

    if (!result[char][action]) result[char][action] = [];

    result[char][action].push(`/avatars/${char}/${file}`);
  }

  // sort frames
  for (const action in result[char]) {
    result[char][action].sort();
  }
}

fs.writeFileSync(
  path.join(ROOT, "avatars.json"),
  JSON.stringify(result, null, 2)
);

console.log("✅ avatars.json generated");
