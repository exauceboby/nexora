import type { Lang } from "./config";
import { fr } from "./dictionaries/fr";
import { en } from "./dictionaries/en";

export type Dictionary = typeof fr;

export async function getDictionary(lang: Lang): Promise<Dictionary> {
  // Server-side: zero duplication, zero runtime fetch
  return lang === "en" ? (en as Dictionary) : (fr as Dictionary);
}
