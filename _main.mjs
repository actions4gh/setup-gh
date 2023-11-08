import { spawn } from "node:child_process";
import { once } from "node:events";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";
const file = join(dirname(process.argv[1]), "main.ts"); // 👈 CHANGE ME!
const response = await fetch("https://deno.com/versions.json");
const json = await response.json();
const tag = json.cli.find((x) => x.startsWith("v1."));
const version = tag.slice(1);
const DENO_INSTALL = join(
  process.env.RUNNER_TOOL_CACHE,
  "deno",
  version,
  process.arch,
);
if (!existsSync(DENO_INSTALL)) {
  const subprocess1 = spawn(
    `curl -fsSL https://deno.land/x/install/install.sh | sh -s "$tag"`,
    { shell: "bash", env: { ...process.env, DENO_INSTALL, tag } },
  );
  await once(subprocess1, "exit");
}
const subprocess2 = spawn(
  join(DENO_INSTALL, "bin", "deno"),
  ["run", "-Aq", file],
  { stdio: "inherit" },
);
await once(subprocess2, "spawn");
subprocess2.on("exit", (x) => process.exit(x));
