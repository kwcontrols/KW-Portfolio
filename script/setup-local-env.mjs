import { randomBytes } from "node:crypto";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const examplePath = resolve(root, ".env.local.example");
const localPath = resolve(root, ".env.local");
const secretPlaceholder = "REPLACE_WITH_A_RANDOM_LOCAL_SECRET";

if (!existsSync(examplePath)) {
  console.error("Local environment template .env.local.example is missing.");
  process.exit(1);
}

const generateSecret = () => randomBytes(32).toString("hex");
const variableExists = (source, name) =>
  new RegExp(`^\\s*(?:export\\s+)?${name}\\s*=`, "m").test(source);

if (!existsSync(localPath)) {
  copyFileSync(examplePath, localPath, 0);
  const generated = readFileSync(localPath, "utf8").replace(
    secretPlaceholder,
    generateSecret(),
  );
  writeFileSync(localPath, generated, { encoding: "utf8", flag: "w" });
  console.log("Created .env.local from .env.local.example with a unique local session secret.");
} else {
  let local = readFileSync(localPath, "utf8");
  const additions = [];

  if (!variableExists(local, "STATISTICS_ACCESS_CODES")) {
    additions.push(
      'STATISTICS_ACCESS_CODES=\'[{"id":"owner","name":"Kui Wu","code":"REPLACE_WITH_OWNER_ACCESS_CODE","role":"owner"}]\'',
    );
  }
  if (!variableExists(local, "STATISTICS_SESSION_SECRET")) {
    additions.push(`STATISTICS_SESSION_SECRET=${generateSecret()}`);
  }

  if (additions.length) {
    const separator = local.endsWith("\n") ? "\n" : "\n\n";
    local += `${separator}# Local Private Portal authentication\n${additions.join("\n")}\n`;
    writeFileSync(localPath, local, { encoding: "utf8", flag: "w" });
    console.log(`Added missing Private Portal settings to .env.local (${additions.length} variable(s)).`);
  } else {
    console.log(".env.local already contains the required Private Portal variable names.");
  }
}

const configured = readFileSync(localPath, "utf8");
if (configured.includes("REPLACE_WITH_OWNER_ACCESS_CODE")) {
  console.warn(
    "Local owner login is not ready: replace REPLACE_WITH_OWNER_ACCESS_CODE in .env.local with the existing owner code, then restart the dev server.",
  );
}
