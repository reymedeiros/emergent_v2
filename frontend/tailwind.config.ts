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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
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
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        yellow: {
          DEFAULT: 'hsl(var(--yellow-primary))',
          text: 'hsl(var(--yellow-primary-text))',
        },
        cyan: {
          DEFAULT: '#5CE1E6',
          light: '#66eaff',
          dark: '#38B6FF',
          glow: 'rgba(92, 225, 230, 0.3)',
        },
        // Emergent specific colors
        'agent-running': '#67CB65',
        'agent-waiting': '#5FD3F3',
        'teal-accent': '#00CCAF',
      },
      fontFamily: {
        sans: ['Brockmann', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        pixel: ['Ndot', 'monospace'],
        brockmann: ['Brockmann', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'status-pulse': {
          '0%': {
            boxShadow: '0 0 0 0 var(--status-pulse-color, rgba(46, 187, 229, 0.7))',
          },
          '70%': {
            boxShadow: '0 0 0 6px var(--status-pulse-transparent, rgba(46, 187, 229, 0))',
          },
          '100%': {
            boxShadow: '0 0 0 0 var(--status-pulse-transparent, rgba(46, 187, 229, 0))',
          },
        },
        'border-beam': {
          to: {
            offsetDistance: '100%',
          },
        },
        'border-blink': {
          '0%, 100%': {
            borderColor: 'rgba(77, 159, 255, 0.31)',
            boxShadow: '0 0 0 rgba(77, 159, 255, 0)',
          },
          '50%': {
            borderColor: '#4d9fff',
            boxShadow: '0 0 8px 2px rgba(77, 159, 255, 0.4)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s infinite linear',
        'status-pulse': 'status-pulse 2s ease-out infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        'border-blink': 'border-blink 2s ease-in-out infinite',
      },
      boxShadow: {
        glow: '0 0 20px rgba(92, 225, 230, 0.3)',
        'glow-lg': '0 0 40px rgba(92, 225, 230, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
