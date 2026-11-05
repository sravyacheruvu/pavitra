import { MhahPanchang } from "mhah-panchang";
import * as SunCalc from "suncalc";
import Sanscript from "@indic-transliteration/sanscript";
import { AppLocation, DEFAULT_LOCATION } from "../config/location";

/**
 * Panchang engine.
 *
 * Astronomical angas (tithi, nakshatra, yoga, karana, masa) come from
 * `mhah-panchang`. Sunrise/sunset come from `suncalc`, and the day windows
 * (Rahu Kalam, Yamaganda, Gulika, Abhijit, Brahma Muhurta) are derived from
 * sunrise/sunset using the standard eight-part / fifteen-muhurta divisions.
 *
 * All wall-clock times are formatted in the LOCATION's timezone so results are
 * correct even when the device is in a different zone.
 */

const mhah = new MhahPanchang();

/** The panchang library returns anga names in Odia script; convert to a neutral
 * Devanagari source so the UI can transliterate into the reader's own script. */
function odiaToDev(name: string | undefined): string {
  if (!name) return "";
  try {
    return Sanscript.t(name, "oriya", "devanagari");
  } catch {
    return "";
  }
}

// ---------- name tables ----------

// Tithi.ino runs 0..29 across the lunar month: 0..14 = Shukla Pratipada..Purnima,
// 15..29 = Krishna Pratipada..Amavasya. Index within a paksha is ino % 15.
const TITHI_BASE = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti",
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
  "Trayodashi", "Chaturdashi",
];

// mhah-panchang uses regional spellings; normalise the masa to standard Sanskrit.
const MASA_NORMALISE: Record<string, string> = {
  Chaitra: "Chaitra",
  Vaishakha: "Vaishakha", Baisakha: "Vaishakha",
  Jyeshta: "Jyeshtha", Jyeshtha: "Jyeshtha",
  Ashadha: "Ashadha", Asadha: "Ashadha",
  Sravana: "Shravana", Srabana: "Shravana", Shravana: "Shravana",
  Bhadrapada: "Bhadrapada", Bhadraba: "Bhadrapada", Bhadra: "Bhadrapada",
  Ashwina: "Ashwina", Aswina: "Ashwina", Ashwin: "Ashwina",
  Kartika: "Kartika", Karthika: "Kartika", Karttika: "Kartika",
  Margashirsha: "Margashirsha", Margasira: "Margashirsha", Agrahayana: "Margashirsha",
  Pausha: "Pausha", Pausa: "Pausha", Pushya: "Pausha",
  Magha: "Magha",
  Phalguna: "Phalguna", Falguna: "Phalguna", Phalgun: "Phalguna",
};

// 60-year Jovian cycle (Prabhava .. Akshaya). Anchor: the samvatsara that begins
// at Ugadi 2025 is Vishvavasu (#39, array index 38).
const SAMVATSARA = [
  "Prabhava", "Vibhava", "Shukla", "Pramoduta", "Prajapati", "Angirasa",
  "Shrimukha", "Bhava", "Yuva", "Dhata", "Ishvara", "Bahudhanya", "Pramadi",
  "Vikrama", "Vrisha", "Chitrabhanu", "Svabhanu", "Tarana", "Parthiva", "Vyaya",
  "Sarvajitu", "Sarvadhari", "Virodhi", "Vikruti", "Khara", "Nandana",
  "Vijaya", "Jaya", "Manmatha", "Durmukhi", "Hevilambi", "Vilambi", "Vikari",
  "Sharvari", "Plava", "Shubhakritu", "Shobhakritu", "Krodhi", "Vishvavasu",
  "Parabhava", "Plavanga", "Kilaka", "Saumya", "Sadharana", "Virodhikritu",
  "Paridhavi", "Pramadicha", "Ananda", "Rakshasa", "Nala", "Pingala",
  "Kalayukti", "Siddharthi", "Raudri", "Durmati", "Dundubhi", "Rudhirodgari",
  "Raktakshi", "Krodhana", "Akshaya",
];

/** Sanskrit ritu (season) names, indexed by mhah-panchang's Ritu.ino (0–5). */
const RITU_SA = ["Vasanta", "Grishma", "Varsha", "Sharad", "Hemanta", "Shishira"];

// ---------- Devanagari sources (transliterated into the reader's script at render) ----------

const TITHI_BASE_DEV = [
  "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पञ्चमी", "षष्ठी",
  "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी",
  "त्रयोदशी", "चतुर्दशी",
];

const PAKSHA_DEV: Record<string, string> = { Shukla: "शुक्ल", Krishna: "कृष्ण" };

const MASA_DEV: Record<string, string> = {
  Chaitra: "चैत्र", Vaishakha: "वैशाख", Jyeshtha: "ज्येष्ठ", Ashadha: "आषाढ",
  Shravana: "श्रावण", Bhadrapada: "भाद्रपद", Ashwina: "आश्विन", Kartika: "कार्तिक",
  Margashirsha: "मार्गशीर्ष", Pausha: "पौष", Magha: "माघ", Phalguna: "फाल्गुन",
  // common variant spellings used in the festival seed data
  Karthika: "कार्तिक", Aswina: "आश्विन", Srabana: "श्रावण",
};

const RITU_DEV = ["वसन्त", "ग्रीष्म", "वर्षा", "शरद्", "हेमन्त", "शिशिर"];

// The Amanta lunar month, indexed by the Sun's sidereal rashi (ino 0=Mesha…11=Meena)
// at the month-ending Amavasya. Chaitra ↔ the month whose Amavasya falls with the Sun in Mesha.
const MASA_BY_RASHI = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
  "Ashwina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna",
];
const MASA_BY_RASHI_DEV = [
  "चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ", "श्रावण", "भाद्रपद",
  "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन",
];

// 60-year Jovian cycle in Devanagari, aligned index-for-index with SAMVATSARA.
const SAMVATSARA_DEV = [
  "प्रभव", "विभव", "शुक्ल", "प्रमोद", "प्रजापति", "आङ्गिरस",
  "श्रीमुख", "भाव", "युव", "धातृ", "ईश्वर", "बहुधान्य", "प्रमादी",
  "विक्रम", "वृष", "चित्रभानु", "स्वभानु", "तारण", "पार्थिव", "व्यय",
  "सर्वजित्", "सर्वधारी", "विरोधी", "विकृति", "खर", "नन्दन",
  "विजय", "जय", "मन्मथ", "दुर्मुखी", "हेविलम्बी", "विलम्बी", "विकारी",
  "शार्वरी", "प्लव", "शुभकृत्", "शोभकृत्", "क्रोधी", "विश्वावसु",
  "पराभव", "प्लवङ्ग", "कीलक", "सौम्य", "साधारण", "विरोधिकृत्",
  "परिधावी", "प्रमादीच", "आनन्द", "राक्षस", "नल", "पिङ्गल",
  "कालयुक्त", "सिद्धार्थी", "रौद्री", "दुर्मति", "दुन्दुभि", "रुधिरोद्गारी",
  "रक्ताक्षी", "क्रोधन", "अक्षय",
];

/**
 * Correct Amanta (South-Indian / Telugu) lunar month. The mhah-panchang `Masa`
 * is keyed to the Sun's current solar month, so near month boundaries it names
 * the month ahead of the traditional Amanta reckoning (e.g. it calls Ashwayuja
 * "Kartika"). The Amanta month is instead the one that *ends* at the next
 * Amavasya, so we walk forward to that new moon and read the Sun's sidereal
 * rashi there — that rashi names the month. Memoised per civil day.
 */
const masaCache = new Map<string, { ino: number; roman: string; dev: string }>();
function amantaMasa(date: Date, lat: number, lng: number, tz: string): { ino: number; roman: string; dev: string } {
  const key = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  const cached = masaCache.get(key);
  if (cached) return cached;
  let d = new Date(date);
  for (let i = 0; i < 32; i++) {
    const c = mhah.calculate(d);
    if (c.Tithi?.name_en_IN === "Amavasya") break;
    d = new Date(d.getTime() + 86400000);
  }
  const rashi = mhah.calendar(d, lat, lng).Raasi?.ino;
  const ino = typeof rashi === "number" && rashi >= 0 && rashi < 12 ? rashi : -1;
  const out =
    ino >= 0
      ? { ino, roman: MASA_BY_RASHI[ino], dev: MASA_BY_RASHI_DEV[ino] }
      : { ino: -1, roman: "—", dev: "" };
  masaCache.set(key, out);
  return out;
}

/** Map a roman anga name (masa, paksha or tithi) to its Devanagari source, for
 * transliterating festival sub-labels into the reader's script. Returns "" when
 * the term isn't a known anga. */
export function angaDev(roman: string | undefined): string {
  if (!roman) return "";
  if (PAKSHA_DEV[roman]) return PAKSHA_DEV[roman];
  if (MASA_DEV[roman]) return MASA_DEV[roman];
  if (roman === "Purnima") return "पूर्णिमा";
  if (roman === "Amavasya") return "अमावस्या";
  const ti = TITHI_BASE.indexOf(roman);
  if (ti >= 0) return TITHI_BASE_DEV[ti];
  return "";
}

function tithiName(ino: number, pakshaEn: string): string {
  const within = ((ino % 15) + 15) % 15;
  if (within === 14) return pakshaEn === "Shukla" ? "Purnima" : "Amavasya";
  return TITHI_BASE[within];
}

function tithiDev(ino: number, pakshaEn: string): string {
  const within = ((ino % 15) + 15) % 15;
  if (within === 14) return pakshaEn === "Shukla" ? "पूर्णिमा" : "अमावस्या";
  return TITHI_BASE_DEV[within];
}

function normaliseMasa(raw: string | undefined): string {
  if (!raw) return "—";
  return MASA_NORMALISE[raw] ?? raw;
}

function samvatsaraFor(date: Date, tz: string): string {
  const parts = zonedParts(date, tz);
  const chaitraYear = parts.month >= 4 ? parts.year : parts.year - 1;
  const idx = (((chaitraYear - 2025 + 38) % 60) + 60) % 60;
  return SAMVATSARA[idx];
}

function samvatsaraIdx(date: Date, tz: string): number {
  const parts = zonedParts(date, tz);
  const chaitraYear = parts.month >= 4 ? parts.year : parts.year - 1;
  return (((chaitraYear - 2025 + 38) % 60) + 60) % 60;
}

// ---------- timezone helpers ----------

type YMDHMS = { year: number; month: number; day: number; hour: number; minute: number };

function zonedParts(date: Date, timeZone: string): YMDHMS {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  const map: Record<string, string> = {};
  for (const p of f.formatToParts(date)) if (p.type !== "literal") map[p.type] = p.value;
  return {
    year: +map.year, month: +map.month, day: +map.day,
    hour: map.hour === "24" ? 0 : +map.hour, minute: +map.minute,
  };
}

/** UTC offset (ms) of a timezone at a given instant. */
function tzOffsetMs(date: Date, timeZone: string): number {
  const p = zonedParts(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  const rounded = Math.round(date.getTime() / 60000) * 60000;
  return asUtc - rounded;
}

/** A Date representing ~12:00 local time on the location-local day of `date`. */
function locationNoon(date: Date, timeZone: string): Date {
  const p = zonedParts(date, timeZone);
  const guess = new Date(Date.UTC(p.year, p.month - 1, p.day, 12, 0, 0));
  const off = tzOffsetMs(guess, timeZone);
  return new Date(Date.UTC(p.year, p.month - 1, p.day, 12, 0, 0) - off);
}

export function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone, hour: "numeric", minute: "2-digit", hour12: true,
  }).format(date);
}

export function formatLongDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone, weekday: "long", day: "numeric", month: "short", year: "numeric",
  }).format(date);
}

export function formatMediumDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone, day: "numeric", month: "short", year: "numeric",
  }).format(date);
}

// ---------- windows ----------

const RAHU = [8, 2, 7, 5, 6, 4, 3]; // index by weekday Sun..Sat, 1-based part
const YAMA = [5, 4, 3, 2, 1, 7, 6];
const GULIKA = [7, 6, 5, 4, 3, 2, 1];

export type TimeWindow = { start: Date; end: Date };

function part(sunrise: Date, sunset: Date, n: number): TimeWindow {
  const seg = (sunset.getTime() - sunrise.getTime()) / 8;
  return {
    start: new Date(sunrise.getTime() + (n - 1) * seg),
    end: new Date(sunrise.getTime() + n * seg),
  };
}

// ---------- public API ----------

export type Panchang = {
  date: Date;
  location: AppLocation;
  gregorianLong: string;
  tithi: { name: string; sa: string; paksha: string; pakshaSa: string; end: Date | null };
  nakshatra: { name: string; sa: string; end: Date | null };
  yoga: { name: string; sa: string; end: Date | null };
  karana: { name: string; sa: string };
  masa: string;
  masaSa: string;
  samvatsara: string;
  samvatsaraSa: string;
  ritu: string;
  rituSa: string;
  sun: { sunrise: Date; solarNoon: Date; sunset: Date };
  windows: {
    rahuKalam: TimeWindow;
    yamaganda: TimeWindow;
    gulika: TimeWindow;
    abhijit: TimeWindow;
    brahmaMuhurta: TimeWindow;
  };
};

export function getPanchang(
  date: Date = new Date(),
  location: AppLocation = DEFAULT_LOCATION
): Panchang {
  const { latitude: lat, longitude: lng, timeZone: tz } = location;

  const c = mhah.calculate(date);
  const cal = mhah.calendar(date, lat, lng);
  const masa = amantaMasa(date, lat, lng, tz);

  const noon = locationNoon(date, tz);
  const sc = SunCalc.getTimes(noon, lat, lng);
  if (!sc.sunrise || !sc.sunset || !sc.solarNoon) {
    throw new Error("Sunrise/sunset unavailable for this location and date.");
  }
  const sunrise: Date = sc.sunrise;
  const sunset: Date = sc.sunset;
  const solarNoon: Date = sc.solarNoon;

  // Weekday of the location-local day (Sun=0..Sat=6) for the window tables.
  const np = zonedParts(noon, tz);
  const dow = new Date(Date.UTC(np.year, np.month - 1, np.day)).getUTCDay();

  // Abhijit = 8th of 15 muhurtas (centred on solar noon).
  const dayMs = sunset.getTime() - sunrise.getTime();
  const muh = dayMs / 15;
  const abhijit: TimeWindow = {
    start: new Date(sunrise.getTime() + 7 * muh),
    end: new Date(sunrise.getTime() + 8 * muh),
  };
  // Brahma Muhurta = one muhurta (48 min), starting 96 min before sunrise.
  const brahmaMuhurta: TimeWindow = {
    start: new Date(sunrise.getTime() - 96 * 60000),
    end: new Date(sunrise.getTime() - 48 * 60000),
  };

  return {
    date,
    location,
    gregorianLong: formatLongDate(date, tz),
    tithi: {
      name: tithiName(c.Tithi.ino, c.Paksha?.name_en_IN ?? ""),
      sa: tithiDev(c.Tithi.ino, c.Paksha?.name_en_IN ?? ""),
      paksha: c.Paksha?.name_en_IN ?? "",
      pakshaSa: PAKSHA_DEV[c.Paksha?.name_en_IN ?? ""] ?? "",
      end: c.Tithi?.end ? new Date(c.Tithi.end) : null,
    },
    nakshatra: {
      name: c.Nakshatra?.name_en_IN ?? "—",
      sa: odiaToDev(c.Nakshatra?.name),
      end: c.Nakshatra?.end ? new Date(c.Nakshatra.end) : null,
    },
    yoga: {
      name: c.Yoga?.name_en_IN ?? "—",
      sa: odiaToDev(c.Yoga?.name),
      end: c.Yoga?.end ? new Date(c.Yoga.end) : null,
    },
    karana: { name: c.Karna?.name_en_IN ?? "—", sa: odiaToDev(c.Karna?.name) },
    masa: masa.roman,
    masaSa: masa.dev,
    samvatsara: samvatsaraFor(date, tz),
    samvatsaraSa: SAMVATSARA_DEV[samvatsaraIdx(date, tz)] ?? "",
    // Ritu (season) follows the Amanta masa: two masas per ritu, starting Chaitra→Vasanta.
    ritu: masa.ino >= 0 ? RITU_SA[Math.floor(masa.ino / 2) % 6] : (RITU_SA[cal.Ritu?.ino ?? -1] ?? "—"),
    rituSa: masa.ino >= 0 ? RITU_DEV[Math.floor(masa.ino / 2) % 6] : (RITU_DEV[cal.Ritu?.ino ?? -1] ?? ""),
    sun: { sunrise, solarNoon, sunset },
    windows: {
      rahuKalam: part(sunrise, sunset, RAHU[dow]),
      yamaganda: part(sunrise, sunset, YAMA[dow]),
      gulika: part(sunrise, sunset, GULIKA[dow]),
      abhijit,
      brahmaMuhurta,
    },
  };
}

/** Is `now` inside the window? */
export function isActive(w: TimeWindow, now: Date = new Date()): boolean {
  const t = now.getTime();
  return t >= w.start.getTime() && t <= w.end.getTime();
}

/** Whole civil days from `from` to `target` in the location timezone. */
export function civilDaysUntil(target: Date, from: Date, timeZone: string): number {
  const a = zonedParts(from, timeZone);
  const b = zonedParts(target, timeZone);
  const da = Date.UTC(a.year, a.month - 1, a.day);
  const db = Date.UTC(b.year, b.month - 1, b.day);
  return Math.round((db - da) / 86400000);
}

/** "Today" / "Tomorrow" / "in N days" label. */
export function relativeDayLabel(days: number): string {
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `in ${days} days`;
}

/**
 * Tithi-based recurrence: given a Gregorian birth date, find the next Gregorian
 * date (on/after `from`) whose tithi + paksha + masa match the birth tithi.
 * Scans forward up to ~2 lunar years.
 */
export function nextTithiOccurrence(
  birth: Date,
  from: Date = new Date(),
  location: AppLocation = DEFAULT_LOCATION
): { date: Date; tithiLabel: string } | null {
  const { latitude: lat, longitude: lng, timeZone: tz } = location;
  const bNoon = locationNoon(birth, tz);
  const bc = mhah.calculate(bNoon);
  const bcal = mhah.calendar(bNoon, lat, lng);
  const targetTithi = bc.Tithi.ino;
  const targetMasa = normaliseMasa(bcal.Masa?.name_en_IN);
  const label = `${normaliseMasa(bcal.Masa?.name_en_IN)} · ${bc.Paksha?.name_en_IN} ${tithiName(bc.Tithi.ino, bc.Paksha?.name_en_IN ?? "")}`;

  const start = locationNoon(from, tz);
  for (let i = 0; i < 750; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const cc = mhah.calculate(d);
    if (cc.Tithi.ino === targetTithi) {
      const ccal = mhah.calendar(d, lat, lng);
      if (normaliseMasa(ccal.Masa?.name_en_IN) === targetMasa) {
        return { date: d, tithiLabel: label };
      }
    }
  }
  return null;
}

// ---------- auspiciousness heuristics ----------

const GOOD_NAKSHATRA_ROOTS = [
  "ashwin", "aswin", "rohini", "mrigash", "mrugash", "punarv", "pushy", "pushya",
  "uttara", "hasta", "chitra", "swat", "anuradh", "shravan", "sravan", "dhanish",
  "avittam", "shatabhi", "sadayam", "revati",
];
const RIKTA_TITHIS = new Set(["Chaturthi", "Navami", "Chaturdashi"]);

export type DayQuality = { level: "good" | "mixed" | "caution"; reason: string; tags: string[] };

/** A light, clearly-heuristic read on whether a day favours new / auspicious work. */
export function dayQuality(p: Panchang): DayQuality {
  const t = p.tithi.name;
  const nak = (p.nakshatra.name || "").toLowerCase();
  const tags: string[] = [];
  if (t === "Ekadashi") tags.push("Ekadashi");
  if (t === "Purnima") tags.push("Pournami");
  if (t === "Amavasya") tags.push("Amavasya");
  if (t === "Trayodashi") tags.push("Pradosham");
  if (t === "Chaturthi") tags.push(p.tithi.paksha === "Shukla" ? "Vinayaka Chaturthi" : "Sankashti");

  const goodNak = GOOD_NAKSHATRA_ROOTS.some((r) => nak.includes(r));
  const riktaOrAma = RIKTA_TITHIS.has(t) || t === "Amavasya";

  if (riktaOrAma) {
    return {
      level: "caution",
      tags,
      reason:
        t === "Amavasya"
          ? "Amavasya — suited to ancestral remembrance, not new ventures."
          : `${t} is a rikta tithi — best to avoid starting important new work.`,
    };
  }
  if (goodNak) {
    return {
      level: "good",
      tags,
      reason:
        t === "Purnima"
          ? `Pournami with ${p.nakshatra.name} nakshatram — very auspicious.`
          : `${p.nakshatra.name} nakshatram favours most new beginnings.`,
    };
  }
  return {
    level: "mixed",
    tags,
    reason: `${p.nakshatra.name} nakshatram — mixed; check the muhurtam for your specific task.`,
  };
}

// ---------- location-aware festival dates ----------

/**
 * A festival falls on the Gregorian day when its tithi prevails at a specific
 * local reference time — sunrise for most, midday (madhyahna) for Ganesh
 * Chaturthi & Rama Navami, the evening (pradosha) for Diwali, midnight (nishita)
 * for Shivaratri & Janmashtami, etc. Because that reference time is *local*, the
 * observed calendar day can differ by ±1 day in New York or Sydney vs India.
 * We compute it from the ephemeris for the user's own location.
 */
type TithiRef = "sunrise" | "purvahna" | "madhyahna" | "aparahna" | "pradosha" | "nishita" | "anchor";

const FESTIVAL_REF: Record<string, TithiRef> = {
  "diwali-lakshmi-pooja": "pradosha",
  "ganesh-chaturthi": "madhyahna",
  "sri-rama-navami": "madhyahna",
  "maha-shivaratri": "nishita",
  "krishna-janmashtami": "nishita",
  "raksha-bandhan": "aparahna",
  "vasant-panchami": "purvahna",
  // weekday-based / solar festivals don't shift cleanly by a single tithi rule:
  "varalakshmi-vratam": "anchor",
  "makara-sankranti": "anchor",
};

const TITHI_WITHIN: Record<string, number> = {
  Pratipada: 0, Padyami: 0, Dwitiya: 1, Vidhiya: 1, Tritiya: 2, Thadiya: 2,
  Chaturthi: 3, Chavithi: 3, Panchami: 4, Shashti: 5, Shashthi: 5, Saptami: 6,
  Ashtami: 7, Navami: 8, Dashami: 9, Ekadashi: 10, Dwadashi: 11, Trayodashi: 12,
  Chaturdashi: 13,
};

/** mhah tithi ino (0–29) from a tithi name + paksha. Returns -1 if unparseable. */
function festivalTithiIno(tithiName: string | undefined, paksha: string | undefined): number {
  const name = (tithiName ?? "").trim();
  if (name === "Purnima") return 14;
  if (name === "Amavasya") return 29;
  const within = TITHI_WITHIN[name];
  if (within === undefined) return -1;
  return (paksha === "Krishna" ? 15 : 0) + within;
}

/** The reference-time instant on a day, from its sunrise/sunset (and next sunrise for nishita). */
function refInstant(sunrise: Date, sunset: Date, nextSunrise: Date, ref: TithiRef): Date {
  const day = sunset.getTime() - sunrise.getTime();
  switch (ref) {
    case "purvahna": return new Date(sunrise.getTime() + day * 0.25);
    case "madhyahna": return new Date(sunrise.getTime() + day * 0.5);
    case "aparahna": return new Date(sunrise.getTime() + day * 0.72);
    case "pradosha": return new Date(sunset.getTime() + 18 * 60000);
    case "nishita": return new Date(sunset.getTime() + (nextSunrise.getTime() - sunset.getTime()) * 0.5);
    default: return sunrise;
  }
}

function sunForLocalDay(y: number, m: number, d: number, lat: number, lng: number, tz: string) {
  const noon = locationNoon(new Date(Date.UTC(y, m - 1, d, 12, 0, 0)), tz);
  const sc = SunCalc.getTimes(noon, lat, lng);
  return { sunrise: sc.sunrise as Date | undefined, sunset: sc.sunset as Date | undefined };
}

/**
 * The Gregorian date (YYYY-MM-DD in the location's timezone) on which a festival
 * is observed at that location. `anchorIso` is the India reference date; we search
 * ±2 days around it for the day whose reference-time tithi matches.
 */
export function festivalObservedDate(
  slug: string,
  tithiName: string | undefined,
  paksha: string | undefined,
  anchorIso: string,
  location: AppLocation
): string {
  const ref = FESTIVAL_REF[slug] ?? "sunrise";
  if (ref === "anchor") return anchorIso;
  const target = festivalTithiIno(tithiName, paksha);
  if (target < 0) return anchorIso;

  const { latitude: lat, longitude: lng, timeZone: tz } = location;
  const [ay, am, ad] = anchorIso.split("-").map(Number);
  const iso = (y: number, m: number, d: number) =>
    `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const search = (r: TithiRef): string | null => {
    for (let off = -2; off <= 2; off++) {
      const base = new Date(Date.UTC(ay, am - 1, ad + off, 12, 0, 0));
      const p = zonedParts(base, tz); // the location-civil day containing this instant
      const today = sunForLocalDay(p.year, p.month, p.day, lat, lng, tz);
      if (!today.sunrise || !today.sunset) continue;
      const next = sunForLocalDay(p.year, p.month, p.day + 1, lat, lng, tz);
      const nextSr = next.sunrise ?? new Date(today.sunset.getTime() + 11 * 3600000);
      const inst = refInstant(today.sunrise, today.sunset, nextSr, r);
      try {
        if (mhah.calculate(inst).Tithi?.ino === target) return iso(p.year, p.month, p.day);
      } catch {
        /* skip */
      }
    }
    return null;
  };

  // The festival's own reference time; if the tithi never prevails at it locally
  // (can happen for nishita festivals), fall back to the sunrise rule, then anchor.
  return search(ref) ?? (ref !== "sunrise" ? search("sunrise") : null) ?? anchorIso;
}

export type ForecastDay = { date: Date; panchang: Panchang; quality: DayQuality };

/** Panchang + day-quality for `count` days starting today (location-local). */
export function forecast(
  from: Date = new Date(),
  count = 10,
  location: AppLocation = DEFAULT_LOCATION
): ForecastDay[] {
  const start = locationNoon(from, location.timeZone);
  const out: ForecastDay[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    try {
      const panchang = getPanchang(d, location);
      out.push({ date: d, panchang, quality: dayQuality(panchang) });
    } catch {
      // Skip days the ephemeris can't resolve (e.g. polar sunrise edge cases).
    }
  }
  return out;
}
