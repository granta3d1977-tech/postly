import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 18px 60px rgba(124, 58, 237, 0.25)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(139, 92, 246, 0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(139, 92, 246, .12)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
