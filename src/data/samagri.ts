/** Samagri (materials) checklists for the Pooja Companion, per vidhi mode. */
export type Vidhi = "sankshipta" | "sampurna";

export const SAMAGRI_BY_VIDHI: Record<Vidhi, string[]> = {
  sankshipta: [
    "Kalasha (pot) with water",
    "Turmeric & kumkum",
    "Flowers",
    "Betel leaves & nuts",
    "Lamp, ghee & wicks",
    "Fruits & jaggery",
  ],
  sampurna: [
    "Kalasha (pot) with water",
    "Coconut with mango leaves",
    "Turmeric & kumkum",
    "Nine-thread sacred yarn (toranam)",
    "Assorted flowers & garland",
    "Betel leaves & nuts",
    "Lamp, ghee & cotton wicks",
    "Camphor & incense",
    "Fruits, jaggery & nine grains",
    "New blouse cloth / saree",
  ],
};
