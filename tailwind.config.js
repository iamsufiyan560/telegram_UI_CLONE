/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // dark_theme: "#2f2f2f",
        primary: "#8C8C8C",
      },
      backgroundImage: (theme) => ({
        "light-pattern": "url('./light.png')",
        "dark-pattern": "url('./assets/bg.png')",
      }),
    },
  },
  plugins: [],
};
