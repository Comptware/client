//tailwinf=d.config.js
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
      fontFamily: {
        caslon: ['BigCaslon', 'sans-serif'],
        gibson: ['Gibson', 'sans-serif'],
        "gibson-bold": ['GibsonBold', 'sans-serif'],
      },
      colors: {
        current: "currentColor",
        transparent: "transparent",
        white: "#FFFFFF",
        black: "#000000",
        yellow: "#ffde6f",
        dark: "#1D2430",
        "light-yellow": "#f9f8df",
        "dark-blue": "#000673",
        "light-blue": "#01C8E1",
        "sky-blue": "#CDE5FD",
        "ice-blue": "#CCF4F9",
        "dark-gray": "#8E90A8",
        "light-gray": "#EBEBEB",
        "shadow-gray": "#D9E4F0",
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
