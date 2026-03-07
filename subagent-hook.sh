#!/bin/bash
# PreToolUse hook — injects context-mode routing into subagent prompts.
#
# Agent-type-aware routing:
#   claude-code-guide, statusline-setup  →  pass through (no MCP tools)
#   Plan                                 →  research tools, full output
#   Bash                                 →  upgrade to general-purpose + full routing
#   *                                    →  full routing with concise output
#
# Matcher: Task (in .claude/settings.json or .claude/settings.local.json)
# Note: matcher is "Task" but tool_name in the payload is "Agent"
#
# Stdin quirk: jq can't read CC's hook stdin via redirect (jq < /dev/stdin
# exits 1). Use INPUT=$(cat) then pipe: echo "$INPUT" | jq

INPUT=$(cat)

TOOL=$(echo "$INPUT" | jq -r '.tool_name // ""')

if [ "$TOOL" != "Agent" ]; then
  exit 0
fi

SUBAGENT_TYPE=$(echo "$INPUT" | jq -r '.tool_input.subagent_type // ""')

# ── Skip list: agents without MCP tool access ───────────────────────

case "$SUBAGENT_TYPE" in
  claude-code-guide|statusline-setup)
    exit 0
    ;;
esac

# ── Routing blocks ──────────────────────────────────────────────────

FULL_ROUTING_BLOCK='

---
CONTEXT WINDOW PROTECTION — USE CONTEXT-MODE MCP TOOLS

Raw Bash/Read/WebFetch output floods your context. You have context-mode tools that keep data in sandbox.

STEP 1 — GATHER: mcp__context-mode__batch_execute(commands, queries)
  commands: [{label: "Name", command: "shell cmd"}, ...]
  queries: ["query1", "query2", ...] — put 5-8 queries covering everything you need.
  Runs all commands, indexes output, returns search results in one round trip.

STEP 2 — DRILL DOWN: mcp__context-mode__search(queries: ["q1", "q2", "q3", ...])
  If you need more detail, search the indexed content. Batch all queries into one call.

OTHER: execute(language, code, path?) | fetch_and_index(url) + search

PREFER context-mode tools over raw Bash/Read/WebFetch for large outputs.
Bash is fine for git, mkdir, rm, mv, and other mutation commands.

OUTPUT FORMAT — KEEP YOUR FINAL RESPONSE UNDER 500 WORDS:
The parent agent context window is precious. Your full response gets injected into it.

1. ARTIFACTS (PRDs, configs, code files) → Write to FILES, never return as inline text.
   Return only: file path + 1-line description.
2. DETAILED FINDINGS → Index into knowledge base:
   mcp__context-mode__index(content: "...", source: "descriptive-label")
   The parent agent shares the SAME knowledge base and can search() your indexed content.
3. YOUR RESPONSE must be a concise summary:
   - What you did (2-3 bullets)
   - File paths created/modified (if any)
   - Source labels you indexed (so parent can search)
   - Key findings in bullet points
   Do NOT return raw data, full file contents, or lengthy explanations.
---'

PLAN_ROUTING_BLOCK='

---
CONTEXT WINDOW PROTECTION — USE CONTEXT-MODE MCP TOOLS FOR RESEARCH

You have context-mode tools that keep large read outputs in a sandbox instead of flooding your context.

GATHERING INFORMATION:
  mcp__context-mode__batch_execute(commands, queries)
    commands: [{label: "Name", command: "shell cmd"}, ...]
    queries: ["query1", "query2", ...] — put 5-8 queries covering everything you need.
  mcp__context-mode__search(queries: ["q1", "q2", ...])
    Search pre-indexed docs, vault notes, and specs. Batch all queries into one call.
  execute(language, code, path?) — for processing individual files.

Use these for codebase exploration and research. Bash is fine for mutations.

OUTPUT FORMAT:
Return your full plan/analysis as your response. Do NOT compress or summarize —
the parent needs the complete content for review. If you gather raw research data
that is too large for the response, index it via mcp__context-mode__index() for
later retrieval, but the plan itself must be in your response body.
---'

# ── Route by agent type ─────────────────────────────────────────────

case "$SUBAGENT_TYPE" in
  Plan)
    echo "$INPUT" | jq --arg routing "$PLAN_ROUTING_BLOCK" '{
      "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "updatedInput": (.tool_input + { "prompt": (.tool_input.prompt + $routing) })
      }
    }'
    ;;
  Bash)
    echo "$INPUT" | jq --arg routing "$FULL_ROUTING_BLOCK" '{
      "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "updatedInput": (.tool_input + { "prompt": (.tool_input.prompt + $routing), "subagent_type": "general-purpose" })
      }
    }'
    ;;
  *)
    echo "$INPUT" | jq --arg routing "$FULL_ROUTING_BLOCK" '{
      "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "updatedInput": (.tool_input + { "prompt": (.tool_input.prompt + $routing) })
      }
    }'
    ;;
esac
