import type { Dictionary } from "@/i18n/get-dictionary";

export default function Footer({ dict }: { dict: Dictionary }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="text-sm text-slate-600">
          © {year} {dict.meta.siteName}. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
