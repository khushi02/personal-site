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
        // Japandi: warm greige paper, soft charcoal ink, hairline borders,
        // one restrained terracotta accent.
        ink: "#33302b",
        muted: "#928c80",
        line: "#d0c7b3",
        paper: "#e8e0cf",
        terracotta: "#a75f3b",
      },
    },
  },
  plugins: [],
};

export default config;
