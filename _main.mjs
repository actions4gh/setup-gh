import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { once } from "node:events";
const file = join(dirname(process.argv[1]), "main.ts"); // 👈 CHANGE ME!
const subprocess = spawn(`exec "$__FILE"`, {
  shell: "bash",
  stdio: "inherit",
  env: { ...process.env, __FILE: file },
});
await once(subprocess, "spawn");
subprocess.on("exit", (x) => process.exit(x));
