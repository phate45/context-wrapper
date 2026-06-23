# Proposal: `batch_read` tool

## Problem

The most common `batch_execute` usage pattern is reading multiple known files and searching across their contents. Every call is pure boilerplate:

```json
{
  "commands": [
    { "label": "auth-hooks", "command": "cat /home/mase/Projects/stellarbase/.../auth.hooks.ts" },
    { "label": "preflight", "command": "cat /home/mase/Projects/stellarbase/.../preflight.ts" },
    { "label": "env", "command": "cat /home/mase/Projects/stellarbase/.../env.ts" }
  ],
  "queries": ["how preflight aggregates siblings", "env var configuration"]
}
```

The `commands` array adds nothing — every entry is `cat <path>` with a hand-written label. In a real session exploring a large codebase, this pattern repeats 3–5 times, each with 5–8 files. That's a lot of JSON ceremony for "read these files, let me ask questions."

## Proposed tool

```
batch_read(
  files:   string[],   // absolute file paths
  queries: string[]     // BM25 search queries against indexed content
)
```

Returns the same output format as `batch_execute`: indexed sections with search results. The only difference is the input interface — file paths instead of shell commands.

### Label auto-derivation

Labels are derived from file paths automatically, not specified by the caller. The derivation should produce labels that are short enough to scan but unique enough to disambiguate files from different services.

**Algorithm:** Take the path segments after the last occurrence of a known anchor directory (`apps/`, `packages/`, `src/`, `lib/`), then collapse `src/` from the result. If no anchor is found, use the last two path segments.

Examples:

| Input path | Derived label |
|---|---|
| `/home/m/Projects/stellarbase/apps/services/auth-service/src/auth.hooks.ts` | `auth-service/auth.hooks.ts` |
| `/home/m/Projects/stellarbase/apps/services/gateway-cloud/src/config/app.config.ts` | `gateway-cloud/config/app.config.ts` |
| `/home/m/Projects/stellarbase/packages/shared/protos/cloud-service/identity-mirror/identity-mirror.proto` | `protos/cloud-service/identity-mirror/identity-mirror.proto` |
| `/tmp/some-file.txt` | `tmp/some-file.txt` |

If two files produce the same label, append a numeric suffix (`auth.hooks.ts (2)`).

### What it replaces

| Before | After |
|---|---|
| 7 commands, each `{"label": "...", "command": "cat ..."}` | 7 file paths in a flat array |
| Hand-written labels | Auto-derived from paths |
| Shell execution overhead (spawning `cat`) | Direct file reads |

### What it does NOT replace

Mixed exploration calls — `batch_execute` with `rg`, `fd`, `ls` commands alongside file reads. Those stay on `batch_execute`. The two tools have distinct affordances: "I know the files" vs. "I need to run commands."

## Implementation

`batch_read` is implemented in the **wrapper layer** (`wrapper.ts`), not upstream. It decomposes into upstream `ctx_batch_execute` calls, so no changes to context-mode itself.

### Wrapper-level tool (no upstream changes)

1. **Register the tool** in `wrapper.ts` alongside the `TOOL_MAP`-derived tools. Since `batch_read` has no upstream counterpart, it's added directly to `ourTools` with an explicit JSON schema.

2. **Handle the call** in the `CallToolRequestSchema` handler. When `name === "batch_read"`:
   - Read each file from disk (`readFileSync` or `Bun.file`). Skip files that don't exist (log a warning, include an "ERROR: file not found" section in output).
   - Build a synthetic `ctx_batch_execute` request: each file becomes a command entry with the auto-derived label and the file content as if it were command output.
   - Forward to upstream `ctx_batch_execute` for indexing and BM25 search.

3. **Alternative (skip the synthetic command):** If upstream exposes `ctx_index` with raw content, we could index each file directly and then call `ctx_search`. This avoids the `cat` simulation but requires two upstream calls instead of one. The synthetic `batch_execute` approach is simpler and keeps the indexing + search atomic in one upstream round-trip.

### Schema

```json
{
  "name": "batch_read",
  "description": "Read multiple files and search across their contents. Use instead of batch_execute when all inputs are file paths (no shell commands needed). Labels are auto-derived from file paths. Returns indexed sections with BM25 search results — same output format as batch_execute.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "files": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Absolute file paths to read and index.",
        "minItems": 1
      },
      "queries": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Search queries to extract information from indexed file contents. Use 5-8 comprehensive queries. Each returns top matching sections with full content.",
        "minItems": 1
      }
    },
    "required": ["files", "queries"],
    "additionalProperties": false
  }
}
```

### Pseudocode

```typescript
// In the CallToolRequestSchema handler:

if (name === "batch_read") {
  const { files, queries } = args;

  const commands = files.map((filePath: string) => {
    const label = deriveLabel(filePath);
    let content: string;
    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      content = `ERROR: Could not read file: ${filePath}`;
    }
    return { label, command: `cat ${filePath}`, _content: content };
  });

  // Forward as a batch_execute call to upstream.
  // The upstream ctx_batch_execute runs the commands, indexes output,
  // and runs BM25 queries. We need to either:
  //   (a) actually let it run cat (simple but spawns shells), or
  //   (b) inject content directly via ctx_index + ctx_search (two calls)
  //
  // Option (a) for MVP — the shell overhead is negligible compared to
  // the indexing cost. Revisit if profiling shows otherwise.
  return client.callTool({
    name: "ctx_batch_execute",
    arguments: {
      commands: commands.map(c => ({ label: c.label, command: `cat '${c._path}'` })),
      queries,
    },
  });
}
```

**Refinement for the non-shell path:** If avoiding shell spawns matters, the wrapper can read files itself and use `ctx_index` to push content directly, then `ctx_search` to query. This is two upstream calls instead of one, but eliminates `cat` subprocesses entirely. Worth considering if batch_read is called with 10+ large files.

### Label derivation

```typescript
const ANCHOR_DIRS = new Set(["apps", "packages", "src", "lib"]);

function deriveLabel(filePath: string): string {
  const segments = filePath.split("/").filter(Boolean);

  // Find the last anchor directory and take everything after it
  let anchorIdx = -1;
  for (let i = segments.length - 1; i >= 0; i--) {
    if (ANCHOR_DIRS.has(segments[i])) {
      anchorIdx = i;
      break;
    }
  }

  let relevant: string[];
  if (anchorIdx >= 0) {
    relevant = segments.slice(anchorIdx + 1);
  } else {
    // No anchor found — use last two segments
    relevant = segments.slice(-2);
  }

  // Collapse interior 'src/' segments for brevity
  relevant = relevant.filter((s) => s !== "src");

  return relevant.join("/");
}
```

## Out of scope

- **Glob patterns or directory reads.** Tempting, but explicit file lists keep the tool predictable. Discovery happens first (via `fd`, Explore agent, or `batch_execute`), then feed paths into `batch_read`.
- **Upstream changes to context-mode.** This is a wrapper-only feature. If upstream later adds a native batch-read primitive, the wrapper can switch to it transparently.
- **Changing `batch_execute` behavior.** The two tools coexist — `batch_execute` for shell commands, `batch_read` for known files.

## Open questions

1. **Shell-free path vs. MVP simplicity.** The simplest implementation builds synthetic `cat` commands and forwards to `ctx_batch_execute`. A cleaner version reads files in the wrapper and uses `ctx_index` + `ctx_search` directly. The latter avoids shell spawns but is two upstream calls. Which is preferred?

2. **Label derivation anchors.** The proposed anchor list (`apps`, `packages`, `src`, `lib`) works for the Stellarbase monorepo. Should this be configurable in `context-mode.json`, or is a reasonable hardcoded heuristic sufficient?

3. **Large file handling.** Should `batch_read` enforce a per-file or total size limit, or defer that to upstream's existing chunking?
