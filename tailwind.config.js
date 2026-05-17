/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Noto Serif SC"', '"Songti SC"', 'serif'],
        body: ['Inter', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgb(var(--color-accent-rgb) / 0.34)',
      },
    },
  },
  plugins: [],
};
