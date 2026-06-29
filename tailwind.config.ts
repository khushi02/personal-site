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
      },
      maxWidth: {
        content: "42rem",
      },
      colors: {
        ink: "#1a1a1a",
        muted: "#6b6b6b",
        line: "#e5e5e5",
      },
    },
  },
  plugins: [],
};

export default config;
