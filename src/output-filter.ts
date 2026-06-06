export function stripVersionReminder(text: string): string {
  return text.replace(
    /^⚠️ context-mode v[^\n]+ outdated → v[^\n]+ available\. Upgrade: [^\n]+\n\n/,
    "",
  );
}

export function sanitizeUpstreamTextContent(result: unknown): void {
  const content = (result as any)?.content;
  if (!Array.isArray(content)) return;

  for (const item of content) {
    if (item?.type === "text" && typeof item.text === "string") {
      item.text = stripVersionReminder(item.text);
    }
  }
}

export function applySearchReminderFilter(
  result: unknown,
  reminder: false | string,
): void {
  const content = (result as any)?.content;
  if (!Array.isArray(content)) return;

  for (const item of content) {
    if (item?.type !== "text" || typeof item.text !== "string") continue;

    const warningRe = /\n\n⚠ search call #\d+\/\d+ in this window\..+$/s;
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
