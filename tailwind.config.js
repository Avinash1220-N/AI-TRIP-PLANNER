/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          light: '#f0fdf4', // emerald-50
          DEFAULT: '#10b981', // emerald-500
          dark: '#064e3b', // emerald-950
          accent: '#84cc16', // lime-500
        }
      },
      backgroundImage: {
        'eco-gradient': 'linear-gradient(135deg, #10b981, #059669, #84cc16)',
      }
    },
  },
  plugins: [],
}
