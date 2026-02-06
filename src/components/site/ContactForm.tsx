"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/i18n/config";

type Dict = {
  contact: {
    form: {
      name: string;
      phone: string;
      email: string;
      subject: string;
      message: string;
      send: string;
      sending: string;
      success: string;
      error: string;
    };
  };
};

export default function ContactForm({
  dict,
  lang,
}: {
  dict: Dict;
  lang: Lang;
}) {
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);

  const endpoint = useMemo(() => "/api/contact", []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState(null);
    setPending(true);

    try {
      const form = e.currentTarget;
      const fd = new FormData(form);

      const payload = {
        lang: lang === "en" ? "en" : "fr",
        name: String(fd.get("name") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        email: String(fd.get("email") ?? ""),
        subject: String(fd.get("subject") ?? ""),
        message: String(fd.get("message") ?? ""),
        company: String(fd.get("company") ?? ""), // honeypot
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as { ok: boolean; message: string };

      if (json.ok) {
        setState({ ok: true, message: dict.contact.form.success });
        form.reset();
      } else {
        setState({ ok: false, message: json.message || dict.contact.form.error });
      }
    } catch {
      setState({ ok: false, message: dict.contact.form.error });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Honeypot */}
        <input name="company" tabIndex={-1} autoComplete="off" className="hidden" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-700">
              {dict.contact.form.name} *
            </label>
            <input
              name="name"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">
              {dict.contact.form.phone}
            </label>
            <input
              name="phone"
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700">
            {dict.contact.form.email}
          </label>
          <input
            name="email"
            type="email"
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700">
            {dict.contact.form.subject} *
          </label>
          <input
            name="subject"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700">
            {dict.contact.form.message} *
          </label>
          <textarea
            name="message"
            required
            rows={5}
            className="mt-1 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {pending ? dict.contact.form.sending : dict.contact.form.send}
          </button>

          {state?.message ? (
            <div className={state.ok ? "text-sm text-emerald-700" : "text-sm text-rose-700"}>
              {state.message}
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}
