/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        dark: '#0a0a0a',
        'dark-gray': '#1a1a1a',
        'medium-gray': '#262626',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'blink': 'blink 1s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        }
      },
      backgroundSize: {
        '200': '200% 100%',
      }
    },
  },
  plugins: [],
}