/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfbf7',
          100: '#fbf7ee',
          200: '#f5ecda',
          300: '#eddcc1',
          400: '#e2c5a0',
          500: '#d7af80',
        },
        blush: {
          50: '#fff5f7',
          100: '#ffe8ec',
          200: '#ffd0d9',
          300: '#ffa6b8',
          400: '#fe6d8f',
          500: '#f43f6c',
        },
        rosewood: {
          50: '#fcf4f5',
          100: '#f7e5e7',
          200: '#f0ced3',
          300: '#e3a9b3',
          400: '#d17888',
          500: '#bd5366',
          600: '#a33c4f',
          700: '#872f3f',
          800: '#712a36',
          900: '#5f2630',
        },
        burgundy: {
          500: '#7e172a',
          600: '#691222',
          700: '#550d1a',
          800: '#430914',
          900: '#32060e',
        },
        champagne: {
          100: '#faf4e5',
          200: '#f4e7c7',
          300: '#ecd79f',
          400: '#e1c371',
          500: '#d4ab48',
        },
        lavender: {
          100: '#f3f0f7',
          200: '#e6e0ef',
          300: '#d3c7e3',
          400: '#b8a3cf',
          500: '#9b7ebb',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        handwriting: ['"Caveat"', '"Dancing Script"', 'cursive'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'scrapbook': '0 10px 25px -5px rgba(113, 42, 54, 0.1), 0 8px 10px -6px rgba(113, 42, 54, 0.08)',
        'polaroid': '0 15px 30px -8px rgba(95, 38, 48, 0.18), 0 4px 6px -2px rgba(95, 38, 48, 0.05)',
        'soft-glow': '0 0 25px -5px rgba(254, 109, 143, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        }
      }
    },
  },
  plugins: [],
}
