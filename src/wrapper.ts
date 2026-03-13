/**
 * context-wrapper — Middleman MCP server for context-mode.
 *
 * Architecture:
 *   Claude Code ↔ Our Server (stdin/stdout) ↔ [MCP Client → child] ↔ Upstream Server
 *
 * Pre-warms the FTS5 database before connecting, so search() works immediately.
 * Renames tools (drops ctx_ prefix), merges execute + execute_file, hides
 * stats/doctor/upgrade.
 *
 * Uses the low-level Server class (not McpServer) so we can pass raw JSON
 * schemas through the proxy without converting to zod types.
 */

import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { findConfig, prewarm } from "./prewarm.ts";

// ── Tool Mapping ────────────────────────────────────────────────────

/** Tools we expose to Claude Code. Maps our name → upstream ctx_ name. */
const TOOL_MAP: Record<string, string> = {
  execute: "ctx_execute",
  index: "ctx_index",
  search: "ctx_search",
  fetch_and_index: "ctx_fetch_and_index",
  batch_execute: "ctx_batch_execute",
};

/** Reverse lookup: upstream name → our name. */
const REVERSE_MAP = new Map(
  Object.entries(TOOL_MAP).map(([ours, upstream]) => [upstream, ours]),
);

/** Tools hidden from Claude Code entirely. */
const HIDDEN = new Set(["ctx_stats", "ctx_doctor", "ctx_upgrade"]);

// ── Main ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // 1. Resolve the upstream server bundle relative to our install location,
  //    not CWD — the wrapper may be invoked from any project directory.
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const wrapperRoot = __dirname.endsWith("/src")
    ? dirname(__dirname) // dev: src/wrapper.ts → project root
    : __dirname; // bundle: wrapper.bundle.mjs at project root
  const bundlePath = join(
    wrapperRoot,
    "node_modules",
    "context-mode",
    "server.bundle.mjs",
  );

  // 2. Spawn the upstream server as a subprocess
  const clientTransport = new StdioClientTransport({
    command: "node",
    args: [bundlePath],
    env: {
      ...(process.env as Record<string, string>),
    },
    stderr: "inherit",
  });

  // 3. Connect MCP client — this starts the subprocess and runs the
  //    MCP initialize handshake. The upstream ContentStore is lazy
  //    (created on first tool call), so we can pre-warm after connect.
  const client = new Client({ name: "context-wrapper", version: "0.2.0" });
  await client.connect(clientTransport);

  const upstreamPid = clientTransport.pid;
  if (!upstreamPid) {
    throw new Error("Failed to get upstream server PID");
  }
  process.stderr.write(
    `[context-wrapper] Connected to upstream server (pid ${upstreamPid})\n`,
  );

  // 4. Pre-warm the database at the subprocess PID path.
  //    Safe because getStore() hasn't been called yet — no tool calls
  //    have arrived. Our data will be waiting when the store opens.
  const configResult = findConfig(process.cwd());
  if (configResult) {
    const dbPath = join(tmpdir(), `context-mode-${upstreamPid}.db`);
    const start = performance.now();
    const result = prewarm(configResult.config, dbPath);
    const elapsed = (performance.now() - start).toFixed(0);
    process.stderr.write(
      `[context-wrapper] Pre-warmed ${result.totalChunks} chunks from ` +
        `${result.totalSources} files in ${elapsed}ms\n`,
    );
  }

  // 5. Fetch the upstream tool list and build our remapped version.
  //    We do this once at startup; the list is static.
  const { tools: upstreamTools } = await client.listTools();

  // Find the execute_file tool — we merge its `path` param into execute
  const executeFileTool = upstreamTools.find(
    (t) => t.name === "ctx_execute_file",
  );

  // Build our tool list with remapped names
  const ourTools = upstreamTools
    .filter((t) => !HIDDEN.has(t.name))
    .filter((t) => t.name !== "ctx_execute_file") // merged into execute
    .filter((t) => REVERSE_MAP.has(t.name))
    .map((t) => {
      const ourName = REVERSE_MAP.get(t.name)!;

      if (ourName === "execute" && executeFileTool) {
        // Merge execute + execute_file
        const mergedProperties = {
          ...(t.inputSchema.properties ?? {}),
        };
        if (executeFileTool.inputSchema.properties?.path) {
          mergedProperties.path = executeFileTool.inputSchema.properties.path;
        } else {
          mergedProperties.path = {
            type: "string",
            description:
              "Absolute file path or relative to project root. When provided, " +
              "reads this file into a FILE_CONTENT variable inside the sandbox — " +
              "file contents stay in sandbox, only your printed output enters context.",
          };
        }

        return {
          ...t,
          name: ourName,
          description:
            (t.description ?? "") +
            "\n\nWhen `path` is provided, reads the file at that path into a " +
            "FILE_CONTENT variable inside the sandbox. The full file contents do " +
            "NOT enter context — only what you print. Use instead of Read/cat for " +
            "log files, data files, large source files, or any file where you need " +
            "to extract specific information rather than read the entire content.",
          inputSchema: {
            ...t.inputSchema,
            properties: mergedProperties,
          },
        };
      }

      return { ...t, name: ourName };
    });

  // 6. Create our low-level MCP server
  const server = new Server(
    { name: "context-wrapper", version: "0.2.0" },
    { capabilities: { tools: {} } },
  );

  // Handle tools/list — return our pre-built remapped list
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: ourTools,
  }));

  // Handle tools/call — map name back to upstream and forward
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    // Route execute with path → ctx_execute_file
    let upstreamName: string;
    if (name === "execute" && args?.path !== undefined) {
      upstreamName = "ctx_execute_file";
    } else {
      upstreamName = TOOL_MAP[name];
    }

    if (!upstreamName) {
      return {
        content: [{ type: "text" as const, text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }

    const result = await client.callTool({
      name: upstreamName,
      arguments: args,
    });

    // Intercept search responses when searchReminder is configured
    if (
      name === "search" &&
      configResult?.config.searchReminder !== undefined
    ) {
      const reminder = configResult.config.searchReminder;
      const content = (result as any).content;
      if (Array.isArray(content)) {
        for (const item of content) {
          if (item.type !== "text" || typeof item.text !== "string") continue;

          // Warning: appended to real results after throttle threshold
          const warningRe = /\n\n⚠ search call #\d+\/\d+ in this window\..+$/s;
          // Block: entire text is the refusal message
          const blockRe = /^BLOCKED: \d+ search calls in \d+s\..+$/s;

          if (warningRe.test(item.text)) {
            item.text =
              reminder === false
                ? item.text.replace(warningRe, "")
                : item.text.replace(warningRe, `\n\n${reminder}`);
          } else if (blockRe.test(item.text)) {
            item.text = reminder === false ? "" : String(reminder);
          }
        }
      }
    }

    return result as any;
  });

  // 7. Connect our server to Claude Code's stdio
  const serverTransport = new StdioServerTransport();
  await server.connect(serverTransport);
  process.stderr.write(
    `[context-wrapper] MCP server ready (${ourTools.length} tools)\n`,
  );

  // 8. Graceful shutdown
  //
  //    When CC disconnects, stdin reaches EOF. The MCP SDK's
  //    StdioServerTransport doesn't listen for 'end', so without
  //    this handler both our process and the upstream child idle
  //    forever as zombies.
  const shutdown = async () => {
    await Promise.allSettled([client.close(), server.close()]);
  };

  // CC disconnect → stdin EOF
  process.stdin.on("end", () => process.exit(0));

  // Interactive / external signals
  process.on("SIGINT", async () => {
    await shutdown();
    process.exit(0);
  });
  process.on("SIGTERM", async () => {
    await shutdown();
    process.exit(0);
  });

  // Last-resort sync cleanup — process.kill() is synchronous so
  // it works inside the 'exit' handler where async can't complete.
  process.on("exit", () => {
    try {
      process.kill(upstreamPid);
    } catch {
      /* already dead */
    }
  });
}

main().catch((err) => {
  process.stderr.write(
    `[context-wrapper] Fatal: ${err.message}\n${err.stack}\n`,
  );
  process.exit(1);
});
