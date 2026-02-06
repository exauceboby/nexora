import type { Lang } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SITE } from "@/content/site";
import Section from "@/components/site/Section";
import FeatureGrid from "@/components/site/FeatureGrid";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return pageMeta({
    lang,
    title: dict.services.title,
    description: dict.services.subtitle,
    path: "/services",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <Section title={dict.services.title} subtitle={dict.services.subtitle}>
      <FeatureGrid items={SITE.servicesByLang[lang]} />
    </Section>
  );
}
