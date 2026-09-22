/**
 * Language primitives.
 *
 * Structured clinical content is stored as a LocalizedString rather than a
 * string: HPO terms, analytes and imaging features are codes, so they render
 * in the reader's language. That is the product thesis — structure is what
 * survives a border — so the demo shows it rather than claiming it.
 */

export type Lang = "en" | "ru";
export const LANGS: Lang[] = ["en", "ru"];
export const LANG_LABEL: Record<Lang, string> = { en: "English", ru: "Русский" };
export const LANG_SHORT: Record<Lang, string> = { en: "EN", ru: "РУ" };

/** A value that exists in both languages. */
export type LS = { en: string; ru: string };

export const ls = (en: string, ru: string): LS => ({ en, ru });

export function pick(value: LS | string, lang: Lang): string {
  return typeof value === "string" ? value : value[lang];
}

/**
 * Russian needs three plural forms, English two.
 * Forms are supplied as "one|few|many" (ru) or "one|other" (en).
 */
export function plural(n: number, forms: string, lang: Lang): string {
  const parts = forms.split("|");
  if (lang === "en") return parts[Math.abs(n) === 1 ? 0 : 1] ?? parts[0];
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return parts[2] ?? parts[0];
  if (d === 1) return parts[0];
  if (d >= 2 && d <= 4) return parts[1] ?? parts[0];
  return parts[2] ?? parts[0];
}
