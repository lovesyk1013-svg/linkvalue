/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d5f5',
          300: '#a3b8e8',
          400: '#7a95d8',
          500: '#5a75c8',
          600: '#4560b8',
          700: '#2d4a9e',
          800: '#1a3280',
          900: '#0d1f5c',
          950: '#080f3a',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4a843',
          600: '#b8902a',
          700: '#9a7520',
          800: '#7c5c18',
          900: '#5e4410',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #0d1f5c 0%, #1a3280 50%, #2d4a9e 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4a843 0%, #fbbf24 50%, #d4a843 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(13,31,92,0) 0%, rgba(13,31,92,0.8) 100%)',
      },
    },
  },
  plugins: [],
}
