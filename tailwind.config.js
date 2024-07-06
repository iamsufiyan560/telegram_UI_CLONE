/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        dark_theme:"#333333",
        primary:"#8C8C8C"
      },
    
    },
  },
  plugins: [],
};
