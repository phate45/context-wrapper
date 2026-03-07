/**
 * Postinstall patch: make execute/batch_execute use projectRoot as cwd.
 *
 * context-mode's PolyglotExecutor spawns processes in a tmpDir by default.
 * This patch changes the spawn cwd to #projectRoot (set via CLAUDE_PROJECT_DIR)
 * so commands run in the actual project directory.
 *
 * Targets the minified bundle where:
 *   #t = projectRoot, #s = #spawn, #i = #compileAndRun, s = tmpDir local var
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkgDir = dirname(require.resolve("context-mode/package.json"));
const bundlePath = resolve(pkgDir, "server.bundle.mjs");

const ORIGINAL = "await this.#i(i,s,o):await this.#s(a,s,o)";
const PATCHED = "await this.#i(i,this.#t,o):await this.#s(a,this.#t,o)";

const source = readFileSync(bundlePath, "utf-8");

if (source.includes(PATCHED)) {
  console.log("patch-cwd: already applied, skipping.");
  process.exit(0);
}

if (!source.includes(ORIGINAL)) {
  console.error("patch-cwd: target string not found — context-mode bundle may have changed.");
  console.error("  Expected:", ORIGINAL);
  console.error("  Check if minified variable names shifted after a version bump.");
  process.exit(1);
}

writeFileSync(bundlePath, source.replace(ORIGINAL, PATCHED));
console.log("patch-cwd: patched executor to use projectRoot as spawn cwd.");
