/**
 * context-wrapper — Pre-warm wrapper for the context-mode MCP server.
 *
 * Indexes configured vault notes into a FTS5 database before starting the
 * server, so search() works immediately without manual indexing.
 *
 * Config: .claude/context-mode.json (discovered by walking up from CWD)
 * DB:     /tmp/context-mode-{PID}.db (same path the server will open)
 */

import { createRequire } from "node:module";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname, basename, resolve, relative } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { PassThrough } from "node:stream";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Stopwords (exact copy from context-mode store.ts) ───────────────

const STOPWORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
  "her", "was", "one", "our", "out", "has", "his", "how", "its", "may",
  "new", "now", "old", "see", "way", "who", "did", "get", "got", "let",
  "say", "she", "too", "use", "will", "with", "this", "that", "from",
  "they", "been", "have", "many", "some", "them", "than", "each", "make",
  "like", "just", "over", "such", "take", "into", "year", "your", "good",
  "could", "would", "about", "which", "their", "there", "other", "after",
  "should", "through", "also", "more", "most", "only", "very", "when",
  "what", "then", "these", "those", "being", "does", "done", "both",
  "same", "still", "while", "where", "here", "were", "much",
  "update", "updates", "updated", "deps", "dev", "tests", "test",
  "add", "added", "fix", "fixed", "run", "running", "using",
]);

// ── Config Discovery ────────────────────────────────────────────────

function findConfig(startDir) {
  let dir = resolve(startDir);
  const root = dirname(dir) === dir ? dir : undefined;

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
//
// Three strategies for locating files to index:
//   1. glob  — match filenames in `path` (flat or recursive)
//   2. exec  — run a command that outputs a JSON array of file paths
//   3. paths — explicit list of file paths
//

function matchGlob(filename, pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`).test(filename);
}

function walkDir(dir, glob, recursive) {
  const results = [];
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
      } catch { /* skip unreadable */ }
    }
  } catch { /* directory doesn't exist */ }
  return results;
}

function readFile(fullPath) {
  try {
    const content = readFileSync(fullPath, "utf-8");
    if (content.trim().length === 0) return null;
    return { name: basename(fullPath), path: fullPath, content };
  } catch {
    return null;
  }
}

function resolveSourceFiles(source) {
  // Strategy 1: explicit paths
  if (source.paths) {
    const basePath = source.path || ".";
    return source.paths
      .map((p) => resolve(basePath, p))
      .map(readFile)
      .filter(Boolean);
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
          `[context-wrapper] exec for "${source.label}" did not return an array\n`
        );
        return [];
      }
      return paths
        .map((p) => resolve(cwd, p))
        .map(readFile)
        .filter(Boolean);
    } catch (err) {
      process.stderr.write(
        `[context-wrapper] exec for "${source.label}" failed: ${err.message}\n`
      );
      return [];
    }
  }

  // Strategy 3: glob (flat or recursive)
  if (source.glob && source.path) {
    return walkDir(source.path, source.glob, !!source.recursive)
      .map(readFile)
      .filter(Boolean);
  }

  process.stderr.write(
    `[context-wrapper] source "${source.label}" has no file selection strategy (need glob+path, exec, or paths)\n`
  );
  return [];
}

// ── Preprocessing ───────────────────────────────────────────────────

function stripFrontmatter(text) {
  // Only strip YAML frontmatter at the very start of the file
  if (!text.startsWith("---")) return text;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return text;
  return text.slice(end + 4).replace(/^\n+/, "");
}

function prefixDates(text, filename) {
  // Extract date from filename like 2026-02-28.md
  const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})\.md$/);
  if (!dateMatch) return text;
  const date = dateMatch[1];

  const lines = text.split("\n");
  const result = [];

  for (const line of lines) {
    // Remove bare date headings (## 2026-02-28)
    if (/^##\s+\d{4}-\d{2}-\d{2}\s*$/.test(line)) continue;
    // Prefix topic headings with date
    const topicMatch = line.match(/^(##\s+)(.+)$/);
    if (topicMatch) {
      result.push(`${topicMatch[1]}[${date}] ${topicMatch[2]}`);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

function collapseBlankLines(text) {
  return text.replace(/\n{3,}/g, "\n\n");
}

function preprocessFile(file, source) {
  let text = file.content;
  if (source.stripFrontmatter) text = stripFrontmatter(text);
  if (source.prefixDates) text = prefixDates(text, file.name);
  text = collapseBlankLines(text);
  return text;
}

// ── Markdown Chunking (faithful port from store.ts #chunkMarkdown) ──

function buildTitle(headingStack, currentHeading) {
  if (headingStack.length === 0) {
    return currentHeading || "Untitled";
  }
  return headingStack.map((h) => h.text).join(" > ");
}

function chunkMarkdown(text) {
  const chunks = [];
  const lines = text.split("\n");
  const headingStack = [];
  let currentContent = [];
  let currentHeading = "";

  const flush = () => {
    const joined = currentContent.join("\n").trim();
    if (joined.length === 0) return;

    chunks.push({
      title: buildTitle(headingStack, currentHeading),
      content: joined,
      hasCode: currentContent.some((l) => /^`{3,}/.test(l)),
    });
    currentContent = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule separator
    if (/^[-_*]{3,}\s*$/.test(line)) {
      flush();
      i++;
      continue;
    }

    // Heading (H1-H4)
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flush();

      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();

      // Pop deeper levels from stack
      while (
        headingStack.length > 0 &&
        headingStack[headingStack.length - 1].level >= level
      ) {
        headingStack.pop();
      }
      headingStack.push({ level, text: heading });
      currentHeading = heading;

      currentContent.push(line);
      i++;
      continue;
    }

    // Code block — collect entire block as a unit
    const codeMatch = line.match(/^(`{3,})(.*)?$/);
    if (codeMatch) {
      const fence = codeMatch[1];
      const codeLines = [line];
      i++;

      while (i < lines.length) {
        codeLines.push(lines[i]);
        if (lines[i].startsWith(fence) && lines[i].trim() === fence) {
          i++;
          break;
        }
        i++;
      }

      currentContent.push(...codeLines);
      continue;
    }

    // Regular line
    currentContent.push(line);
    i++;
  }

  // Flush remaining content
  flush();

  return chunks;
}

// ── Vocabulary Extraction (from store.ts #extractAndStoreVocabulary) ─

function extractVocabulary(text) {
  const words = text
    .toLowerCase()
    .split(/[^\p{L}\p{N}_-]+/u)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  return [...new Set(words)];
}

// ── Database Pre-Warm ───────────────────────────────────────────────

function prewarm(config) {
  const require = createRequire(import.meta.url);
  const Database = require("better-sqlite3");

  const dbPath = join(tmpdir(), `context-mode-${process.pid}.db`);
  const db = new Database(dbPath, { timeout: 5000 });
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");

  // Create schema (identical to ContentStore#initSchema)
  db.exec(`
    CREATE TABLE IF NOT EXISTS sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      chunk_count INTEGER NOT NULL DEFAULT 0,
      code_chunk_count INTEGER NOT NULL DEFAULT 0,
      indexed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS chunks USING fts5(
      title,
      content,
      source_id UNINDEXED,
      content_type UNINDEXED,
      tokenize='porter unicode61'
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS chunks_trigram USING fts5(
      title,
      content,
      source_id UNINDEXED,
      content_type UNINDEXED,
      tokenize='trigram'
    );

    CREATE TABLE IF NOT EXISTS vocabulary (
      word TEXT PRIMARY KEY
    );
  `);

  const insertSource = db.prepare(
    "INSERT INTO sources (label, chunk_count, code_chunk_count) VALUES (?, ?, ?)"
  );
  const insertChunk = db.prepare(
    "INSERT INTO chunks (title, content, source_id, content_type) VALUES (?, ?, ?, ?)"
  );
  const insertChunkTrigram = db.prepare(
    "INSERT INTO chunks_trigram (title, content, source_id, content_type) VALUES (?, ?, ?, ?)"
  );
  const insertWord = db.prepare(
    "INSERT OR IGNORE INTO vocabulary (word) VALUES (?)"
  );

  let totalSources = 0;
  let totalChunks = 0;

  for (const source of config.sources) {
    const files = resolveSourceFiles(source);
    if (files.length === 0) continue;

    // Process all files for this source, index each as its own source entry
    for (const file of files) {
      const text = preprocessFile(file, source);
      const chunks = chunkMarkdown(text);
      if (chunks.length === 0) continue;

      const codeChunks = chunks.filter((c) => c.hasCode).length;
      const label = `${source.label}: ${file.name}`;

      const indexTransaction = db.transaction(() => {
        const info = insertSource.run(label, chunks.length, codeChunks);
        const sourceId = Number(info.lastInsertRowid);

        for (const chunk of chunks) {
          const ct = chunk.hasCode ? "code" : "prose";
          insertChunk.run(chunk.title, chunk.content, sourceId, ct);
          insertChunkTrigram.run(chunk.title, chunk.content, sourceId, ct);
        }

        // Vocabulary extraction
        const vocab = extractVocabulary(text);
        for (const word of vocab) {
          insertWord.run(word);
        }

        return sourceId;
      });

      indexTransaction();
      totalSources++;
      totalChunks += chunks.length;
    }
  }

  db.close();
  return { dbPath, totalSources, totalChunks };
}

// ── JSON-RPC Proxy ──────────────────────────────────────────────────
//
// Intercepts the MCP protocol between Claude Code and the real server
// to reshape the tool interface:
//   - Folds execute + execute_file into a single execute tool
//   - Hides the stats tool (session stats go to a log file instead)
//

class LineBuffer {
  constructor(onLine) {
    this._buf = "";
    this._onLine = onLine;
  }

  push(chunk) {
    this._buf += chunk.toString("utf-8");
    const lines = this._buf.split("\n");
    this._buf = lines.pop(); // keep incomplete tail
    for (const line of lines) {
      if (line.trim().length > 0) this._onLine(line);
    }
  }
}

function transformRequest(line, pendingMethods, proxyStats) {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return line; // non-JSON from CC — pass through
  }

  // Track method by id for response correlation (skip notifications — no id)
  if (msg.id !== undefined && msg.method !== undefined) {
    pendingMethods.set(msg.id, msg.method);
  }

  // Stats tracking (original name, before rename)
  if (msg.method === "tools/call" && msg.params?.name) {
    const name = msg.params.name;
    proxyStats.toolCalls.set(name, (proxyStats.toolCalls.get(name) ?? 0) + 1);
  }

  // Merge: execute + path → execute_file
  if (
    msg.method === "tools/call" &&
    msg.params?.name === "execute" &&
    msg.params?.arguments?.path !== undefined
  ) {
    msg = {
      ...msg,
      params: { ...msg.params, name: "execute_file" },
    };
  }

  return JSON.stringify(msg);
}

function mergeExecuteTool(tool) {
  const schema = tool.inputSchema ?? {};
  const properties = { ...(schema.properties ?? {}) };

  properties.path = {
    type: "string",
    description:
      "Absolute file path or relative to project root. When provided, " +
      "reads this file into a FILE_CONTENT variable inside the sandbox — " +
      "file contents stay in sandbox, only your printed output enters context.",
  };

  const description =
    tool.description +
    "\n\nWhen `path` is provided, reads the file at that path into a " +
    "FILE_CONTENT variable inside the sandbox. The full file contents do " +
    "NOT enter context — only what you print. Use instead of Read/cat for " +
    "log files, data files, large source files, or any file where you need " +
    "to extract specific information rather than read the entire content.";

  return {
    ...tool,
    description,
    inputSchema: { ...schema, properties },
  };
}

function transformToolsList(msg) {
  if (!msg.result?.tools) return msg;

  const tools = msg.result.tools
    .filter((t) => t.name !== "stats")
    .filter((t) => t.name !== "execute_file")
    .map((t) => (t.name === "execute" ? mergeExecuteTool(t) : t));

  return { ...msg, result: { ...msg.result, tools } };
}

function transformResponse(line, pendingMethods) {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    // Non-JSON from the bundle (stray console.log) — drop it
    process.stderr.write(
      `[context-wrapper] skipped non-JSON server output: ${line.slice(0, 120)}\n`
    );
    return null;
  }

  if (msg.id !== undefined) {
    const method = pendingMethods.get(msg.id);
    pendingMethods.delete(msg.id);

    if (method === "tools/list") {
      return JSON.stringify(transformToolsList(msg));
    }
  }

  return JSON.stringify(msg);
}

function writeStats(proxyStats) {
  const elapsed = ((Date.now() - proxyStats.startTime) / 1000).toFixed(1);
  const lines = [
    `context-wrapper session stats`,
    `started: ${new Date(proxyStats.startTime).toISOString()}`,
    `duration: ${elapsed}s`,
    ``,
  ];

  if (proxyStats.toolCalls.size === 0) {
    lines.push("tool calls: (none)");
  } else {
    lines.push("tool calls:");
    for (const [name, count] of proxyStats.toolCalls) {
      lines.push(`  ${name}: ${count}`);
    }
  }

  lines.push(`bytes in:  ${proxyStats.bytesIn}`);
  lines.push(`bytes out: ${proxyStats.bytesOut}`);
  lines.push("");

  const statsPath = join(tmpdir(), `context-mode-${process.pid}-stats.log`);
  try {
    writeFileSync(statsPath, lines.join("\n"));
  } catch (err) {
    process.stderr.write(
      `[context-wrapper] failed to write stats: ${err.message}\n`
    );
  }
}

function setupProxy() {
  // Capture real stdio before overriding (triggers lazy init)
  const realStdin = process.stdin;
  const realStdout = process.stdout;

  const fakeStdin = new PassThrough();
  const fakeStdout = new PassThrough();

  // Override so the bundle's StdioServerTransport connects to our fakes
  Object.defineProperty(process, "stdin", {
    value: fakeStdin,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(process, "stdout", {
    value: fakeStdout,
    writable: true,
    configurable: true,
  });

  const pendingMethods = new Map();
  const proxyStats = {
    startTime: Date.now(),
    toolCalls: new Map(),
    bytesIn: 0,
    bytesOut: 0,
  };

  // ── Request path: realStdin → transform → fakeStdin ──────────────

  const requestBuffer = new LineBuffer((line) => {
    const out = transformRequest(line, pendingMethods, proxyStats);
    if (out !== null) fakeStdin.write(out + "\n");
  });

  realStdin.on("data", (chunk) => {
    proxyStats.bytesIn += chunk.length;
    requestBuffer.push(chunk);
  });

  realStdin.on("end", () => fakeStdin.end());

  realStdin.on("error", (err) => {
    process.stderr.write(`[context-wrapper] stdin error: ${err.message}\n`);
    fakeStdin.destroy(err);
  });

  // ── Response path: fakeStdout → transform → realStdout ───────────

  const responseBuffer = new LineBuffer((line) => {
    const out = transformResponse(line, pendingMethods);
    if (out !== null) {
      proxyStats.bytesOut += Buffer.byteLength(out + "\n", "utf-8");
      realStdout.write(out + "\n");
    }
  });

  fakeStdout.on("data", (chunk) => responseBuffer.push(chunk));

  fakeStdout.on("end", () => realStdout.end());

  fakeStdout.on("error", (err) => {
    process.stderr.write(
      `[context-wrapper] fakeStdout error: ${err.message}\n`
    );
  });

  // ── Shutdown: write stats and exit cleanly ────────────────────────

  let shutdownDone = false;
  const shutdown = () => {
    if (shutdownDone) return;
    shutdownDone = true;
    writeStats(proxyStats);
  };

  process.on("exit", shutdown);
  process.on("SIGINT", () => process.exit(0));
  process.on("SIGTERM", () => process.exit(0));

  process.stderr.write("[context-wrapper] JSON-RPC proxy active\n");
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  const configResult = findConfig(process.cwd());

  if (configResult) {
    const { config, configPath } = configResult;
    const start = performance.now();
    const result = prewarm(config);
    const elapsed = (performance.now() - start).toFixed(0);
    process.stderr.write(
      `[context-wrapper] Pre-warmed ${result.totalChunks} chunks from ${result.totalSources} files in ${elapsed}ms\n`
    );
  }

  // Resolve the server bundle from our own node_modules
  const bundlePath = join(__dirname, "node_modules", "context-mode", "server.bundle.mjs");

  // Set up JSON-RPC proxy before the bundle connects to stdio
  setupProxy();

  // Dynamic import starts the MCP server (it connects to our fake stdio)
  await import(bundlePath);
}

main().catch((err) => {
  process.stderr.write(`[context-wrapper] Fatal: ${err.message}\n${err.stack}\n`);
  process.exit(1);
});
