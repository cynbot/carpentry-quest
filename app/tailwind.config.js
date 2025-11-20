/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Carpentry Quest custom colors
        'primary-red': '#C41E3A',
        'charcoal': '#2C3E50',
        'metallic': '#B8B8B8',
        'sand': '#F4E5C2',
        'success': '#27AE60',
        'warning': '#FF6B35',
      },
    },
  },
  plugins: [],
}
