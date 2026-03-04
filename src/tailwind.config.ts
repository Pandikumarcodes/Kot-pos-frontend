import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        kot: {
          primary: "#F4F7F5", // page background
          sidebar: "#D0E8DB", // sidebar / left banner
          header: "#E6F2EB", // header / icon box bg
          stats: "#D0E8DB", // banner background
          chart: "#C1D9CD", // borders ✅ exact match
          text: "#7E8681", // muted text
          dark: "#4A5F52", // primary action color
          darker: "#2D3A33", // headings / strong text
          light: "#E6F2EB", // light section bg
          white: "#FFFFFF", // white areas
        },
      },
      boxShadow: {
        kot: "0 2px 8px rgba(126,134,129,0.10)",
        "kot-lg": "0 4px 16px rgba(126,134,129,0.15)",
      },
    },
  },
  plugins: [],
} as Config;
