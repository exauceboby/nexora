import { readMessages } from "@/lib/message-reader";
import MessagesClient from "./MessagesClient";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await readMessages(800);

  return (
    <main className="min-h-dvh bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Admin — Messages
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {messages.length} message(s) stocké(s).
            </p>
          </div>

          <a
            href="/admin/messages/export"
            className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Télécharger NDJSON
          </a>
        </div>

        <MessagesClient initial={messages} />
      </div>
    </main>
  );
}
