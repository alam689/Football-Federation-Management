/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bff-green': '#00684a',
        'bff-green-deep': '#023d2e',
        'bff-red': '#ee2939',
        'bff-gold': '#e3a72f',
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
