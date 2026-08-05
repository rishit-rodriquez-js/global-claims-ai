/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        azure: {
          50: '#F0F6FF',
          100: '#E0EDFF',
          500: '#0078D4',
          600: '#0266B4',
          700: '#004E8C',
        },
        linear: {
          bg: '#0F172A',
          card: '#1E293B',
          border: '#334155',
          text: '#F8FAFC',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
