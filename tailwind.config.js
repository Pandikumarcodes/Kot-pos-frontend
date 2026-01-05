/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        kot: {
          dark: "#1F262E",
          card: "#262E37",
          sidebar: "#622125",
          active: "#D8434D",
          teal: "#4FD1C5",
          gold: "#F6AD55",
        },
      },
    },
  },
  plugins: [],
};
