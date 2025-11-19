/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          yellow: "#FBBF24",
          navy: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};
