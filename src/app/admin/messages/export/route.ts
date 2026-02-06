import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const file = path.join(process.cwd(), "data", "contact-messages.ndjson");

  try {
    const content = await fs.readFile(file, "utf8");
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Content-Disposition": `attachment; filename="contact-messages.ndjson"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("", {
      status: 200,
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Content-Disposition": `attachment; filename="contact-messages.ndjson"`,
        "Cache-Control": "no-store",
      },
    });
  }
}
