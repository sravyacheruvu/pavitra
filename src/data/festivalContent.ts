/**
 * festivalContent.ts — loads the festival CMS documents that also seed Supabase,
 * so the app can render and be tested locally without a database round-trip.
 * (When the Supabase `festivals` table is seeded, swap `FESTIVALS` for a fetch;
 * the shape is identical.)
 */
import varalakshmi from "../../supabase/seed/varalakshmi_vratam_2026.json";
import ganesh from "../../supabase/seed/ganesh_chaturthi_2026.json";
import navratri from "../../supabase/seed/navratri_dussehra_2026.json";
import diwali from "../../supabase/seed/diwali_lakshmi_pooja_2026.json";
import karthikaPournami from "../../supabase/seed/karthika_pournami_2026.json";
import vaikunthaEkadashi from "../../supabase/seed/vaikuntha_ekadashi_2026.json";
import makaraSankranti from "../../supabase/seed/makara_sankranti_2027.json";
import vasantPanchami from "../../supabase/seed/vasant_panchami_2027.json";
import mahaShivaratri from "../../supabase/seed/maha_shivaratri_2027.json";
import ugadi from "../../supabase/seed/ugadi_2027.json";
import sriRamaNavami from "../../supabase/seed/sri_rama_navami_2027.json";
import hanumanJayanti from "../../supabase/seed/hanuman_jayanti_2027.json";
import rakshaBandhan from "../../supabase/seed/raksha_bandhan_2027.json";
import krishnaJanmashtami from "../../supabase/seed/krishna_janmashtami_2027.json";
import { DEFAULT_LOCATION } from "../config/location";

export type Lang = "en" | "te" | "sa";
export type LangText = { en: string; te?: string; sa?: string };

export type SamagriItem = {
  id: string;
  name: LangText;
  quantity: string;
  category?: string;
  essential?: boolean;
};

export type VidhiStep = {
  order: number;
  title: LangText;
  instruction: LangText;
  mantra?: { sa: string; transliteration: string; meaning?: LangText };
  /** Key into the enumerations registry (src/data/enumerations.ts) — e.g. a
   *  named list of leaves or the 108 names recited during this step. */
  detailsRef?: string;
};

export type Vidhi = {
  label: LangText;
  duration_minutes?: number;
  description?: LangText;
  steps: VidhiStep[];
};

export type PrasadamRecipe = {
  id: string;
  name: LangText;
  type?: string;
  serves?: string;
  ingredients: { item: LangText; quantity: string }[];
  steps: { en: string }[];
  offering_note?: LangText;
};

export type NightForm = {
  day: number;
  date: string;
  tithi: string;
  form: { en: string; sa?: string };
  color: string;
};

export type FestivalDoc = {
  id: string;
  slug: string;
  year: number;
  type: string;
  name: LangText;
  deity: LangText;
  observed_on: {
    date: string;
    weekday?: string;
    masa?: string;
    paksha?: string;
    tithi?: string;
    note?: string;
    tradition?: string;
  };
  significance: LangText;
  regions: string[];
  languages: Lang[];
  samagri: SamagriItem[];
  vidhi: { sankshipta: Vidhi; sampurna: Vidhi };
  prasadam: PrasadamRecipe[];
  nine_nights?: NightForm[];
  primary_mantra?: { sa: string; transliteration: string; meaning?: LangText };
};

export const FESTIVALS: FestivalDoc[] = [
  varalakshmi as unknown as FestivalDoc,
  ganesh as unknown as FestivalDoc,
  navratri as unknown as FestivalDoc,
  diwali as unknown as FestivalDoc,
  karthikaPournami as unknown as FestivalDoc,
  vaikunthaEkadashi as unknown as FestivalDoc,
  makaraSankranti as unknown as FestivalDoc,
  vasantPanchami as unknown as FestivalDoc,
  mahaShivaratri as unknown as FestivalDoc,
  ugadi as unknown as FestivalDoc,
  sriRamaNavami as unknown as FestivalDoc,
  hanumanJayanti as unknown as FestivalDoc,
  rakshaBandhan as unknown as FestivalDoc,
  krishnaJanmashtami as unknown as FestivalDoc,
];

/** Parse an ISO date (YYYY-MM-DD) as a local calendar date at noon. */
function toLocalNoon(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

/** The civil Y-M-D "today" at a timezone, as UTC-midnight epoch ms. */
function civilTodayMs(now: Date, timeZone: string): number {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  });
  const [y, m, d] = f.format(now).split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/**
 * Whole calendar days from today to the festival date, counted in the app's
 * location timezone (so the countdown matches the panchang date, not the
 * device's zone).
 */
export function daysUntil(
  iso: string,
  now: Date = new Date(),
  timeZone: string = DEFAULT_LOCATION.timeZone
): number {
  const [y, m, d] = iso.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  return Math.round((target - civilTodayMs(now, timeZone)) / 86400000);
}

/** Festivals sorted by date ascending (upcoming first, past ones fall to the end of the year list). */
export function festivalsByDate(): FestivalDoc[] {
  return [...FESTIVALS].sort(
    (a, b) => toLocalNoon(a.observed_on.date).getTime() - toLocalNoon(b.observed_on.date).getTime()
  );
}

/** The next festival on or after `now`; falls back to the earliest if all are past. */
export function nextFestival(now: Date = new Date()): FestivalDoc {
  const sorted = festivalsByDate();
  const upcoming = sorted.find((f) => daysUntil(f.observed_on.date, now) >= 0);
  return upcoming ?? sorted[0];
}

export function relativeDay(days: number): string {
  if (days < 0) return `${Math.abs(days)} days ago`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `in ${days} days`;
}

/** Format an ISO date like "Fri, 21 Aug 2026". */
export function formatFestivalDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  }).format(toLocalNoon(iso));
}
