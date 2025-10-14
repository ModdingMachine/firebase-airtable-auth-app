/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-bg': '#f0f4f8',
        'pastel-blue': '#a2d2ff',
        'pastel-pink': '#ffafcc',
        'pastel-light-blue': '#bde0fe',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

