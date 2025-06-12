// Needed to keep Intellisense happy, which for some reason does not like Tailwind v4

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
