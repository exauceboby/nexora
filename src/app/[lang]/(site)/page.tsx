import type { Lang } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SITE } from "@/content/site";
import Section from "@/components/site/Section";
import Hero from "@/components/site/Hero";
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
    title: dict.meta.defaultTitle,
    description: dict.meta.defaultDescription,
    path: "/",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Hero
        title={dict.home.heroTitle}
        subtitle={dict.home.heroSubtitle}
        primaryHref={`/${lang}/contact`}
        primaryLabel={dict.cta.quote}
        secondaryHref={`/${lang}/services`}
        secondaryLabel={dict.nav.services}
      />

      <Section title={dict.home.highlightsTitle}>
        <FeatureGrid items={SITE.servicesByLang[lang]} />
      </Section>
    </>
  );
}
