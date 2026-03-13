#!/usr/bin/env node
/**
 * PreToolUse hook — injects context-mode routing into subagent prompts.
 *
 * Custom profiles in .claude/context-mode.json override defaults:
 *   { "subagentProfiles": { "<type>": { skip, ending, block } } }
 *
 * Default routing (when no profile matches):
 *   claude-code-guide, statusline-setup  →  pass through (no MCP tools)
 *   Plan                                 →  research tools, full output
 *   Bash                                 →  upgrade to general-purpose + full routing
 *   *                                    →  full routing with concise output
 *
 * Matcher: "Task" in settings, but tool_name arrives as "Agent".
 * Run via: node /path/to/subagent-hook.mjs
 */

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

// ── Routing block fragments ──────────────────────────────────────
// Shared core + composable endings. Plan agents get full output;
// all others get the 500-word cap + dead-drop pattern.

const CORE_BLOCK = `
<context_window_protection>
  <priority_instructions>
    Raw Bash/Read/WebFetch output floods your context window.
    You MUST use context-mode MCP tools to keep raw data in the sandbox.
  </priority_instructions>

  <tool_selection_hierarchy>
    1. GATHER: mcp__context-mode__batch_execute(commands, queries)
       - Primary research tool. Runs all commands, auto-indexes, and searches in ONE call.
       - commands: [{label: "Name", command: "shell cmd"}, ...]
       - queries: ["q1", "q2", ...] — 5-8 queries covering everything you need.
    2. DRILL DOWN: mcp__context-mode__search(queries: ["q1", "q2", ...])
       - Follow-up queries against indexed content. Batch all queries into one call.
    3. PROCESS: mcp__context-mode__execute(language, code, path?)
       - API calls, log analysis, data processing. Only stdout enters context.
    4. FETCH: mcp__context-mode__fetch_and_index(url) + search()
       - Web content. Fetches, converts to markdown, indexes. Raw page never enters context.
  </tool_selection_hierarchy>

  <forbidden_actions>
    - DO NOT use Bash for commands producing large output — use batch_execute or execute.
    - DO NOT use Read for analysis — use execute(path). Read IS correct for files you intend to Edit.
    - DO NOT use WebFetch — use fetch_and_index instead.
    - Bash is ONLY for: git, mkdir, rm, mv, and other short-output mutation commands.
  </forbidden_actions>`;

const ENDING_CONCISE = `
  <output_constraints>
    <word_limit>Keep your final response under 500 words.</word_limit>
    <artifact_policy>
      Write artifacts (code, configs, PRDs) to FILES, never return as inline text.
      Return only: file path + 1-line description.
    </artifact_policy>
    <dead_drop>
      For detailed findings, index into the shared knowledge base:
      mcp__context-mode__index(content: "...", source: "descriptive-label")
      The parent agent shares the SAME knowledge base and can search() your indexed content.
    </dead_drop>
    <response_format>
      Your response must be a concise summary:
      - What you did (2-3 bullets)
      - File paths created/modified (if any)
      - Source labels you indexed (so parent can search)
      - Key findings in bullet points
      Do NOT return raw data, full file contents, or lengthy explanations.
    </response_format>
  </output_constraints>
</context_window_protection>`;

const ENDING_PLAN = `
  <output_constraints>
    <plan_output>
      Return your full plan/analysis as your response. Do NOT compress or summarize —
      the parent needs the complete content for review.
    </plan_output>
    <overflow_policy>
      If raw research data is too large for the response, index it via
      mcp__context-mode__index(content, source) for later retrieval.
      The plan itself must be in your response body.
    </overflow_policy>
  </output_constraints>
</context_window_protection>`;

const FULL_ROUTING_BLOCK = CORE_BLOCK + ENDING_CONCISE;
const PLAN_ROUTING_BLOCK = CORE_BLOCK + ENDING_PLAN;

const ENDINGS = { plan: ENDING_PLAN, concise: ENDING_CONCISE };

// ── Config Discovery ─────────────────────────────────────────────

function findConfig(startDir) {
  let dir = resolve(startDir);
  while (true) {
    try {
      return JSON.parse(readFileSync(join(dir, ".claude", "context-mode.json"), "utf-8"));
    } catch { /* not found */ }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

// ── Skip list: agents without MCP tool access ────────────────────

const SKIP_TYPES = new Set(["claude-code-guide", "statusline-setup"]);

// ── Main ─────────────────────────────────────────────────────────

let raw;
try {
  raw = readFileSync(0, "utf-8");
} catch {
  process.exit(0);
}

let input;
try {
  input = JSON.parse(raw);
} catch {
  process.exit(0);
}

const toolName = input.tool_name ?? "";
const toolInput = input.tool_input ?? {};
const subagentType = toolInput.subagent_type ?? "";

if (toolName !== "Agent") process.exit(0);

// Check for custom profile override (takes priority over hardcoded defaults)
const config = findConfig(process.cwd());
const profile = config?.subagentProfiles?.[subagentType];

if (profile) {
  if (profile.skip) process.exit(0);

  let routing;
  if (profile.block) {
    routing = profile.block;
  } else if (profile.ending && ENDINGS[profile.ending]) {
    routing = CORE_BLOCK + ENDINGS[profile.ending];
  } else {
    routing = FULL_ROUTING_BLOCK;
  }

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      updatedInput: {
        ...toolInput,
        prompt: (toolInput.prompt ?? "") + routing,
      },
    },
  }));
  process.exit(0);
}

if (SKIP_TYPES.has(subagentType)) process.exit(0);

// Select routing block
const routing = subagentType === "Plan" ? PLAN_ROUTING_BLOCK : FULL_ROUTING_BLOCK;

// Build updated input
const updatedInput = {
  ...toolInput,
  prompt: (toolInput.prompt ?? "") + routing,
};

// Upgrade Bash subagents to general-purpose for MCP access
if (subagentType === "Bash") {
  updatedInput.subagent_type = "general-purpose";
}

const response = {
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    updatedInput,
  },
};

process.stdout.write(JSON.stringify(response));
