/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        window: "rgb(var(--window-color) / <alpha-value>)",
        base: "rgb(var(--base-color) / <alpha-value>)",
        primary: "rgb(var(--primary-color) / <alpha-value>)",
        text: "rgb(var(--text-color) / <alpha-value>)",
      },
      fontSize: {
        medium: "1rem",
      },
      fontFamily: {
        cascadia: ["cascadia"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
