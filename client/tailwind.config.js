/** @type {import('tailwindcss').Config} */
import scrollbar from 'tailwind-scrollbar';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Optional: extend scrollbar styling
      scrollbar: {
        DEFAULT: {
          thumb: 'rounded',
        },
      },
    },
  },
  plugins: [scrollbar],
}
