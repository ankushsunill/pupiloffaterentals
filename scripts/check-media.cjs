const fs = require("fs");
const path = require("path");

const mediaRoot = path.resolve(__dirname, "..", "media");
const megabyte = 1024 * 1024;
const limits = {
  "huraccan.webm": 15 * megabyte,
  "porsche.mp4": 10 * megabyte,
  "purosangue.mp4": 7 * megabyte
};
const totalLimit = 55 * megabyte;

const files = fs.readdirSync(mediaRoot, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => ({ name: entry.name, size: fs.statSync(path.join(mediaRoot, entry.name)).size }));

const failures = [];
for (const file of files) {
  const limit = limits[file.name];
  if (limit && file.size > limit) {
    failures.push(`${file.name} is ${(file.size / megabyte).toFixed(2)} MB; limit is ${(limit / megabyte).toFixed(0)} MB`);
  }
}

const total = files.reduce((sum, file) => sum + file.size, 0);
if (total > totalLimit) {
  failures.push(`media directory is ${(total / megabyte).toFixed(2)} MB; limit is ${(totalLimit / megabyte).toFixed(0)} MB`);
}

if (failures.length) {
  console.error(`Media budget failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Media budget passed: ${(total / megabyte).toFixed(2)} MB total.`);
