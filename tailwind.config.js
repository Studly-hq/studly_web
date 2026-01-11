/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        reddit: {
          bg: '#0D1117',           // Main page/feed background (matched to Course Bank)
          card: '#1A1A1B',         // Post cards and surfaces
          cardHover: '#272729',    // Card hover state
          border: '#343536',       // Borders and dividers
          text: '#D7DADC',         // Primary text
          textMuted: '#818384',    // Secondary/metadata text
          orange: '#FF4500',       // Reddit orange accent
          blue: '#0079D3',         // Links and blue accent
          input: '#272729',        // Search bar background
        }
      },
      fontFamily: {
        righteous: ['Righteous', 'cursive'],
      }
    },
  },
  plugins: [],
};