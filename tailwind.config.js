/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--c-ink-soft) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        'line-strong': 'rgb(var(--c-line-strong) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          dark: 'rgb(var(--c-accent-dark) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Hanken Grotesk"', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Spline Sans Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { shell: '76rem' },
      transitionTimingFunction: {
        curve: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'resolve-in': {
          '0%': { opacity: '0', filter: 'blur(8px)' },
          '60%': { opacity: '1', filter: 'blur(0)' },
          '72%': { opacity: '0.72' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
      },
      animation: {
        'resolve-in': 'resolve-in 1s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
