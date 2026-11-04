import { Panchang } from "./panchang";

/**
 * Builds the components of the daily sankalpam (ritual intention) from the
 * computed panchang: samvatsara, ayana, ritu, masa, paksha, tithi, vaara
 * (weekday) and nakshatra — the elements one recites before a puja. When the
 * user's name / gotra are known, the recitation names the performer too.
 */

const VAARA: Record<number, { en: string; sa: string; dev: string }> = {
  0: { en: "Sunday", sa: "Bhaanu vaasara", dev: "भानु वासरे" },
  1: { en: "Monday", sa: "Indu vaasara", dev: "इन्दु वासरे" },
  2: { en: "Tuesday", sa: "Bhauma vaasara", dev: "भौम वासरे" },
  3: { en: "Wednesday", sa: "Saumya vaasara", dev: "सौम्य वासरे" },
  4: { en: "Thursday", sa: "Guru vaasara", dev: "गुरु वासरे" },
  5: { en: "Friday", sa: "Bhrigu vaasara", dev: "भृगु वासरे" },
  6: { en: "Saturday", sa: "Sthira vaasara", dev: "स्थिर वासरे" },
};

export type Sankalpam = {
  samvatsara: string;
  ayana: string;
  ritu: string;
  masa: string;
  paksha: string;
  tithi: string;
  vaara: string;
  vaaraSa: string;
  nakshatra: string;
  /** A readable one-line recitation joining the components (roman/IAST). */
  line: string;
  /** The same recitation in Devanagari, for transliteration into other scripts. */
  lineSa: string;
};

export type SankalpamOpts = { name?: string; gotra?: string };

function weekdayIndex(date: Date, timeZone: string): number {
  const wd = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
}

/** Uttarayana ≈ Makara Sankranti (14 Jan) → 15 Jul; Dakshinayana otherwise. */
function ayanaFor(date: Date, timeZone: string): string {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone, month: "2-digit", day: "2-digit",
  }).format(date);
  const [m, d] = p.split("-").map(Number);
  const afterMakara = m > 1 || (m === 1 && d >= 14);
  const beforeKarka = m < 7 || (m === 7 && d <= 15);
  return afterMakara && beforeKarka ? "Uttarayana" : "Dakshinayana";
}

export function buildSankalpam(p: Panchang, opts?: SankalpamOpts): Sankalpam {
  const tz = p.location.timeZone;
  const wd = weekdayIndex(p.date, tz);
  const vaara = VAARA[wd] ?? { en: "", sa: "", dev: "" };
  const ayana = ayanaFor(p.date, tz);

  let line =
    `${p.samvatsara} nama samvatsare, ${ayana}, ${p.ritu} ritau, ` +
    `${p.masa} mase, ${p.tithi.paksha} pakshe, ${p.tithi.name} tithau, ` +
    `${vaara.sa}, ${p.nakshatra.name} nakshatra yuktayam`;

  const ayanaSa = ayana === "Uttarayana" ? "उत्तरायण" : "दक्षिणायन";
  let lineSa =
    `${p.samvatsaraSa} नाम संवत्सरे, ${ayanaSa}, ${p.rituSa} ऋतौ, ` +
    `${p.masaSa} मासे, ${p.tithi.pakshaSa} पक्षे, ${p.tithi.sa} तिथौ, ` +
    `${vaara.dev}, ${p.nakshatra.sa} नक्षत्र युक्तायाम्`;

  const gotra = opts?.gotra?.trim();
  const name = opts?.name?.trim();
  if (gotra) { line += `, ${gotra} gotrasya`; lineSa += `, ${gotra} गोत्रस्य`; }
  if (name) { line += `, ${name} naama aham`; lineSa += `, ${name} नाम अहम्`; }

  return {
    samvatsara: p.samvatsara,
    ayana,
    ritu: p.ritu,
    masa: p.masa,
    paksha: p.tithi.paksha,
    tithi: p.tithi.name,
    vaara: vaara.en,
    vaaraSa: vaara.sa,
    nakshatra: p.nakshatra.name,
    line,
    lineSa,
  };
}
