import type { Lang } from "@/i18n/config";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;

  return (
    <div data-lang={lang} className="min-h-dvh">
      {children}
    </div>
  );
}
