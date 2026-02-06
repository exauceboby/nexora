import type { MetadataRoute } from "next";
import { LANGS } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nexora.cd";

  const paths = ["", "/services", "/reseaux", "/boutique", "/contact"];

  const items: MetadataRoute.Sitemap = [];
  for (const lang of LANGS) {
    for (const p of paths) {
      items.push({
        url: `${base}/${lang}${p}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: p === "" ? 1 : 0.7,
      });
    }
  }
  return items;
}
