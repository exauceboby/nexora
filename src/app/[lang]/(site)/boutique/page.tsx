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
    title: dict.shop.title,
    description: dict.shop.subtitle,
    path: "/boutique",
  });
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <Section title={dict.shop.title} subtitle={dict.shop.subtitle}>
      <FeatureGrid items={SITE.shopByLang[lang]} />
    </Section>
  );
}
