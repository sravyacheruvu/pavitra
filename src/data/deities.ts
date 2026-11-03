import type { LangText } from "../i18n";

/**
 * Curated deity list for onboarding — used both for the family deity
 * (Ishta/Kula Devata) single-select and the "deities you observe" multi-select.
 * Names are bilingual (English + Telugu); more languages can be filled in later.
 */
export type Deity = { id: string; name: LangText };

export const DEITIES: Deity[] = [
  { id: "ganesha", name: { en: "Ganesha", te: "గణపతి" } },
  { id: "venkateswara", name: { en: "Venkateswara", te: "వేంకటేశ్వరుడు" } },
  { id: "lakshmi", name: { en: "Lakshmi", te: "లక్ష్మీదేవి" } },
  { id: "shiva", name: { en: "Shiva", te: "శివుడు" } },
  { id: "durga", name: { en: "Durga / Parvati", te: "దుర్గాదేవి" } },
  { id: "vishnu", name: { en: "Vishnu", te: "విష్ణువు" } },
  { id: "krishna", name: { en: "Krishna", te: "కృష్ణుడు" } },
  { id: "rama", name: { en: "Rama", te: "శ్రీరాముడు" } },
  { id: "hanuman", name: { en: "Hanuman", te: "ఆంజనేయుడు" } },
  { id: "saraswati", name: { en: "Saraswati", te: "సరస్వతీదేవి" } },
  { id: "subrahmanya", name: { en: "Subrahmanya", te: "సుబ్రహ్మణ్యుడు" } },
  { id: "ayyappa", name: { en: "Ayyappa", te: "అయ్యప్ప" } },
];

export const deityName = (id?: string): LangText | undefined =>
  DEITIES.find((d) => d.id === id)?.name;
