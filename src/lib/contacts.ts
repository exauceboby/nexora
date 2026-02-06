import type { Lang } from "@/i18n/config";

export function normalizePhone(phone: string): string {
  // garde + et chiffres, supprime espaces / tirets / parenthèses
  return phone.replace(/[^\d+]/g, "");
}

export function telHref(phone: string): string {
  return `tel:${normalizePhone(phone)}`;
}

export function waHref(phone: string, text: string): string {
  // wa.me exige uniquement les chiffres (sans +)
  const digits = normalizePhone(phone).replace(/^\+/, "");
  const q = encodeURIComponent(text);
  return `https://wa.me/${digits}?text=${q}`;
}

export function defaultWhatsappText(lang: Lang): string {
  return lang === "en"
    ? "Hello NEXORA, I would like a quote and more details about your services."
    : "Bonjour NEXORA, je souhaite un devis et plus de détails sur vos services.";
}
