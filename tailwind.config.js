/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'dark': '#0a0a0a',
        'dark-gray': '#1a1a1a',
        'medium-gray': '#2a2a2a',
      },
    },
  },
  plugins: [],
}
