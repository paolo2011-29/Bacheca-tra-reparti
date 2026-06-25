/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        foresta: '#2D1B4E',
        'foresta-scuro': '#1F1235',
        pergamena: '#EFE8DA',
        falo: '#E8B923',
        corda: '#A98D63',
        fazzoletto: '#3B73A8',
        rosso: '#C0392B',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
