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
execSync("bun run check", { cwd: root, stdio: "inherit" });
