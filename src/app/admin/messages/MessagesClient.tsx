"use client";

import { useMemo, useState } from "react";

type Msg = {
  id: string;
  createdAt: string;
  lang: "fr" | "en";
  ip?: string;
  ua?: string;
  name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
};

function fmt(dt: string) {
  try {
    return new Date(dt).toLocaleString("fr-FR");
  } catch {
    return dt;
  }
}

export default function MessagesClient({ initial }: { initial: Msg[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return initial;

    return initial.filter((m) => {
      const hay = [
        m.name,
        m.email ?? "",
        m.phone ?? "",
        m.subject,
        m.message,
        m.ip ?? "",
        m.lang,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(s);
    });
  }, [q, initial]);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher (email, sujet, texte, téléphone...)"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div className="text-sm text-slate-600">
          {filtered.length} résultat(s)
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
            Aucun résultat.
          </div>
        ) : (
          filtered.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {m.subject}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {fmt(m.createdAt)} • {m.lang.toUpperCase()}
                    {m.ip ? ` • IP: ${m.ip}` : ""}
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  {m.email ? (
                    <a className="hover:underline" href={`mailto:${m.email}`}>
                      {m.email}
                    </a>
                  ) : (
                    <span>-</span>
                  )}
                  {m.phone ? <div>{m.phone}</div> : null}
                </div>
              </div>

              <div className="mt-4 whitespace-pre-wrap text-sm text-slate-700">
                {m.message}
              </div>

              <div className="mt-4 text-xs text-slate-500">
                <span className="font-medium">Nom:</span> {m.name}
                {m.ua ? (
                  <>
                    {" "}
                    • <span className="font-medium">UA:</span>{" "}
                    {m.ua.slice(0, 120)}
                    {m.ua.length > 120 ? "…" : ""}
                  </>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
