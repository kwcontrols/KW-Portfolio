import { readFile, writeFile } from "node:fs/promises";

const configPath = new URL("../dist/server/wrangler.json", import.meta.url);
const config = JSON.parse(await readFile(configPath, "utf8"));

config.name = "kuiwu";
config.kv_namespaces = [
  {
    binding: "KW_STATISTICS_GUESTS",
    id: "c776988d563c4d2ab786dca5fa034ba9",
  },
];

await writeFile(configPath, `${JSON.stringify(config)}\n`, "utf8");
console.log(
  "Prepared Cloudflare config for Worker 'kuiwu' with KW_STATISTICS_GUESTS binding.",
);
