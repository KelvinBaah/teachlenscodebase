import type { Config } from "tailwindcss";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const colors = require("./data/config/colors.js");

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        neutral: colors.neutral,
        success: colors.success,
        warning: colors.warning,
        danger: colors.danger,
        info: colors.info,
      },
      boxShadow: {
        soft: "0 8px 24px rgba(17, 24, 39, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
