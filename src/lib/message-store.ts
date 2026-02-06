import fs from "node:fs/promises";
import path from "node:path";

export type ContactMessage = {
  id: string;
  createdAt: string; // ISO
  lang: "fr" | "en";
  ip?: string;
  ua?: string;

  name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
};

function uid(): string {
  // simple uid (pas besoin de crypto ici)
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function storeMessage(input: Omit<ContactMessage, "id" | "createdAt">) {
  const record: ContactMessage = {
    id: uid(),
    createdAt: new Date().toISOString(),
    ...input,
  };

  const dir = path.join(process.cwd(), "data");
  const file = path.join(dir, "contact-messages.ndjson");

  await fs.mkdir(dir, { recursive: true });
  await fs.appendFile(file, JSON.stringify(record) + "\n", "utf8");

  return record;
}
