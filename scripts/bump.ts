/**
 * Bump the upstream context-mode git dependency, reinstall, and check.
 *
 * Usage:  bun run bump v1.0.15
 *         bun run bump 1.0.15    (v prefix added automatically)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { checkUpstream, renderCheckResult, writeManifest } from "./check-upstream.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pkgPath = join(root, "package.json");

const arg = process.argv[2];
if (!arg) {
  console.error("Usage: bun run bump <tag>  (e.g. bun run bump v1.0.15)");
  process.exit(1);
}

const tag = arg.startsWith("v") ? arg : `v${arg}`;
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
const oldDep = pkg.dependencies["context-mode"];
const newDep = `github:mksglu/context-mode#${tag}`;

pkg.dependencies["context-mode"] = newDep;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`\n  ${oldDep}\n  → ${newDep}\n`);

console.log("  Installing...\n");
execSync("bun install", { cwd: root, stdio: "inherit" });

console.log("");
const result = await checkUpstream();
renderCheckResult(result);

if (result.blockingChanges.length > 0) {
  console.log(
    `  ${result.blockingChanges.length} blocking change(s) detected. Review above, then run with --update to accept.\n`,
  );
  process.exit(1);
}

const onlyVersionChanged =
  result.changes.length > 0 && result.changes.every((change) => change.name === "version");

if (onlyVersionChanged) {
  writeManifest(result.tag, result.fingerprints);
  console.log("  Version-only drift detected; manifest auto-updated.\n");
} else if (result.changes.length === 0) {
  // renderCheckResult already printed “All clear.”
} else {
  console.log("  Informational change(s) detected. Review above, then run bun run check --update to accept.\n");
}
