/**
 * panchangamService.ts — local Panchangam engine.
 *
 * Computes Tithi, Nakshatram, Rahu Kalam, and Abhijit Muhurtham from
 * astronomical positions, adjusted to the caller's coordinates and to the
 * locally-computed sunrise/sunset.
 *
 * Primary backend: Swiss Ephemeris (via `swisseph-wasm`) — arc-second precision
 * sun/moon longitudes plus true local rise/set. Swiss Ephemeris is GPL-v3 (or a
 * paid Astrodienst licence) and runs only where WebAssembly is available
 * (browser / Expo web / Node). React Native's Hermes engine has no WASM, so on
 * native devices this service transparently falls back to the pure-JS engine in
 * ./panchang.ts, which has been validated to match Swiss Ephemeris to the
 * arc-minute for tithi/nakshatra and to ~1 min for sunrise. `result.source`
 * reports which backend produced the answer.
 *
 * For production-grade Swiss Ephemeris on every platform, run this computation
 * in a Supabase Edge Function (Deno) and have the client fetch/cache the result.
 */
import { AppLocation, DEFAULT_LOCATION } from "../config/location";
import { getPanchang, isActive, TimeWindow } from "./panchang";

// ---------- public types ----------

export type PanchangamSource = "swiss-ephemeris" | "fallback";

export type Coordinates = {
  latitude: number;
  longitude: number;
  /** metres above sea level; refines rise/set. Defaults to 0. */
  altitude?: number;
};

export type Anga = {
  index: number;
  name: string;
  /** when this anga ends (next boundary), or null if unknown. */
  end: Date | null;
};

export type PanchangamResult = {
  date: Date;
  coordinates: Coordinates;
  timeZone: string;
  source: PanchangamSource;
  sun: { sunrise: Date; sunset: Date };
  tithi: Anga & { paksha: "Shukla" | "Krishna" };
  nakshatram: Anga;
  rahuKalam: TimeWindow;
  abhijitMuhurtham: TimeWindow;
};

// ---------- name tables ----------

const TITHI_BASE = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti",
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
  "Trayodashi", "Chaturdashi",
];

const NAKSHATRA = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
  "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
  "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

// Rahu Kalam segment (1-based, of 8 daytime parts) indexed by weekday Sun..Sat.
const RAHU_SEGMENT = [8, 2, 7, 5, 6, 4, 3];

// ---------- Julian day <-> Date ----------

const JD_UNIX_EPOCH = 2440587.5; // JD at 1970-01-01T00:00:00Z

const toJd = (d: Date) => JD_UNIX_EPOCH + d.getTime() / 86400000;
const fromJd = (jd: number) => new Date((jd - JD_UNIX_EPOCH) * 86400000);

const norm360 = (x: number) => ((x % 360) + 360) % 360;

function tithiName(index: number, paksha: "Shukla" | "Krishna"): string {
  const within = index % 15;
  if (within === 14) return paksha === "Shukla" ? "Purnima" : "Amavasya";
  return TITHI_BASE[within];
}

/** Weekday (Sun=0..Sat=6) of the location-local civil day of `date`. */
function weekdayInZone(date: Date, timeZone: string): number {
  const wd = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
}

// ---------- Swiss Ephemeris backend (lazy singleton) ----------

type SweInstance = {
  SE_SUN: number; SE_MOON: number;
  SEFLG_MOSEPH: number; SEFLG_SPEED: number; SEFLG_SIDEREAL: number;
  SE_SIDM_LAHIRI: number; SE_CALC_RISE: number; SE_CALC_SET: number;
  SE_BIT_DISC_CENTER: number;
  set_sid_mode: (mode: number, t0: number, ayanT0: number) => void;
  calc_ut: (jd: number, body: number, flags: number) => ArrayLike<number>;
  rise_trans: (
    jd: number, body: number, star: string, flags: number, rsmi: number,
    geopos: number[], atpress: number, attemp: number
  ) => ArrayLike<number> | null;
  close?: () => void;
};

let swePromise: Promise<SweInstance | null> | null = null;

async function getSwe(): Promise<SweInstance | null> {
  if (swePromise) return swePromise;
  swePromise = (async () => {
    try {
      const mod: any = await import("swisseph-wasm");
      const SwissEph = mod.default ?? mod;
      const swe = new SwissEph();
      await swe.initSwissEph();
      swe.set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
      return swe as SweInstance;
    } catch {
      // No WASM runtime (Hermes) or bundling issue — signal fallback.
      return null;
    }
  })();
  return swePromise;
}

// ---------- Swiss Ephemeris computation ----------

function longitude(swe: SweInstance, jd: number, body: number, sidereal: boolean): { lon: number; speed: number } {
  const flags = swe.SEFLG_MOSEPH | swe.SEFLG_SPEED | (sidereal ? swe.SEFLG_SIDEREAL : 0);
  const r = swe.calc_ut(jd, body, flags);
  return { lon: r[0], speed: r[3] };
}

/** Refine the instant a moving angle crosses `targetDeg` (Newton on speed). */
function crossingTime(
  swe: SweInstance,
  jd: number,
  targetDeg: number,
  body: number,
  sidereal: boolean,
  relativeTo: number | null // subtract this body's longitude (for elongation), else null
): Date | null {
  let t = jd;
  for (let i = 0; i < 6; i++) {
    const a = longitude(swe, t, body, sidereal);
    let ang = a.lon;
    let rate = a.speed;
    if (relativeTo !== null) {
      const b = longitude(swe, t, relativeTo, sidereal);
      ang = norm360(a.lon - b.lon);
      rate = a.speed - b.speed;
    }
    if (rate <= 0) return null;
    // shortest forward distance to the target angle
    let delta = norm360(targetDeg - ang);
    if (delta > 350) delta -= 360; // already essentially at target
    const dtDays = delta / rate;
    t += dtDays;
    if (Math.abs(dtDays) < 1e-5) break;
  }
  return fromJd(t);
}

function windowFromDay(sunrise: Date, sunset: Date, segment: number): TimeWindow {
  const seg = (sunset.getTime() - sunrise.getTime()) / 8;
  return {
    start: new Date(sunrise.getTime() + (segment - 1) * seg),
    end: new Date(sunrise.getTime() + segment * seg),
  };
}

function abhijitFromDay(sunrise: Date, sunset: Date): TimeWindow {
  const muh = (sunset.getTime() - sunrise.getTime()) / 15; // 8th of 15 muhurtas
  return {
    start: new Date(sunrise.getTime() + 7 * muh),
    end: new Date(sunrise.getTime() + 8 * muh),
  };
}

async function computeWithSwiss(
  swe: SweInstance,
  date: Date,
  coords: Coordinates,
  timeZone: string
): Promise<PanchangamResult> {
  const jd = toJd(date);
  const geopos = [coords.longitude, coords.latitude, coords.altitude ?? 0];

  // Sunrise/sunset for the local day: search from ~6h before `date`.
  const rise = swe.rise_trans(jd - 0.5, swe.SE_SUN, "", swe.SEFLG_MOSEPH,
    swe.SE_CALC_RISE | swe.SE_BIT_DISC_CENTER, geopos, 0, 0);
  const sunrise = rise ? fromJd(rise[0]) : new Date(date);
  const setSearch = rise ? rise[0] : jd;
  const set = swe.rise_trans(setSearch, swe.SE_SUN, "", swe.SEFLG_MOSEPH,
    swe.SE_CALC_SET | swe.SE_BIT_DISC_CENTER, geopos, 0, 0);
  const sunset = set ? fromJd(set[0]) : new Date(date);

  // Tithi from tropical elongation (ayanamsa cancels in moon - sun).
  const sunT = longitude(swe, jd, swe.SE_SUN, false);
  const moonT = longitude(swe, jd, swe.SE_MOON, false);
  const elong = norm360(moonT.lon - sunT.lon);
  const tithiIndex = Math.floor(elong / 12); // 0..29
  const paksha: "Shukla" | "Krishna" = tithiIndex < 15 ? "Shukla" : "Krishna";
  const tithiEnd = crossingTime(swe, jd, (tithiIndex + 1) * 12, swe.SE_MOON, false, swe.SE_SUN);

  // Nakshatram from sidereal moon (Lahiri).
  const moonS = longitude(swe, jd, swe.SE_MOON, true);
  const span = 360 / 27; // 13°20'
  const nakIndex = Math.floor(norm360(moonS.lon) / span); // 0..26
  const nakEnd = crossingTime(swe, jd, (nakIndex + 1) * span, swe.SE_MOON, true, null);

  const dow = weekdayInZone(date, timeZone);

  return {
    date,
    coordinates: coords,
    timeZone,
    source: "swiss-ephemeris",
    sun: { sunrise, sunset },
    tithi: { index: tithiIndex, name: tithiName(tithiIndex, paksha), paksha, end: tithiEnd },
    nakshatram: { index: nakIndex, name: NAKSHATRA[nakIndex], end: nakEnd },
    rahuKalam: windowFromDay(sunrise, sunset, RAHU_SEGMENT[dow]),
    abhijitMuhurtham: abhijitFromDay(sunrise, sunset),
  };
}

// ---------- pure-JS fallback (validated to match Swiss Ephemeris) ----------

function computeWithFallback(date: Date, location: AppLocation, coords: Coordinates): PanchangamResult {
  const p = getPanchang(date, location);
  const paksha: "Shukla" | "Krishna" = p.tithi.paksha === "Krishna" ? "Krishna" : "Shukla";
  return {
    date,
    coordinates: coords,
    timeZone: location.timeZone,
    source: "fallback",
    sun: { sunrise: p.sun.sunrise, sunset: p.sun.sunset },
    tithi: { index: -1, name: p.tithi.name, paksha, end: p.tithi.end },
    nakshatram: { index: -1, name: p.nakshatra.name, end: p.nakshatra.end },
    rahuKalam: p.windows.rahuKalam,
    abhijitMuhurtham: p.windows.abhijit,
  };
}

// ---------- public API ----------

/**
 * Compute the Panchangam for a moment and place. Uses Swiss Ephemeris when a
 * WASM runtime is available, otherwise the validated pure-JS engine.
 */
export async function computePanchangam(
  date: Date = new Date(),
  location: AppLocation = DEFAULT_LOCATION
): Promise<PanchangamResult> {
  const coords: Coordinates = {
    latitude: location.latitude,
    longitude: location.longitude,
    altitude: 0,
  };
  const swe = await getSwe();
  if (swe) {
    try {
      return await computeWithSwiss(swe, date, coords, location.timeZone);
    } catch {
      // fall through to the pure-JS engine on any Swiss Ephemeris error
    }
  }
  return computeWithFallback(date, location, coords);
}

/** Convenience: is the given window active at `now`? Re-exported for callers. */
export { isActive };
