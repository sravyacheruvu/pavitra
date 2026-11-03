import { Panchang } from "./panchang";

/**
 * Builds the components of the daily sankalpam (ritual intention) from the
 * computed panchang: samvatsara, ayana, ritu, masa, paksha, tithi, vaara
 * (weekday) and nakshatra — the elements one recites before a puja. When the
 * user's name / gotra are known, the recitation names the performer too.
 */

const VAARA: Record<number, { en: string; sa: string }> = {
  0: { en: "Sunday", sa: "Bhaanu vaasara" },
  1: { en: "Monday", sa: "Indu vaasara" },
  2: { en: "Tuesday", sa: "Bhauma vaasara" },
  3: { en: "Wednesday", sa: "Saumya vaasara" },
  4: { en: "Thursday", sa: "Guru vaasara" },
  5: { en: "Friday", sa: "Bhrigu vaasara" },
  6: { en: "Saturday", sa: "Sthira vaasara" },
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
  /** A readable one-line recitation joining the components. */
  line: string;
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
  const vaara = VAARA[wd] ?? { en: "", sa: "" };
  const ayana = ayanaFor(p.date, tz);

  let line =
    `${p.samvatsara} nama samvatsare, ${ayana}, ${p.ritu} ritau, ` +
    `${p.masa} mase, ${p.tithi.paksha} pakshe, ${p.tithi.name} tithau, ` +
    `${vaara.sa}, ${p.nakshatra.name} nakshatra yuktayam`;

  const gotra = opts?.gotra?.trim();
  const name = opts?.name?.trim();
  if (gotra) line += `, ${gotra} gotrasya`;
  if (name) line += `, ${name} naama aham`;

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
  };
}
