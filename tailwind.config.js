/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-black-1': '#05010e',
        'custom-black-2': '#110D1A',
        'custom-black-3': '#21273F',
        'custom-orange-1': '#FB6705',
        'custom-gray-1': '#575B68',
      },
    },
  },
  plugins: [],
};
