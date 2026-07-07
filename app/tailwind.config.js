/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Heartwood palette — warm wood and moss over the old workshop charcoal
        'heartwood': '#E09F3E',
        'heartwood-deep': '#B87333',
        'moss': '#8A9B68',
        'charcoal': '#2C3E50',
        'metallic': '#B8B8B8',
        'sand': '#F4E5C2',
        'success': '#27AE60',
        'warning': '#FF6B35',
        // Kept for git-history nostalgia (Carpentry Quest's motorcycle red)
        'primary-red': '#C41E3A',
      },
    },
  },
  plugins: [],
}
