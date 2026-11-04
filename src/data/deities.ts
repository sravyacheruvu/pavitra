import type { LangText } from "../i18n";

/**
 * Curated deity list for onboarding — used both for the family deity
 * (Ishta/Kula Devata) single-select and the "deities you observe" multi-select.
 * Names carry a Devanagari `sa` source so they render in the selected script.
 */
export type Deity = { id: string; name: LangText };

export const DEITIES: Deity[] = [
  { id: "ganesha", name: { en: "Ganesha", te: "గణపతి", sa: "गणेश" } },
  { id: "venkateswara", name: { en: "Venkateswara", te: "వేంకటేశ్వరుడు", sa: "वेङ्कटेश्वर" } },
  { id: "lakshmi", name: { en: "Lakshmi", te: "లక్ష్మీదేవి", sa: "लक्ष्मी" } },
  { id: "shiva", name: { en: "Shiva", te: "శివుడు", sa: "शिव" } },
  { id: "durga", name: { en: "Durga / Parvati", te: "దుర్గాదేవి", sa: "दुर्गा" } },
  { id: "vishnu", name: { en: "Vishnu", te: "విష్ణువు", sa: "विष्णु" } },
  { id: "krishna", name: { en: "Krishna", te: "కృష్ణుడు", sa: "कृष्ण" } },
  { id: "rama", name: { en: "Rama", te: "శ్రీరాముడు", sa: "राम" } },
  { id: "hanuman", name: { en: "Hanuman", te: "ఆంజనేయుడు", sa: "हनुमान्" } },
  { id: "saraswati", name: { en: "Saraswati", te: "సరస్వతీదేవి", sa: "सरस्वती" } },
  { id: "subrahmanya", name: { en: "Subrahmanya", te: "సుబ్రహ్మణ్యుడు", sa: "सुब्रह्मण्य" } },
  { id: "ayyappa", name: { en: "Ayyappa", te: "అయ్యప్ప", sa: "अय्यप्प" } },
];

export const deityName = (id?: string): LangText | undefined =>
  DEITIES.find((d) => d.id === id)?.name;
