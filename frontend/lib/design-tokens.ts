// Design tokens extracted from Emergent.sh UI
// These are used to ensure pixel-perfect matching with the reference design

export const colors = {
  // Backgrounds
  background: {
    primary: 'hsl(240, 3%, 6%)',      // #0f0f10 - Main app background
    secondary: 'hsl(240, 2%, 12%)',   // #1e1e1f - Cards, inputs, elevated surfaces
    tertiary: 'hsl(240, 2%, 16%)',    // #282829 - Hover states, active elements
    elevated: 'hsl(240, 2%, 9%)',     // #161617 - Modals, overlays
  },

  // Text colors
  text: {
    primary: 'hsl(210, 40%, 98%)',      // #f8fafc - Main text
    secondary: 'hsl(220, 5%, 65%)',     // #a0a2a8 - Subtitles, descriptions
    muted: 'hsl(220, 5%, 38%)',         // #5c5f66 - Placeholders, disabled
    inverse: 'hsl(240, 3%, 6%)',        // #0f0f10 - Text on light backgrounds
  },

  // Accent colors
  accent: {
    cyan: '#2EBBE5',           // Primary accent - status dots, active states
    cyanLight: '#66eaff',      // Hover, selection highlight
    cyanDark: '#1bb4cc',       // Loader color
    green: '#29CC83',          // Success, checkmarks
    greenLight: '#4ade80',     // Success hover
    yellow: 'hsl(40, 44%, 64%)',  // #c9a85c - Gold/yellow buttons
    yellowText: 'hsl(40, 5%, 25%)', // Text on yellow background
  },

  // Border colors
  border: {
    default: 'hsl(0, 0%, 20%)',       // #333333 - Default borders
    subtle: 'hsl(0, 0%, 15%)',        // #262626 - Subtle separators
    focused: 'hsl(180, 100%, 50%)',   // Cyan - Focus rings
  },

  // Status colors
  status: {
    running: '#2EBBE5',
    done: '#DDDDE6',
    pending: '#DDDDE6',
    error: '#ef4444',
  },

  // Button specific
  button: {
    primary: '#f8fafc',           // White/light primary buttons
    primaryHover: '#e2e8f0',
    secondary: 'hsl(240, 2%, 12%)', // Dark secondary buttons
    secondaryHover: 'hsl(240, 2%, 16%)',
    gold: 'linear-gradient(135deg, #d4a855 0%, #b8942e 100%)',
    goldText: '#2a2410',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
} as const;

export const typography = {
  fontFamily: {
    primary: "'Brockmann', 'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', Monaco, Consolas, monospace",
    pixel: "'Ndot', monospace",
  },
  fontSize: {
    xs: '11px',
    sm: '13px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '32px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.4)',
  glow: '0 0 20px rgba(46, 187, 229, 0.3)',
} as const;

export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
  bounce: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const zIndex = {
  dropdown: 50,
  modal: 100,
  overlay: 90,
  tooltip: 110,
  toast: 120,
} as const;
