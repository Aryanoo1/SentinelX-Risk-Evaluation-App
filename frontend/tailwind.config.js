// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9', // cyan-500
        accent: '#6366f1', // indigo-500
        background: '#0f172a', // slate-900
        surface: '#1e293b', // slate-800
        text: '#f1f5f9', // slate-100
      },
    },
  },
  plugins: [],
};
