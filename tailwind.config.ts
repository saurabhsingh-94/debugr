import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0f14",
        panel: "#111827",
        accent: "#22d3ee",
        secondary: "#8b5cf6",
        steam: {
          darkest: "#0a0f14",
          dark: "#111827",
          medium: "#1b2838",
          light: "#c7d5e0",
          accent: "#22d3ee",
          purple: "#8b5cf6",
        }
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
