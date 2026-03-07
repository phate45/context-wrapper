# context-wrapper

Pre-warm wrapper for the [context-mode](https://github.com/mksglu/claude-context-mode) MCP server. Indexes configured markdown files into the FTS5 search database before the server starts, so `search()` returns results immediately — no manual indexing step required.

## Requirements

- **Node.js** (v22+) — runtime (context-mode depends on `better-sqlite3`, a native addon [not yet supported](https://github.com/oven-sh/bun/issues/4290) by bun's runtime)
- A package manager: **bun** (preferred), pnpm, or npm

## Setup

```bash
cd context-wrapper/
node setup.js    # or: bun run setup.js
```

This installs dependencies and prints the `claude mcp add` command to wire up the wrapper. Run that command to register it with Claude Code.

If you already have a `context-mode` entry in your `.mcp.json`, replace it — this wrapper supersedes the direct bundle invocation.

## Project Configuration

Create `.claude/context-mode.json` in any project that should have pre-warmed content:

Each source needs a `label` and a file selection strategy. Three strategies are available:

### Strategy 1: Glob (flat or recursive)

Match files by pattern in a directory.

```json
{
  "label": "work-logs",
  "path": "/absolute/path/to/logs",
  "glob": "*.md",
  "stripFrontmatter": true,
  "prefixDates": true
}
```

Add `"recursive": true` to scan subdirectories:

```json
{
  "label": "docs",
  "path": "/absolute/path/to/docs",
  "glob": "*.md",
  "recursive": true,
  "stripFrontmatter": true
}
```

### Strategy 2: Exec

Run a command that outputs a JSON array of file paths. Relative paths resolve from `path` (or CWD if omitted).

```json
{
  "label": "curated",
  "path": "/project/root",
  "exec": "./list-indexable-files.sh",
  "stripFrontmatter": true
}
```

The command must print valid JSON to stdout, e.g.:

```json
["docs/guide.md", "docs/api/reference.md", "CHANGELOG.md"]
```

Timeout: 10 seconds.

### Strategy 3: Explicit Paths

Hardcode a list of file paths. Relative paths resolve from `path` (or CWD if omitted).

```json
{
  "label": "key-docs",
  "paths": [
    "/absolute/path/to/architecture.md",
    "/absolute/path/to/decisions.md"
  ],
  "stripFrontmatter": true
}
```

### Source Fields Reference

| Field | Description |
|-------|-------------|
| `label` | **(required)** Source tag for scoped search (`source: "work-logs"`) |
| `path` | Base directory. Required for glob, optional for exec/paths (used as CWD / base for relative paths) |
| `glob` | File pattern to match (e.g. `*.md`). Requires `path`. |
| `recursive` | Walk subdirectories when using glob. Default: `false` |
| `exec` | Shell command that outputs a JSON array of file paths |
| `paths` | Explicit array of file paths |
| `stripFrontmatter` | Remove YAML `---` frontmatter blocks from start of files. Default: `false` |
| `prefixDates` | For date-named files (`2026-02-28.md`): prefix `##` headings with `[YYYY-MM-DD]`. Default: `false` |

### Searching Pre-Warmed Content

Pre-warmed content is searchable through the standard context-mode tools:

```
search(queries: ["tmux configuration"])
search(queries: ["authentication"], source: "work-logs")
search(queries: ["FTS5 schema"], source: "research-notes")
```

The `source` parameter matches against labels. A source labeled `"work-logs"` creates entries like `"work-logs: 2026-02-28.md"`, so `source: "work-logs"` matches all files in that source.

## How It Works

The wrapper runs three phases on startup:

1. **Discover** — Walks up from CWD looking for `.claude/context-mode.json`
2. **Pre-warm** — Creates a SQLite FTS5 database at `/tmp/context-mode-{PID}.db`, populates it with preprocessed and chunked content from the configured sources
3. **Launch** — Dynamic-imports the context-mode server bundle, which finds the pre-warmed database and serves it

If no config file is found, the wrapper skips pre-warming and starts the server normally — identical behavior to running context-mode directly.

## Preprocessing Details

### Frontmatter Stripping

Removes YAML frontmatter at the start of a file (between opening `---` and closing `---`). Does not affect horizontal rules mid-document.

### Date Prefixing

For files named `YYYY-MM-DD.md` (work logs):

- Bare date headings (`## 2026-02-28`) are removed
- Topic headings become `## [2026-02-28] Database Migration`
- This makes search results self-documenting — you can see when something happened without checking the source filename

## Subagent Hook (Optional)

The wrapper includes `subagent-hook.sh` — a PreToolUse hook that teaches subagents to use context-mode tools instead of flooding the parent's context with raw output.

**What it does:**

- Injects routing instructions into every subagent prompt, directing them to use `batch_execute`, `search`, `execute_file`, etc.
- Tells subagents to keep responses under 500 words and index detailed findings into the shared knowledge base (the parent can `search()` for them afterward)
- Upgrades Bash subagents to general-purpose so they gain MCP tool access

**To enable it**, add a hook entry to `.claude/settings.json` or `.claude/settings.local.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Task",
        "hooks": [
          {
            "type": "command",
            "command": "bash /absolute/path/to/context-wrapper/subagent-hook.sh"
          }
        ]
      }
    ]
  }
}
```

Replace the path with the absolute path to your `context-wrapper/` directory. A Python version (`subagent-hook.py`) is also available — swap `bash ...subagent-hook.sh` for `python3 ...subagent-hook.py`.

**Bash stdin quirk:** `jq` can't read CC's hook stdin via redirect (`jq < /dev/stdin` exits 1). Use `INPUT=$(cat)` to capture stdin into a variable, then pipe it: `echo "$INPUT" | jq ...`. The `cat | jq` pipe also works but only gives you one shot at the data.

**Note:** This hook nudges subagents toward context-mode tools but does not block standard tools. Subagents can still use Bash, Read, etc. when appropriate.

**Naming quirk:** The matcher must be `"Task"` (that's what Claude Code dispatches), but the `tool_name` in the hook's JSON payload arrives as `"Agent"`. Both hook scripts handle this correctly — just be aware if writing your own.

## Portability

Copy this folder to another machine, run `node setup.js`, add the MCP server. The wrapper brings its own context-mode and better-sqlite3 as dependencies — only Node.js and a package manager (bun, pnpm, or npm) are required.
