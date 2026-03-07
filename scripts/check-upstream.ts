/**
 * Check upstream context-mode for changes that affect our build/runtime.
 *
 * Compares current upstream state against a stored manifest. Flags:
 *   - Dependency additions/removals (runtime deps we inherit)
 *   - External changes (native/heavy deps that can't be bundled)
 *   - Export map changes (affects our import paths)
 *
 * Usage:
 *   bun run check            — compare against manifest
 *   bun run check --update   — accept current state as new baseline
 */

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const upstream = join(root, "node_modules", "context-mode");
const manifestPath = join(root, "upstream.manifest.json");

// ── Helpers ──

function hash(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

function readUpstream(relPath: string): string {
  const full = join(upstream, relPath);
  if (!existsSync(full)) throw new Error(`Missing: ${relPath}`);
  return readFileSync(full, "utf-8");
}

function getCurrentTag(): string {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));
  const dep = pkg.dependencies?.["context-mode"] ?? "";
  return dep.match(/#(.+)$/)?.[1] ?? "unknown";
}

// ── Extractors ──

interface Probe {
  name: string;
  description: string;
  extract: () => string;
}

const probes: Probe[] = [
  {
    name: "dependencies",
    description: "Runtime deps (additions need install, removals may break imports)",
    extract() {
      const pkg = JSON.parse(readUpstream("package.json"));
      return Object.entries(pkg.dependencies ?? {})
        .map(([k, v]) => `${k}@${v}`)
        .sort()
        .join("\n");
    },
  },
  {
    name: "externals",
    description: "esbuild externals from upstream bundle script (our build must match)",
    extract() {
      const pkg = JSON.parse(readUpstream("package.json"));
      const script = pkg.scripts?.bundle ?? "";
      const hits = [...script.matchAll(/--external:(\S+)/g)].map((m) => m[1]);
      return [...new Set(hits)].sort().join("\n");
    },
  },
  {
    name: "exports",
    description: "Package exports map (affects our import resolution)",
    extract() {
      const pkg = JSON.parse(readUpstream("package.json"));
      return JSON.stringify(pkg.exports ?? {}, null, 2);
    },
  },
  {
    name: "version",
    description: "Upstream version constant",
    extract() {
      const src = readUpstream("src/server.ts");
      return src.match(/VERSION\s*=\s*"([^"]+)"/)?.[1] ?? "unknown";
    },
  },
];

// ── Main ──

interface Manifest {
  tag: string;
  generated: string;
  fingerprints: Record<string, { hash: string; value: string }>;
}

function loadManifest(): Manifest | null {
  if (!existsSync(manifestPath)) return null;
  return JSON.parse(readFileSync(manifestPath, "utf-8"));
}

function run() {
  const tag = getCurrentTag();
  const manifest = loadManifest();
  const update = process.argv.includes("--update");

  console.log(`\n  Checking upstream (${tag})\n`);

  const fingerprints: Manifest["fingerprints"] = {};
  let changed = 0;

  for (const probe of probes) {
    const value = probe.extract();
    const h = hash(value);
    fingerprints[probe.name] = { hash: h, value };

    const prev = manifest?.fingerprints[probe.name];

    if (!prev) {
      console.log(`  🆕  ${probe.name}  — ${probe.description}`);
      for (const line of value.split("\n")) console.log(`      ${line}`);
      changed++;
    } else if (prev.hash !== h) {
      console.log(`  ⚠️   ${probe.name}  — ${probe.description}`);
      diff(prev.value, value);
      changed++;
    } else {
      console.log(`  ✅  ${probe.name}`);
    }
  }

  console.log();

  if (update || !manifest) {
    const next: Manifest = { tag, generated: new Date().toISOString(), fingerprints };
    writeFileSync(manifestPath, JSON.stringify(next, null, 2) + "\n");
    console.log(`  Manifest written → upstream.manifest.json\n`);
  } else if (changed) {
    console.log(`  ${changed} change(s) detected. Review above, then run with --update to accept.\n`);
    process.exit(1);
  } else {
    console.log(`  All clear.\n`);
  }
}

function diff(old: string, cur: string) {
  const oldLines = new Set(old.split("\n"));
  const curLines = new Set(cur.split("\n"));
  for (const line of oldLines) {
    if (!curLines.has(line)) console.log(`      − ${line}`);
  }
  for (const line of curLines) {
    if (!oldLines.has(line)) console.log(`      + ${line}`);
  }
}

run();
