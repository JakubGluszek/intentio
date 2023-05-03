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
        danger: "rgb(var(--danger-color) / <alpha-value>)",
        darker: "rgb(0 0 0 / <alpha-value>)",
        lighter: "rgb(255 255 255 / <alpha-value>)",
      },
      fontSize: {
        medium: "1rem",
      },
      fontFamily: {
        quicksand: ["Quicksand"],
      },
      transitionProperty: {
        lol: "left, right",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
