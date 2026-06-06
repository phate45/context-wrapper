import { strict as assert } from "node:assert";
import {
  applySearchReminderFilter,
  sanitizeUpstreamTextContent,
  stripVersionReminder,
} from "../src/output-filter.ts";

function main(): void {
  const prefixed =
    "⚠️ context-mode v1.0.151 outdated → v1.0.162 available. Upgrade: /ctx-upgrade\n\n" +
    "real payload";
  assert.equal(stripVersionReminder(prefixed), "real payload");
  assert.equal(stripVersionReminder("already clean"), "already clean");

  const combined = {
    content: [
      {
        type: "text",
        text:
          "⚠️ context-mode v1.0.151 outdated → v1.0.162 available. Upgrade: /ctx-upgrade\n\n" +
          "answer body\n\n" +
          "⚠ search call #4/8 in this window. Results are throttled after the third call.",
      },
      { type: "text", text: "untouched secondary payload" },
    ],
  };

  sanitizeUpstreamTextContent(combined);
  applySearchReminderFilter(combined, false);

  assert.equal(combined.content[0].text, "answer body");
  assert.equal(combined.content[1].text, "untouched secondary payload");

  const replaced = {
    content: [
      {
        type: "text",
        text:
          "⚠️ context-mode v1.0.151 outdated → v1.0.162 available. Upgrade: /ctx-upgrade\n\n" +
          "answer body\n\n" +
          "⚠ search call #4/8 in this window. Results are throttled after the third call.",
      },
    ],
  };

  sanitizeUpstreamTextContent(replaced);
  applySearchReminderFilter(replaced, "custom reminder");
  assert.equal(replaced.content[0].text, "answer body\n\ncustom reminder");

  console.log("output filter smoke: ok");
}

main();
