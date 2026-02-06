import fs from "node:fs/promises";
import path from "node:path";
import type { ContactMessage } from "@/lib/message-store";

export async function readMessages(limit = 200): Promise<ContactMessage[]> {
  const file = path.join(process.cwd(), "data", "contact-messages.ndjson");

  try {
    const raw = await fs.readFile(file, "utf8");
    const lines = raw.split("\n").filter(Boolean);

    const parsed: ContactMessage[] = [];
    for (let i = Math.max(0, lines.length - limit); i < lines.length; i++) {
      try {
        parsed.push(JSON.parse(lines[i]) as ContactMessage);
      } catch {
        // ignore corrupted line
      }
    }

    // newest first
    parsed.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return parsed;
  } catch {
    return [];
  }
}
