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
        sidebar: "#0f172a",
        card: "#111827",
        border: "#1f2937",
        accent: {
          cyan: "#22d3ee",
          green: "#22c55e",
          red: "#ef4444",
          yellow: "#facc15",
        },
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
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
