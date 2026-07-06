import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f5f0ff",
          100: "#e9ddff",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6",
        },
        gold: {
          50:  "#fefbea",
          400: "#fcd34d",
          500: "#f0b429",
          600: "#d97706",
        },
      },
    },
  },
  plugins: [],
};

export default config;
