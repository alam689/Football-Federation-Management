/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Token names kept stable; values carry the international palette.
        'bff-green': '#2c5f92',
        'bff-green-deep': '#17324f',
        'bff-red': '#d23b46',
        'bff-gold': '#c98a1f',
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
        body: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  // The federation console ships its own hand-authored design system in
  // src/styles/design-system.css. Disable Tailwind's preflight so its reset
  // does not clash with those base element styles.
  corePlugins: { preflight: false },
  plugins: [],
};
