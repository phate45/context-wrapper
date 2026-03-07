/**
 * Setup script for context-wrapper.
 *
 * Usage: bun run setup.js   (or: node setup.js, pnpm exec node setup.js)
 *
 * 1. Installs dependencies
 * 2. Prints the claude mcp add command to wire it up
 */

import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wrapperPath = join(__dirname, "wrapper.mjs");

// ── Detect package manager ──────────────────────────────────────────

function detectPM() {
  for (const pm of ["bun", "pnpm", "npm"]) {
    try {
      execSync(`${pm} --version`, { stdio: "ignore" });
      return pm;
    } catch { /* not found */ }
  }
  return null;
}

// ── Install dependencies ────────────────────────────────────────────

const pm = detectPM();
if (!pm) {
  console.error("Error: No package manager found (tried bun, pnpm, npm)");
  process.exit(1);
}

console.log(`Installing dependencies with ${pm}...\n`);
try {
  execSync(`${pm} install`, { cwd: __dirname, stdio: "inherit" });
} catch (err) {
  console.error(`\nDependency install failed. Fix the error above and re-run.`);
  process.exit(1);
}

// ── Verify bundle resolves ──────────────────────────────────────────

const bundleCheck = join(
  __dirname,
  "node_modules",
  "context-mode",
  "server.bundle.mjs"
);
if (!existsSync(bundleCheck)) {
  console.error(
    `\nWarning: server.bundle.mjs not found at expected location.`
  );
  console.error(`Expected: ${bundleCheck}`);
  console.error(`The wrapper may not start correctly.\n`);
}

// ── Print wiring instructions ───────────────────────────────────────

console.log(`
──────────────────────────────────────────
  Setup complete!
──────────────────────────────────────────

Add the MCP server to Claude Code:

  claude mcp add context-mode -- node ${wrapperPath}

Then create .claude/context-mode.json in any project
you want pre-warmed indexing for. Example:

  {
    "sources": [
      {
        "label": "work-logs",
        "path": "/path/to/vault/logs",
        "glob": "*.md",
        "stripFrontmatter": true,
        "prefixDates": true
      }
    ]
  }
`);
