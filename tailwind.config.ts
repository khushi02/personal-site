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
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      maxWidth: {
        content: "42rem",
      },
      colors: {
        // Ochre Sunset: a warm cream paper, soft charcoal ink, hairline borders,
        // a brighter terracotta for hovers, and a mustard-ochre utility accent.
        ink: "#3a3128",
        muted: "#948b7b",
        line: "#d6c9ad",
        paper: "#ece1cb",
        terracotta: "#b05e34",
        ochre: "#9a6f22",
      },
    },
  },
  plugins: [],
};

export default config;
