const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { pathToFileURL } = require("node:url");

async function main() {
  const target = path.resolve(
    ".vercel/output/functions/__server.func"
  );

  const source = path.resolve("node_modules/tslib");

  const destination = path.join(
    target, "node_modules", "tslib"
  );

  if (!fs.existsSync(target)) {
    throw new Error("Vercel server function not found");
  }

  if (!fs.existsSync(path.join(source, "package.json"))) {
    throw new Error("tslib is not installed");
  }

  fs.rmSync(destination, {
    recursive: true,
    force: true
  });

  fs.mkdirSync(destination, { recursive: true });

  fs.cpSync(source, destination, {
    recursive: true,
    dereference: true
  });

  const temp = fs.mkdtempSync(
    path.join(os.tmpdir(), "vp-vercel-")
  );

  try {
    fs.cpSync(target, temp, {
      recursive: true,
      dereference: true
    });

    const importer = path.join(
      temp, "_libs", "supabase__functions-js.mjs"
    );

    if (!fs.existsSync(importer)) {
      throw new Error("Supabase runtime module not found");
    }

    await import(pathToFileURL(importer).href);

    console.log(
      "PASS: Isolated Supabase runtime dependency test"
    );
    console.log(
      "PASS: Vercel tslib packaging completed"
    );
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
