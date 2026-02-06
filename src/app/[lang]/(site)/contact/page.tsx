import type { Lang } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SITE } from "@/content/site";
import Section from "@/components/site/Section";
import ContactCards from "@/components/site/ContactCards";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import ContactForm from "@/components/site/ContactForm";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return pageMeta({
    lang,
    title: dict.contact.title,
    description: dict.contact.subtitle,
    path: "/contact",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <Section title={dict.contact.title} subtitle={dict.contact.subtitle}>
      <ContactCards
        dict={dict}
        lang={lang}
        phones={SITE.contacts.phones}
        email={SITE.contacts.email}
        location={SITE.contacts.locationByLang[lang]}
      />
      <div className="mt-6">
        <ContactForm dict={dict as any} lang={lang} />

      </div>

    </Section>
  );
}
