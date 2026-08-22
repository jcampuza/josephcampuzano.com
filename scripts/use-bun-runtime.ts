import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BUN_RUNTIME = "bun1.x";
const functionsDir = join(import.meta.dir, "../.vercel/output/functions");

export const useBunRuntime = async (dir = functionsDir) => {
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return 0;
    }

    throw error;
  }

  let patched = 0;

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (!entry.isDirectory()) {
      continue;
    }

    if (entry.name.endsWith(".func")) {
      const configPath = join(path, ".vc-config.json");
      const config = JSON.parse(await readFile(configPath, "utf8")) as {
        runtime?: string;
      };

      if (typeof config.runtime === "string" && config.runtime.startsWith("nodejs")) {
        config.runtime = BUN_RUNTIME;
        await writeFile(configPath, `${JSON.stringify(config, null, "\t")}\n`);
        patched += 1;
      }

      continue;
    }

    patched += await useBunRuntime(path);
  }

  return patched;
};

if (import.meta.main) {
  const patched = await useBunRuntime();
  console.log(`Set ${patched} Vercel function(s) to ${BUN_RUNTIME}.`);
}
