/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  // NativeWind preset is required so Tailwind classes compile for React Native.
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // "Veranda Theme" tokens (design.md)
        veranda: {
          parchment: "#FDFBF7",
          parchmentMuted: "#F5EFEB",
          teak: "#2D1E12",
          teakSubtle: "#6A584C",
          marigold: "#D97706",
          mango: "#15803D",
          terracotta: "#B91C1C",
          brass: "#C5A059",
          turmeric: "#FEF3C7",
          // Utsav-era aliases mapped into the Veranda palette
          coral: "#D97706",
          coralDeep: "#B45309",
          gold: "#C5A059",
          goldDark: "#92400E",
          blush: "#FEF3C7",
        },
      },
      fontFamily: {
        // Playfair Display = serif manuscript dignity for titles; body stays sans.
        display: ['"Playfair Display"', "Georgia", "serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
