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
        background: "#09090b",
        panel: "#121217",
        accent: "#fafaf9",
        secondary: "#a1a1aa",
        border: "rgba(255, 255, 255, 0.08)",
        surface: "rgba(255, 255, 255, 0.03)",
        ring: "rgba(255, 255, 255, 0.15)",
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
