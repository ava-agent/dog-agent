/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF2D55",
        secondary: "#FF6B6B",
        accent: "#FFD93D",
        dark: {
          900: "#0A0A0A",
          800: "#1A1A1A",
          700: "#2A2A2A",
          600: "#3A3A3A",
          500: "#4A4A4A",
        },
      },
    },
  },
  plugins: [],
};
