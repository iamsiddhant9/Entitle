import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF7',
        ink: '#1A1A18',
        secondary: '#5C5B57',
        muted: '#888780',
        brand: '#1D9E75',
        'brand-dark': '#0F6E56',
        accent: '#2563A8',
        surface: '#F0EDE4',
        'surface-green': '#E8F4EE',
        border: '#E2DED5',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        bounce3: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-6px)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0', transform: 'scale(1.6)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        borderPulse: {
          '0%, 100%': { boxShadow: '0 0 0 1px #1D9E75, 0 4px 20px rgba(29,158,117,0.12)' },
          '50%': { boxShadow: '0 0 0 2px #1D9E75, 0 4px 28px rgba(29,158,117,0.22)' },
        },
      },
      animation: {
        bounce3: 'bounce3 1.2s infinite',
        pulse2: 'pulse2 2s infinite',
        fadeUp: 'fadeUp 0.55s ease forwards',
        borderPulse: 'borderPulse 3s infinite',
      },
    },
  },
  plugins: [],
}
export default config
