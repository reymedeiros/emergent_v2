// Emergent.sh Design Tokens - Pixel Perfect Colors and Styles

export const colors = {
  // Core backgrounds
  background: 'hsl(240, 3%, 6%)', // #0f0f10
  backgroundHover: 'hsl(240, 3%, 8%)',
  secondary: 'hsl(240, 2%, 12%)', // #1e1e20
  secondaryHover: 'hsl(240, 2%, 15%)',
  
  // Text colors
  foreground: 'hsl(210, 40%, 98%)', // #f8fafc
  mutedForeground: 'hsl(220, 5%, 38%)', // #5c5f66
  subtleText: 'hsl(220, 5%, 55%)',
  
  // Borders
  border: 'hsl(0, 0%, 20%)', // #333333
  borderHover: 'hsl(0, 0%, 35%)',
  borderSubtle: 'hsl(0, 0%, 15%)',
  
  // Status colors
  agentRunning: '#29CC83', // Green
  agentWaiting: '#2EBBE5', // Blue/Cyan
  taskDone: '#DDDDE6',
  taskRunning: '#2EBBE5',
  taskPending: '#5C5F66',
  
  // Step colors
  stepInactive: '#5C5F66',
  stepTitle: '#ACACB2',
  stepCompleted: '#939399',
  stepSuccess: '#29CC83',
  
  // Accent colors
  yellowPrimary: 'hsl(40, 44%, 64%)', // #C9A74D
  yellowText: 'hsl(40, 5%, 38%)',
  cyanAccent: '#61D7FB',
  buyCredits: '#22C55E', // Green for Buy Credits
  
  // Message colors
  humanMessage: 'hsl(240, 2%, 14%)',
  agentMessage: 'transparent',
  
  // Code block
  codeBackground: 'hsl(240, 3%, 10%)',
  codeBorder: 'hsl(0, 0%, 22%)',
} as const;

export const spacing = {
  headerHeight: '56px',
  tabHeight: '36px',
  sidebarWidth: '280px',
  inputHeight: '40px',
  panelPadding: '16px',
  messagePadding: '16px',
  messageGap: '16px',
} as const;

export const typography = {
  fontFamily: "'Brockmann', 'Inter', system-ui, -apple-system, sans-serif",
  monoFamily: "'JetBrains Mono', 'Fira Code', monospace",
  pixelFamily: "'Ndot', monospace",
  
  // Font sizes
  xs: '12px',
  sm: '13px',
  base: '14px',
  md: '15px',
  lg: '16px',
  xl: '18px',
  '2xl': '24px',
  '3xl': '32px',
  
  // Line heights
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.625',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
  glow: '0 0 20px rgba(46, 187, 229, 0.3)',
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
  spring: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  overlay: 200,
  modal: 300,
  popover: 400,
  toast: 500,
} as const;
