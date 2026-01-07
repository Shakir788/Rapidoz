/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MOROCCAN RED OVERRIDE
        red: {
          50: '#FDF2F2',
          100: '#FDE8E9',
          500: '#D94046',
          600: '#C1272D', // Main Flag Red
          700: '#A61B21', // Darker Red for Hover
          800: '#8B1419',
        },
        // MOROCCAN GREEN OVERRIDE
        green: {
          50: '#E6F4EA',
          100: '#C3E3CD',
          500: '#008544',
          600: '#006233', // Star Green
          700: '#004D28',
        },
      },
    },
  },
  plugins: [],
}