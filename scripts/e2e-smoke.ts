import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { strict as assert } from "node:assert";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main(): Promise<void> {
  const root = mkdtempSync(join(tmpdir(), "cw-e2e-"));
  const cwd = join(root, "worktrees", "feature");

  mkdirSync(join(cwd, ".claude"), { recursive: true });
  mkdirSync(join(cwd, "docs"), { recursive: true });

  writeFileSync(join(cwd, "hello.md"), "# Alpha\n\nprewarm-token-xyz\n");
  writeFileSync(
    join(cwd, "docs", "guide.md"),
    "---\ntitle: Guide\n---\n\n# Guide\n\nfolder-token-abc\n",
  );
  writeFileSync(
    join(cwd, ".claude", "context-mode.json"),
    JSON.stringify(
      {
        sources: [
          {
            label: "vault",
            path: cwd,
            glob: "*.md",
            recursive: false,
            stripFrontmatter: true,
          },
        ],
      },
      null,
      2,
    ),
  );

  const transport = new StdioClientTransport({
    command: "node",
    args: [join(process.cwd(), "wrapper.bundle.mjs")],
    cwd,
    stderr: "inherit",
    env: { ...(process.env as Record<string, string>), PWD: cwd },
  });

  const client = new Client({ name: "context-wrapper-e2e", version: "0.0.0" });

  try {
    await client.connect(transport);

    const { tools } = await client.listTools();
    const toolNames = tools.map((t) => t.name).sort();
    assert.deepEqual(toolNames, [
      "batch_execute",
      "batch_read",
      "execute",
      "fetch_and_index",
      "index",
      "search",
    ]);

    const prewarm = await client.callTool({
      name: "search",
      arguments: { queries: ["prewarm-token-xyz"], limit: 3 },
    });
    const prewarmText = (prewarm as any).content?.[0]?.text ?? "";
    assert.match(prewarmText, /prewarm-token-xyz/);
    assert.match(prewarmText, /vault: hello\.md/);

    const exec = await client.callTool({
      name: "execute",
      arguments: { language: "shell", code: "pwd" },
    });
    const execText = (exec as any).content?.[0]?.text ?? "";
    assert.equal(execText.trim(), cwd);

    const index = await client.callTool({
      name: "index",
      arguments: { path: "docs", source: "docs-src" },
    });
    const indexText = (index as any).content?.[0]?.text ?? "";
    assert.match(indexText, /Indexed 1 file \(1 chunks\)/);

    const search = await client.callTool({
      name: "search",
      arguments: { queries: ["folder-token-abc"], source: "docs-src", limit: 3 },
    });
    const searchText = (search as any).content?.[0]?.text ?? "";
    assert.match(searchText, /folder-token-abc/);
    assert.match(searchText, /docs-src: guide\.md/);
    assert.doesNotMatch(searchText, /title: Guide/);

    const batchRead = await client.callTool({
      name: "batch_read",
      arguments: {
        files: ["hello.md", "docs/guide.md"],
        queries: ["prewarm-token-xyz", "folder-token-abc"],
      },
    });
    const batchReadText = (batchRead as any).content?.[0]?.text ?? "";
    assert.match(batchReadText, /prewarm-token-xyz/);
    assert.match(batchReadText, /folder-token-abc/);
    assert.match(batchReadText, /Batch ID:/);
    assert.match(batchReadText, /hello\.md/);
    assert.match(batchReadText, /guide\.md/);

    console.log("e2e smoke: ok");
  } finally {
    await client.close().catch(() => {});
    rmSync(root, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
