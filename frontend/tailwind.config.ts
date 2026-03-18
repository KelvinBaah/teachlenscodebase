import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10212b",
        mist: "#eff5f1",
        pine: "#1f5c4a",
        clay: "#b8693d",
        sand: "#f6efe4",
      },
    },
  },
  plugins: [],
};

export default config;
