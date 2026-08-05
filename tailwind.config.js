/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
      '5xl': '3440px',
    },
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#000000',
          light: '#09090b',
          card: '#09090b',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#e1c564',
          dark: '#aa7c11',
        },
        border: {
          DEFAULT: '#27272A',
        },
      },
      fontFamily: {
        hero: ['var(--font-bebas)', 'Bebas Neue', 'sans-serif'],
        display: ['var(--font-bebas)', 'Bebas Neue', 'sans-serif'],
        sans: ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
        label: ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 16s linear infinite',
        'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 20s linear infinite',
        'fadeSlideUp': 'fadeSlideUp 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
