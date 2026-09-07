/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Todos los colores salen de variables CSS en src/index.css.
      // Para recolorear la web entera, cambia esas variables (canal RGB "r g b").
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--c-ink-soft) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--c-primary) / <alpha-value>)',
          dark: 'rgb(var(--c-primary-dark) / <alpha-value>)',
          soft: 'rgb(var(--c-primary-soft) / <alpha-value>)',
        },
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Spectral', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { shell: '75rem' },
      boxShadow: {
        card: '0 1px 2px rgb(15 23 42 / 0.04), 0 12px 28px -14px rgb(15 23 42 / 0.16)',
        lift: '0 2px 6px rgb(15 23 42 / 0.06), 0 24px 48px -20px rgb(15 23 42 / 0.24)',
      },
      transitionTimingFunction: {
        curve: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
