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
        ink: "#2f2b26",
        muted: "#8a8276",
        line: "#e4ddd0",
        paper: "#f7f3ea",
        // Earth-tone accents.
        sage: { light: "#c6d0ac", DEFAULT: "#9caa7c" }, // section headers
        terracotta: { light: "#e0a98c", DEFAULT: "#c1714f" }, // subheaders + bullets
        clay: { light: "#dcc8aa", DEFAULT: "#b89a78" }, // complementary brown
        postit: "#f0dd9a", // sticky-note yellow
      },
    },
  },
  plugins: [],
};

export default config;
