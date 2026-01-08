/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Content must match your folder structure exactly
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")], // <--- THIS LINE IS CRITICAL FOR V4
  theme: {
    extend: {},
  },
  plugins: [],
}