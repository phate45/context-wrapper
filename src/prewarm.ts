/**
 * Pre-warm pipeline for context-wrapper.
 *
 * Discovers .claude/context-mode.json, resolves source files via three
 * strategies (glob, exec, paths), preprocesses markdown, and indexes
 * into the context-mode FTS5 database so search() works immediately.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname, basename, resolve } from "node:path";
import { ContentStore } from "../node_modules/context-mode/src/store.ts";

// ── Types ────────────────────────────────────────────────────────────

export interface SourceConfig {
  label: string;
  path?: string;
  glob?: string;
  recursive?: boolean;
  exec?: string;
  paths?: string[];
  stripFrontmatter?: boolean;
  prefixDates?: boolean;
}

export interface Config {
  sources: SourceConfig[];
}

interface ResolvedFile {
  name: string;
  path: string;
  content: string;
}

// ── Config Discovery ────────────────────────────────────────────────

export function findConfig(
  startDir: string,
): { config: Config; configPath: string } | null {
  let dir = resolve(startDir);

  while (true) {
    const candidate = join(dir, ".claude", "context-mode.json");
    try {
      const raw = readFileSync(candidate, "utf-8");
      return { config: JSON.parse(raw), configPath: candidate };
    } catch {
      // not found here, keep walking
    }
    const parent = dirname(dir);
    if (parent === dir) break; // filesystem root
    dir = parent;
  }
  return null;
}

// ── File Resolution ─────────────────────────────────────────────────

function matchGlob(filename: string, pattern: string): boolean {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`).test(filename);
}

function walkDir(dir: string, glob: string, recursive: boolean): string[] {
  const results: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      try {
        const stat = statSync(fullPath);
        if (stat.isDirectory() && recursive) {
          results.push(...walkDir(fullPath, glob, true));
        } else if (stat.isFile() && matchGlob(entry, glob)) {
          results.push(fullPath);
        }
      } catch {
        /* skip unreadable */
      }
    }
  } catch {
    /* directory doesn't exist */
  }
  return results;
}

function readFile(fullPath: string): ResolvedFile | null {
  try {
    const content = readFileSync(fullPath, "utf-8");
    if (content.trim().length === 0) return null;
    return { name: basename(fullPath), path: fullPath, content };
  } catch {
    return null;
  }
}

function resolveSourceFiles(source: SourceConfig): ResolvedFile[] {
  // Strategy 1: explicit paths
  if (source.paths) {
    const basePath = source.path || ".";
    return source.paths
      .map((p) => resolve(basePath, p))
      .map(readFile)
      .filter((f): f is ResolvedFile => f !== null);
  }

  // Strategy 2: exec command → JSON array of paths
  if (source.exec) {
    const cwd = source.path || process.cwd();
    try {
      const output = execSync(source.exec, {
        cwd,
        encoding: "utf-8",
        timeout: 10000,
      }).trim();
      const paths = JSON.parse(output);
      if (!Array.isArray(paths)) {
        process.stderr.write(
          `[context-wrapper] exec for "${source.label}" did not return an array\n`,
        );
        return [];
      }
      return paths
        .map((p: string) => resolve(cwd, p))
        .map(readFile)
        .filter((f): f is ResolvedFile => f !== null);
    } catch (err: any) {
      process.stderr.write(
        `[context-wrapper] exec for "${source.label}" failed: ${err.message}\n`,
      );
      return [];
    }
  }

  // Strategy 3: glob (flat or recursive)
  if (source.glob && source.path) {
    return walkDir(source.path, source.glob, !!source.recursive)
      .map(readFile)
      .filter((f): f is ResolvedFile => f !== null);
  }

  process.stderr.write(
    `[context-wrapper] source "${source.label}" has no file selection strategy (need glob+path, exec, or paths)\n`,
  );
  return [];
}

// ── Preprocessing ───────────────────────────────────────────────────

function stripFrontmatter(text: string): string {
  if (!text.startsWith("---")) return text;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return text;
  return text.slice(end + 4).replace(/^\n+/, "");
}

function prefixDates(text: string, filename: string): string {
  const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})\.md$/);
  if (!dateMatch) return text;
  const date = dateMatch[1];

  const lines = text.split("\n");
  const result: string[] = [];

  for (const line of lines) {
    if (/^##\s+\d{4}-\d{2}-\d{2}\s*$/.test(line)) continue;
    const topicMatch = line.match(/^(##\s+)(.+)$/);
    if (topicMatch) {
      result.push(`${topicMatch[1]}[${date}] ${topicMatch[2]}`);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

function collapseBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, "\n\n");
}

function preprocessFile(file: ResolvedFile, source: SourceConfig): string {
  let text = file.content;
  if (source.stripFrontmatter) text = stripFrontmatter(text);
  if (source.prefixDates) text = prefixDates(text, file.name);
  text = collapseBlankLines(text);
  return text;
}

// ── Pre-Warm ────────────────────────────────────────────────────────

/**
 * Index configured sources into the context-mode FTS5 database.
 *
 * @param config  Parsed .claude/context-mode.json
 * @param dbPath  Database path — pass `/tmp/context-mode-{pid}.db` using
 *                the upstream subprocess PID so the server finds our data.
 */
export function prewarm(
  config: Config,
  dbPath: string,
): { totalSources: number; totalChunks: number } {
  const store = new ContentStore(dbPath);

  let totalSources = 0;
  let totalChunks = 0;

  for (const source of config.sources) {
    const files = resolveSourceFiles(source);
    if (files.length === 0) continue;

    for (const file of files) {
      const text = preprocessFile(file, source);
      const label = `${source.label}: ${file.name}`;
      const result = store.index({ content: text, source: label });
      totalSources++;
      totalChunks += result.totalChunks;
    }
  }

  return { totalSources, totalChunks };
}
