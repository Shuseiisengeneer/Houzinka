import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0F766E', dark: '#0C5F58', light: '#14B8A6' },
        accent: { DEFAULT: '#EA580C', dark: '#C2410C' },
      },
    },
  },
  plugins: [],
};

export default config;
