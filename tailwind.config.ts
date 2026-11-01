import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        offwhite: 'var(--offwhite)',
        olive: 'var(--olive)',
        black: 'var(--black)',
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        line: 'var(--line)',
        white: 'var(--white)',
      },
      fontFamily: {
        display: ['var(--font-anton)', 'Impact', 'sans-serif'],
        accent: ['var(--font-yellowtail)', 'cursive'],
        sans: [
          'var(--font-inter)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      letterSpacing: {
        display: '0.02em',
        caption: '0.05em',
      },
      fontSize: {
        'h1': ['clamp(2.5rem, 8vw, 6rem)', { lineHeight: '0.95', letterSpacing: '0.02em' }],
        'h2': ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1.05', letterSpacing: '0.02em' }],
        'caption': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
};

export default config;

