// "Veranda Theme" (The Sacred Aangan) design tokens — parchment canvas, deep
// teak wood, marigold brand, brass filigree. Exported as raw JS strings for
// icon tints, navigator options and inline styles.
//
// NOTE: the Utsav-era keys (coral/coralDeep/gold/goldDark/blush) are kept as
// aliases mapped into the Veranda palette so existing components stay valid.
export const veranda = {
  parchment: "#FDFBF7", // Primary canvas / background
  parchmentMuted: "#F5EFEB", // Secondary card / grouped containers
  teak: "#2D1E12", // Primary typography, carved-wood headers
  teakSubtle: "#6A584C", // Secondary text, timestamps, subtitles
  marigold: "#D97706", // Brand primary, active tabs, primary buttons
  mango: "#15803D", // Auspicious (Shubha) indicators
  terracotta: "#B91C1C", // Inauspicious (Varjyam) warnings
  brass: "#C5A059", // Metallic accents, borders, sacred highlights
  turmeric: "#FEF3C7", // Soft pill / tag / banner backgrounds

  // Aliases → Veranda values (keep components compiling after the Utsav era)
  coral: "#D97706", // primary CTA → marigold
  coralDeep: "#B45309", // strong accent → deep marigold
  gold: "#C5A059", // gold fills → brass
  goldDark: "#92400E", // dark amber label / neutral-state text
  blush: "#FEF3C7", // soft tint → turmeric
} as const;

export type VerandaColor = keyof typeof veranda;
