# context-wrapper

@/home/phate/BigProjects/context-wrapper/CLAUDE.local.md

## What This Is

A pre-warm wrapper around the [context-mode](https://github.com/mksglu/claude-context-mode) MCP server. Populates a FTS5 database with configured markdown content before starting the server, eliminating the cold-start problem where `search()` returns nothing until content is manually indexed.

Includes a JSON-RPC proxy layer and subagent routing hooks.

See `README.md` for the user-facing integration guide.

## File Overview

| File | Purpose |
|------|---------|
| `wrapper.mjs` | Entry point. Config discovery → DB pre-warm → JSON-RPC proxy → server launch. |
| `setup.js` | Install script. Detects package manager (bun/pnpm/npm), installs deps, prints `claude mcp add` command. |
| `patch-cwd.js` | Postinstall script. Patches the server bundle so `execute` runs in project root, not tmpdir. |
| `subagent-hook.sh` | Bash PreToolUse hook — injects routing instructions into subagent prompts. |
| `subagent-hook.py` | Python equivalent of above. |
| `package.json` | Dependencies: `context-mode` (the server) and `better-sqlite3` (native SQLite bindings). |

## Architecture

### Pre-Warm Phase
1. Walk up from CWD looking for `.claude/context-mode.json` (first match wins)
2. Resolve source files via three strategies: glob, exec, or explicit paths
3. Preprocess (strip frontmatter, prefix dates, collapse blanks)
4. Chunk markdown (heading-based splits, code block atomicity, heading stack for nested titles)
5. Populate `/tmp/context-mode-{PID}.db` with FTS5 schema (porter + trigram) and vocabulary

### JSON-RPC Proxy
- Overrides `process.stdin`/`process.stdout` with PassThrough streams
- Merges `execute` + `execute_file` into single `execute` tool (optional `path` param)
- Hides `stats` tool; writes session stats to `/tmp/context-mode-{PID}-stats.log`
- Request/response transforms via `LineBuffer` for chunk-safe JSON-RPC framing

### Server Launch
- Dynamic-imports the context-mode server bundle
- Bundle's `ContentStore` opens the same PID-based DB path, finds pre-warmed tables via `CREATE TABLE IF NOT EXISTS`

## Critical Coupling: context-mode Internals

This wrapper replicates internal behavior from context-mode's `ContentStore` class. These coupling points must stay in sync when upgrading:

### 1. Database Path Convention
```
/tmp/context-mode-{process.pid}.db
```
**Source:** `store.ts` constructor

### 2. Schema (4 tables)
- `sources` — metadata per indexed document
- `chunks` — FTS5, `tokenize='porter unicode61'`
- `chunks_trigram` — FTS5, `tokenize='trigram'`
- `vocabulary` — unique words for fuzzy correction

### 3. Chunking Algorithm
Ported from `store.ts` `#chunkMarkdown()`:
- Split on H1–H4 headings, maintain heading stack for ancestor chain
- Fenced code blocks as atomic units
- Horizontal rules as hard boundaries
- `hasCode` flag → `content_type: "code"`

### 4. Vocabulary Extraction
Unicode-aware split (`/[^\p{L}\p{N}_-]+/u`), 3+ chars, minus stopwords.

### 5. Stopwords
Exact copy from `store.ts`. Must stay in sync.

## Upgrading context-mode

1. Check the changelog / diff against coupling points above
2. Pay special attention to: schema changes, chunking logic, DB path, stopwords
3. Verify `patch-cwd.js` still matches the bundle structure
4. Test: restart CC, run `search()` immediately — pre-warmed content should appear

## Per-Project Configuration

Each project that uses context-wrapper creates `.claude/context-mode.json` defining its sources. This file does NOT live in this repo — it lives in each consuming project.

## File Resolution Strategies

| Strategy | Required Fields | Description |
|----------|----------------|-------------|
| **glob** | `path` + `glob` | Match filenames in a directory. `recursive: true` for subdirs. |
| **exec** | `exec` | Shell command outputting JSON array of file paths. 10s timeout. |
| **paths** | `paths` | Explicit array of file paths. |

## Preprocessing Options

Pure functions in `wrapper.mjs`:
- `stripFrontmatter` — removes YAML `---`/`---` blocks from file start
- `prefixDates` — for `YYYY-MM-DD.md` files, prefixes topic headings with `[date]`
- Blank line collapsing (always applied)
