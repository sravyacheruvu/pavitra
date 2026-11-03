/** Festival seed data surfaced by the Daily Veranda spotlight. */
export type Festival = {
  id: string;
  name: string;
  /** Observance date label (region-specific). */
  date: string;
  /** Human-readable timing description. */
  when: string;
  blurb: string;
};

export const SPOTLIGHT_FESTIVAL: Festival = {
  id: "varalakshmi-vratam",
  name: "Varalakshmi Vratam",
  /** Telugu / Tamil / Kannada reckoning (first Friday before Shravana Purnima). */
  date: "Fri, 21 Aug 2026",
  when: "Shravana Shukla · the Friday before Purnima.",
  blurb: "Tap to open the full pooja guide, samagri list, and audio.",
};
