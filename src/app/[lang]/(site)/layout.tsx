import type { Lang } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LoadingProvider from "@/components/site/loading/LoadingProvider";
import LoadingOverlay from "@/components/site/loading/LoadingOverlay";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <LoadingProvider>
      <div className="flex min-h-dvh flex-col">
        <LoadingOverlay />
        <Header lang={lang} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer dict={dict} />
      </div>
    </LoadingProvider>
  );
}
