import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://nexora.cd/sitemap.xml",
    host: "https://nexora.cd",
  };
}
