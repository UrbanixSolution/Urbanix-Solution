import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:          '#0b0f19',   // Main page background — rich dark navy
          surface:     '#111827',   // Card & surface background
          'surface-2': '#1a2235',   // Slightly elevated surface
          border:      '#1e2c44',   // Subtle border
          accent:      '#3d5a99',   // Muted indigo accent
          'accent-dim':'#2a3f6b',   // Darker indigo for hover states
          text:        '#f5f5f7',   // Near-white primary text
          'text-muted':'#8892a4',   // Silver/grey secondary text
          'text-dim':  '#4a5568',   // Dimmed tertiary text
          italic:      '#9ab0d8',   // Italic serif accent — cool blue-grey
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'serif'],
        sans:  ['var(--font-sans)',  'system-ui', 'sans-serif'],
      },
      fontSize: {
        '7xl': ['4.5rem',  { lineHeight: '1.05' }],
        '8xl': ['6rem',    { lineHeight: '1' }],
        '9xl': ['8rem',    { lineHeight: '1' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'surface-glow': 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(61,90,153,0.12), transparent)',
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover': '0 4px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(155,176,216,0.12)',
        'btn':     '0 0 0 1px rgba(61,90,153,0.5), 0 4px 16px rgba(61,90,153,0.25)',
        'btn-hover': '0 0 0 1px rgba(61,90,153,0.7), 0 6px 24px rgba(61,90,153,0.35)',
      },
      animation: {
        'fade-up':   'fadeUp 0.7s ease forwards',
        'fade-in':   'fadeIn 0.5s ease forwards',
        'ticker':    'ticker 30s linear infinite',
      },
      keyframes: {
        fadeUp:  {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn:  {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
