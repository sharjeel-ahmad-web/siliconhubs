import type { Config } from 'tailwindcss';
// @ts-ignore - Internal Tailwind CSS utility without type definitions
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

// Plugin to add Tailwind colors as CSS variables
function addVariablesForColors({
  addBase,
  theme,
}: {
  addBase: Function;
  theme: Function;
}) {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
  addBase({
    ':root': newVars,
  });
}

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'star-btn': 'star-btn calc(var(--duration)*1s) linear infinite',
      },
      keyframes: {
        'star-btn': {
          '0%': { offsetDistance: '0%' },
          '100%': { offsetDistance: '100%' },
        },
      },
      colors: {
        // Logo Colors
        'brand-orange': '#F97316',
        'brand-orange-alt': '#F58122',
        'brand-blue': '#37AFE1',
        'brand-cyan': '#31A4DB',
        // Primary Brand Colors
        'primary-blue': '#2563EB',
        'secondary-purple': '#7C3AED',
        'electric-purple': '#8B5CF6',
        'accent-teal': '#0D9488',
        'dark-navy': '#1E293B',
        'slate-gray': '#64748B',
        'light-bg': '#F8FAFC',
        'dark-text': '#0F172A',
        'success-green': '#10B981',
        'warning-amber': '#F59E0B',
        'error-red': '#EF4444',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        'fira-code': ['Fira Code', 'monospace'],
      },
      fontSize: {
        'h1-desktop': '3.5rem',
        'h2-desktop': '2.25rem',
        'h3-desktop': '1.875rem',
        'body-desktop': '1.125rem',
        'h1-mobile': '2.25rem',
        'h2-mobile': '1.875rem',
        'h3-mobile': '1.5rem',
        'body-mobile': '1rem',
      },
      fontWeight: {
        heading: '600',
        'heading-bold': '700',
        'heading-extra-bold': '800',
        body: '400',
        'body-medium': '500',
        code: '500',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), addVariablesForColors],
};

export default config;
