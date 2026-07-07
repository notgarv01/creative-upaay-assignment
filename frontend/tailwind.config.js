/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#080720',      // Deep navy
          primary: '#4F46E5',   // Indigo/blue branding accent
          bg: '#F8F9FD',        // Light body background
          textGray: '#8B98B1',  // Muted text
          cardBg: '#FFFFFF',    // White card background
        }
      }
    },
  },
  plugins: [],
}
