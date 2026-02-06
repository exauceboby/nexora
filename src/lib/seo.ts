import type { Metadata } from "next";
import type { Lang } from "@/i18n/config";
import { SITE } from "@/content/site";

export function pageMeta(params: {
  lang: Lang;
  title: string;
  description: string;
  path: string; // ex: "/services"
}): Metadata {
  const { lang, title, description, path } = params;

  const canonical = `${SITE.domain}/${lang}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fr: `/fr${path === "/" ? "" : path}`,
        en: `/en${path === "/" ? "" : path}`,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: SITE.brand,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
