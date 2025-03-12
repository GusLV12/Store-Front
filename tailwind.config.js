/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1976D2',
        secondary: '#D32F2F',
        background: '#F5F5F5',
        text: '#333333',
      },
    },
  },
  plugins: [],
};
