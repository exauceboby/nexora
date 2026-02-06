import type { Dictionary } from "@/i18n/get-dictionary";
import type { Lang } from "@/i18n/config";
import { defaultWhatsappText, telHref, waHref } from "@/lib/contacts";

export default function ContactCards({
  dict,
  lang,
  phones,
  email,
  location,
}: {
  dict: Dictionary;
  lang: Lang;
  phones: string[];
  email: string;
  location: string;
}) {

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold">{dict.contact.phones}</div>
        <ul className="mt-3 space-y-3 text-sm text-slate-700">
          {phones.map((p) => (
            <li key={p} className="flex flex-col gap-2">
              <div className="font-medium">{p}</div>
              <div className="flex flex-wrap gap-2">
                <a
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50"
                  href={telHref(p)}
                >
                  {dict.cta.call}
                </a>
                <a
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50"
                  href={waHref(p, defaultWhatsappText(lang))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dict.contact.whatsapp}
                </a>
              </div>
            </li>
          ))}
        </ul>

      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold">{dict.contact.email}</div>
        <div className="mt-3 flex flex-col gap-2 text-sm text-slate-700">
          <a className="hover:underline" href={`mailto:${email}`}>
            {email}
          </a>

          <a
            className="w-fit rounded-lg border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50"
            href={`mailto:${email}`}
          >
            {dict.cta.email}
          </a>
        </div>

      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold">{dict.contact.location}</div>
        <div className="mt-3 text-sm text-slate-700">{location}</div>
      </div>
    </div>
  );
}
