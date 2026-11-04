/**
 * Festive banner images for the upcoming-festival spotlight. Six warm, abstract
 * banners (bundled) are assigned to a festival deterministically by its slug, so
 * each festival always shows the same banner.
 */
const BANNERS = [
  require("../assets/festivals/lamps.jpg"),
  require("../assets/festivals/rose.jpg"),
  require("../assets/festivals/emerald.jpg"),
  require("../assets/festivals/indigo.jpg"),
  require("../assets/festivals/saffron.jpg"),
  require("../assets/festivals/teal.jpg"),
];

/** A stable banner for a festival, chosen from its slug. */
export function festivalBanner(slug: string | undefined) {
  const s = slug ?? "";
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return BANNERS[h % BANNERS.length];
}
