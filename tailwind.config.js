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
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translate(-50%, -100%)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};