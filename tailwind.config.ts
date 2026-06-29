import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-hand)", "cursive"],
      },
      maxWidth: {
        content: "42rem",
      },
      colors: {
        ink: "#1a1a1a",
        muted: "#6b6b6b",
        line: "#e5e5e5",
        paper: "#fcfbf7",
        // Highlighter / marker accents — one per section.
        marker: {
          yellow: "#ffe08a",
          teal: "#a7e8d8",
          pink: "#ffc2d1",
          blue: "#b9d4ff",
        },
      },
    },
  },
  plugins: [],
};

export default config;
