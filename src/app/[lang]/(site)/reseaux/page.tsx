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
    title: dict.networks.title,
    description: dict.networks.subtitle,
    path: "/reseaux",
  });
}

export default async function NetworksPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <Section title={dict.networks.title} subtitle={dict.networks.subtitle}>
      <FeatureGrid items={SITE.networksByLang[lang]} />
    </Section>
  );
}
