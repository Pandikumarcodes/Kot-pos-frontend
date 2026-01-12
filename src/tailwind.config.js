const kotTheme = require("./tailwind-kot-theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: kotTheme.colors,
      spacing: kotTheme.spacing,
      boxShadow: kotTheme.boxShadow,
    },
  },
  plugins: [],
};
