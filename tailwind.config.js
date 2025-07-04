/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B5BCD',
        secondary: '#FF6B9D',
        accent: '#FFC857',
        surface: '#FFFFFF',
        background: '#F7F3FF',
        success: '#4ECB71',
        warning: '#FFB84D',
        error: '#FF6B6B',
        info: '#54A0FF',
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        body: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'kids': '0 8px 16px rgba(0, 0, 0, 0.1)',
        'button': '0 4px 8px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'bounce-gentle': 'bounce 1s infinite ease-in-out',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'celebrate': 'celebrate 0.6s ease-in-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        celebrate: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}