import { MhahPanchang } from "mhah-panchang";
import * as SunCalc from "suncalc";
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

function tithiName(ino: number, pakshaEn: string): string {
  const within = ((ino % 15) + 15) % 15;
  if (within === 14) return pakshaEn === "Shukla" ? "Purnima" : "Amavasya";
  return TITHI_BASE[within];
}

function normaliseMasa(raw: string | undefined): string {
  if (!raw) return "—";
  return MASA_NORMALISE[raw] ?? raw;
}

function samvatsaraFor(date: Date, tz: string): string {
  // Year in which the current Chaitra (lunar new year) began. Ugadi falls in
  // late Mar / early Apr; before April we treat it as the previous samvatsara.
  const parts = zonedParts(date, tz);
  const chaitraYear = parts.month >= 4 ? parts.year : parts.year - 1;
  const idx = (((chaitraYear - 2025 + 38) % 60) + 60) % 60;
  return SAMVATSARA[idx];
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
  // round the instant to the minute to match the parts we read back
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
  tithi: { name: string; paksha: string; end: Date | null };
  nakshatra: { name: string; end: Date | null };
  yoga: { name: string; end: Date | null };
  karana: { name: string };
  masa: string;
  samvatsara: string;
  ritu: string;
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
      paksha: c.Paksha?.name_en_IN ?? "",
      end: c.Tithi?.end ? new Date(c.Tithi.end) : null,
    },
    nakshatra: {
      name: c.Nakshatra?.name_en_IN ?? "—",
      end: c.Nakshatra?.end ? new Date(c.Nakshatra.end) : null,
    },
    yoga: {
      name: c.Yoga?.name_en_IN ?? "—",
      end: c.Yoga?.end ? new Date(c.Yoga.end) : null,
    },
    karana: { name: c.Karna?.name_en_IN ?? "—" },
    masa: normaliseMasa(cal.Masa?.name_en_IN),
    samvatsara: samvatsaraFor(date, tz),
    // Sanskrit ritu (season) by index — the sankalpam needs "Varsha", not "Monsoon".
    ritu: RITU_SA[cal.Ritu?.ino ?? -1] ?? cal.Ritu?.name_en_UK ?? "—",
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

// Generally-benefic nakshatras for common new undertakings (matched loosely on
// root so regional spellings from mhah-panchang still resolve).
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
    const panchang = getPanchang(d, location);
    out.push({ date: d, panchang, quality: dayQuality(panchang) });
  }
  return out;
}
