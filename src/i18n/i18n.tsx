"use client";

import * as React from "react";
import { dict, type DictKey } from "./dict";
import { content } from "./content";
import { LANGS, plural, pick, type Lang, type LS } from "./lang";

const STORAGE_KEY = "odyssey.lang";

export type Params = Record<string, string | number>;

/**
 * Interpolates {name} placeholders and {p:one|few|many} plural forms.
 * Plural forms use the `n` parameter, or `count` if present.
 */
export function format(template: string, params: Params | undefined, lang: Lang): string {
  if (!params) return template.replace(/\{p:[^}]*\}/g, "");
  const n = Number(params.count ?? params.n ?? 0);
  return template
    .replace(/\{p:([^}]*)\}/g, (_, forms: string) => plural(n, forms, lang))
    .replace(/\{(\w+)\}/g, (m, key: string) => (key in params ? String(params[key]) : m));
}

/** Lower-cases the first letter unless the word is an acronym. */
const lowerFirst = (s: string) => (/^[A-ZА-Я]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));

/** "a, b and c" / "a, b и c" */
function listJoin(items: string[], lang: Lang): string {
  if (items.length <= 1) return items[0] ?? "";
  const last = items[items.length - 1];
  return `${items.slice(0, -1).join(", ")} ${lang === "ru" ? "и" : "and"} ${last}`;
}

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a dictionary key. */
  t: (key: DictKey, params?: Params) => string;
  /** Resolve a LocalizedString (or plain string) stored in the data. */
  L: (value: LS | string) => string;
  /** Translate a key that is only known at runtime; falls back to the raw value. */
  tt: (key: string, params?: Params) => string;
  /** Translate a piece of seeded clinical content. */
  C: (value: string) => string;
  /** Translate each item of clinical content and join it as a list. */
  CList: (values: string[]) => string;
  /** Render a phrase produced by the matching engine. */
  P: (phrase: Phrase) => string;
};

/** A translatable sentence assembled by non-React code (the matching engine). */
export type Phrase = {
  key: string;
  params?: Params;
  /** Params whose values are clinical content that must be translated and list-joined. */
  lists?: Record<string, string[]>;
  listsLower?: Record<string, string[]>;
};

const I18nContext = React.createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en");

  React.useEffect(() => {
    let next: Lang | null = null;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && (LANGS as string[]).includes(stored)) next = stored as Lang;
    } catch { /* storage unavailable */ }
    if (!next && typeof navigator !== "undefined" && /^ru\b/i.test(navigator.language || "")) next = "ru";
    if (next) setLangState(next);
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    try { window.localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);

  const value = React.useMemo<Ctx>(() => {
    const raw = (key: string) => (dict as Record<string, LS | undefined>)[key];
    return {
      lang,
      setLang,
      t: (key, params) => format(dict[key][lang], params, lang),
      tt: (key, params) => {
        const entry = raw(key);
        return entry ? format(entry[lang], params, lang) : key;
      },
      L: (v) => pick(v, lang),
      C: (v) => content(v, lang),
      CList: (vs) => listJoin(vs.map((v) => content(v, lang)), lang),
      P: (phrase) => {
        const entry = raw(phrase.key);
        if (!entry) return phrase.key;
        const merged: Params = { ...phrase.params };
        // Sub-clauses are marked with a sentinel so they can be translated too.
        for (const [k, v] of Object.entries(merged)) {
          if (typeof v === "string" && v.startsWith("\u0000")) {
            const sub = raw(`${phrase.key.split(".")[0]}.${phrase.key.split(".")[1]}${v.slice(1).replace(/^./, (c) => c.toUpperCase())}`);
            merged[k] = sub ? sub[lang] : "";
          }
        }
        for (const [k, vs] of Object.entries(phrase.lists ?? {})) {
          merged[k] = listJoin(vs.map((v) => content(v, lang)), lang);
        }
        for (const [k, vs] of Object.entries(phrase.listsLower ?? {})) {
          merged[k] = listJoin(vs.map((v) => lowerFirst(content(v, lang))), lang);
        }
        return format(entry[lang], merged, lang);
      },
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

/** Relative time, localised. */
export function useRelTime() {
  const { t } = useI18n();
  return React.useCallback((at: number, now: number) => {
    const d = Math.max(0, now - at);
    const m = Math.round(d / 60000);
    if (m < 1) return t("common.justNow");
    if (m < 60) return t("common.minAgo", { n: m });
    const h = Math.round(m / 60);
    if (h < 24) return t("common.hAgo", { n: h });
    const days = Math.round(h / 24);
    if (days === 1) return t("common.yesterday");
    if (days < 30) return t("common.dAgo", { n: days });
    return new Date(at).toISOString().slice(0, 10);
  }, [t]);
}
