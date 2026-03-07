# context-wrapper

@/home/phate/BigProjects/context-wrapper/CLAUDE.local.md

## What This Is

A middleman MCP server wrapping [context-mode](https://github.com/mksglu/context-mode). Pre-warms the FTS5 database with configured markdown content on startup (eliminating cold-start), renames tools (drops `ctx_` prefix), merges `execute`+`execute_file`, and hides internal tools.

Includes subagent routing hooks for Claude Code.

See `README.md` for the user-facing integration guide.

## File Overview

| File | Purpose |
|------|---------|
| `src/wrapper.ts` | Entry point. Middleman MCP: spawns upstream server as subprocess, pre-warms DB, forwards tool calls with name mapping. |
| `src/prewarm.ts` | Config discovery, file resolution (glob/exec/paths), preprocessing, ContentStore.index(). |
| `wrapper.bundle.mjs` | Built artifact. `esbuild` output of `src/wrapper.ts` — what users run via `node`. |
| `setup.js` | Install script. Detects package manager (bun/pnpm/npm), installs deps, prints `claude mcp add` command. |
| `subagent-hook.sh` | Bash PreToolUse hook — injects routing instructions into subagent prompts. |
| `subagent-hook.py` | Python equivalent of above. |
| `scripts/check-upstream.ts` | Validates upstream coupling points against `upstream.manifest.json`. |
| `scripts/bump.ts` | Updates git dep tag → installs → runs check. |
| `package.json` | Dependencies: `context-mode` (upstream server), `@modelcontextprotocol/sdk` (MCP protocol), `zod`. |

## Architecture

### Middleman MCP

```
Claude Code ↔ Our Server (stdin/stdout) ↔ [MCP Client → child process] ↔ Upstream Server
```

Our process is both:
- An MCP **server** facing Claude Code (low-level `Server` class, raw JSON schema passthrough)
- An MCP **client** facing the upstream context-mode subprocess (spawned via `StdioClientTransport`)

### Tool Mapping

| Exposed to CC | Upstream Call | Notes |
|---------------|-------------|-------|
| `execute` | `ctx_execute` or `ctx_execute_file` | `path` param → file variant |
| `index` | `ctx_index` | Name only |
| `search` | `ctx_search` | Name only |
| `fetch_and_index` | `ctx_fetch_and_index` | Name only |
| `batch_execute` | `ctx_batch_execute` | Name only |

Hidden: `ctx_stats`, `ctx_doctor`, `ctx_upgrade`.

### Pre-Warm Phase
1. Connect to upstream subprocess → get its PID
2. Walk up from CWD looking for `.claude/context-mode.json` (first match wins)
3. Resolve source files via three strategies: glob, exec, or explicit paths
4. Preprocess (strip frontmatter, prefix dates, collapse blanks)
5. Index into `/tmp/context-mode-{upstream-PID}.db` using `ContentStore` import
6. Upstream's lazy `getStore()` finds pre-warmed data on first tool call

### Startup Sequence
1. Spawn upstream `server.bundle.mjs` as child process
2. MCP client connect + initialize handshake
3. Pre-warm DB at subprocess PID path
4. List upstream tools, build remapped tool list
5. Register `tools/list` and `tools/call` handlers with name mapping
6. Connect server transport to Claude Code's stdio

## Coupling Points

The middleman design minimizes coupling to two points:

### 1. ContentStore Import (pre-warm only)
```typescript
import { ContentStore } from "../node_modules/context-mode/src/store.ts";
```
Used at startup to populate the FTS5 database. Constructor accepts optional `dbPath`.

### 2. Tool Name Mapping
The `TOOL_MAP` constant maps our names to upstream `ctx_*` names. If upstream renames tools, update the map.

All other upstream internals (security, search throttling, intent search, network instrumentation, etc.) stay inside the subprocess — we don't import or replicate them.

## Upgrading context-mode

1. Run `bun run bump v<new-tag>` — updates dep, installs, runs check
2. Verify `ContentStore` constructor still accepts `dbPath` parameter
3. Verify tool names haven't changed (check `server.ts` `registerTool` calls)
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

Pure functions in `src/prewarm.ts`:
- `stripFrontmatter` — removes YAML `---`/`---` blocks from file start
- `prefixDates` — for `YYYY-MM-DD.md` files, prefixes topic headings with `[date]`
- Blank line collapsing (always applied)
