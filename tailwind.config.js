/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        gray: {
          100: '#F7F7F7',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        blue: '#0066FF',
        mint: '#00FFC6',
      },
    },
  },
  plugins: [],
}