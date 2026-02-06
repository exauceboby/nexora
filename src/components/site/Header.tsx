"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { Lang } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { SITE } from "@/content/site";
import { waHref, defaultWhatsappText } from "@/lib/contacts";
import Logo from "@/assets/logo.png";

function stripLang(pathname: string, lang: Lang) {
  const prefix = `/${lang}`;
  if (pathname === prefix) return "/";
  return pathname.startsWith(prefix) ? pathname.slice(prefix.length) || "/" : pathname;
}

export default function Header({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = useMemo(
    () => [
      { href: `/${lang}`, label: dict.nav.home },
      { href: `/${lang}/services`, label: dict.nav.services },
      { href: `/${lang}/reseaux`, label: dict.nav.networks },
      { href: `/${lang}/boutique`, label: dict.nav.shop },
      { href: `/${lang}/contact`, label: dict.nav.contact },
    ],
    [lang, dict]
  );

  const current = pathname || `/${lang}`;

  const switchTo = (target: Lang) => {
    const rest = stripLang(current, lang);
    return `/${target}${rest === "/" ? "" : rest}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#021231]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        {/* Brand */}
        <Link
          href={`/${lang}`}
          className="group flex items-center gap-3"
          aria-label="NEXORA TECHNOLOGIES & NETWORKS"
          onClick={() => setOpen(false)}
        >
          {/* Mobile: icon bigger */}
          <div className="relative h-12 w-12 sm:hidden">
            <Image
              src={Logo}
              alt="Nexora logo"
              fill
              className="object-contain nexora-float"
              priority
            />
          </div>

          {/* Desktop: full logo bigger + glow on hover */}
          <div className="relative hidden h-11 w-[280px] sm:block">
            <Image
              src={Logo}
              alt="NEXORA TECHNOLOGIES & NETWORKS"
              fill
              className="object-contain nexora-float group-hover:nexora-glow"
              priority
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => {
            const active = current === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active
                    ? "text-sm font-medium text-white"
                    : "text-sm text-white/70 hover:text-white"
                }
              >
                {l.label}
              </Link>
            );
          })}

          <div className="h-6 w-px bg-white/15" />

          <Link
            href={`/${lang}/contact`}
            className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
          >
            {dict.cta.quote}
          </Link>
          <a
            href={waHref(SITE.contacts.phones[0], defaultWhatsappText(lang))}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {dict.cta.whatsapp}
          </a>

          <div className="flex items-center gap-2">
            <Link
              href={switchTo("fr")}
              className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10 hover:text-white"
            >
              FR
            </Link>
            <Link
              href={switchTo("en")}
              className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10 hover:text-white"
            >
              EN
            </Link>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          Menu
        </button>
      </div>

      {/* Mobile dropdown */}
      {open ? (
        <div className="border-t border-white/10 bg-[#021231] md:hidden">
          <div className="mx-auto w-full max-w-6xl px-4 py-4">
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-white/80 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}

              <div className="mt-2 flex gap-2">
                <Link
                  href={switchTo("fr")}
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 hover:text-white"
                >
                  FR
                </Link>
                <Link
                  href={switchTo("en")}
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 hover:text-white"
                >
                  EN
                </Link>
                <a
                  href={waHref(SITE.contacts.phones[0], defaultWhatsappText(lang))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  {dict.cta.whatsapp}
                </a>

              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
