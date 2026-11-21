/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          bg: '#0a0d14',
          card: '#111726',
          border: '#1f293d',
          accent: '#8b5cf6',
          glow: '#a78bfa',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e'
        }
      }
    },
  },
  plugins: [],
}
