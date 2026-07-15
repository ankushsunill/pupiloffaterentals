const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const publicRoot = path.join(root, "public");

const assets = [
  ["media", "media"],
  ["vendor", "vendor"],
  ["app.js", "app.js"],
  ["final.css", "final.css"]
];

fs.mkdirSync(publicRoot, { recursive: true });

for (const [sourceName, destinationName] of assets) {
  const source = path.join(root, sourceName);
  const destination = path.join(publicRoot, destinationName);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing deployment asset: ${sourceName}`);
  }

  if (fs.statSync(source).isDirectory()) {
    fs.cpSync(source, destination, { recursive: true, force: true });
  } else {
    fs.copyFileSync(source, destination);
  }
}

console.log("Prepared public deployment assets.");
