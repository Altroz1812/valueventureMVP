const fs = require("node:fs");
const path = require("node:path");

const target = path.resolve(
  ".vercel/output/functions/__server.func"
);

if (!fs.existsSync(target)) {
  console.log("Non-Vercel build: skipping tslib packaging");
  process.exit(0);
}

const source = path.resolve("node_modules/tslib");
const destination = path.join(
  target, "node_modules", "tslib"
);

if (!fs.existsSync(path.join(source, "package.json"))) {
  throw new Error("tslib dependency is missing");
}

fs.mkdirSync(destination, { recursive: true });

fs.cpSync(source, destination, {
  recursive: true,
  dereference: true
});

console.log("Vercel tslib packaging completed");
