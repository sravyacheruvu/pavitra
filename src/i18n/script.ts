import Sanscript from "@indic-transliteration/sanscript";
import type { UILang, LangText } from "./index";

/**
 * Script localization for Sanskrit proper nouns and liturgical text.
 *
 * Deity names, panchang angas (tithi, nakshatra, yoga, karana, masa,
 * samvatsara…), mantras and festival names are the SAME word in every
 * language — only the script differs. Rather than hand-translate each into ten
 * languages, we keep one Sanskrit source (Devanagari, or IAST for mantras) and
 * transliterate it into the reader's script at render time. This is mechanical
 * and exact, so a Tamil user sees தமிழ் akshara and a Bengali user sees বাংলা
 * for the same term, with no translation guesswork.
 */

/** Target Brahmic script per UI language (null = keep the roman/IAST source). */
const SCRIPT: Record<UILang, string | null> = {
  en: null,
  hi: "devanagari",
  mr: "devanagari",
  pa: "devanagari", // Gurmukhi renders Sanskrit poorly; Devanagari is clearer
  te: "telugu",
  ta: "tamil",
  kn: "kannada",
  ml: "malayalam",
  gu: "gujarati",
  bn: "bengali",
};

/** Transliterate a Sanskrit term from `from` scheme into the UI language's script. */
export function toScript(src: string | undefined, lang: UILang, from = "devanagari"): string {
  if (!src) return "";
  const to = SCRIPT[lang];
  if (!to || to === from) return src;
  try {
    return Sanscript.t(src, from, to);
  } catch {
    return src;
  }
}

/**
 * Localize a proper-noun field: an explicit translation for the language wins;
 * otherwise transliterate the Sanskrit source `sa` (Devanagari) into the
 * language's script; English and missing-source fall back to `en`.
 */
export function pickTerm(t: (LangText & { sa?: string }) | undefined, lang: UILang): string {
  if (!t) return "";
  const direct = (t as Record<string, string | undefined>)[lang];
  if (direct) return direct;
  if (lang === "en") return t.en ?? "";
  if (t.sa) return toScript(t.sa, lang, "devanagari");
  return t.en ?? "";
}

/**
 * Localize a mantra written in IAST (e.g. "Om Namaḥ Śivāya"): English keeps the
 * roman IAST; every other language gets the mantra in its own script.
 */
export function mantraScript(iast: string, lang: UILang): string {
  if (lang === "en") return iast;
  return toScript(iast, lang, "iast");
}
