import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        // Warm ivory cotton cardstock: cream sheet, warm near-black ink,
        // hairline rules, and a terracotta that only appears on hover.
        paper: "#f6f0e2",
        ink: "#2b2620",
        muted: "#6f6657",
        line: "#cfc3a8",
        rule: "#b9ac90",
        accent: "#a2552d",
      },
    },
  },
  plugins: [],
};

export default config;
