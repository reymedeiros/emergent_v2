// Emergent.sh Design Tokens - Pixel Perfect Colors and Styles

export const emergentColors = {
  // Backgrounds
  background: '#0F0F10',
  secondary: '#1A1A1C',
  inputBackground: '#1E1E1F',
  codeBackground: '#18181B',
  cardBackground: '#171717',
  hoverBackground: '#2A2A2B',
  divider: '#242424',
  border: '#252526',
  
  // Status Colors (Agent Running)
  agentRunningPrimary: '#67CB65',
  agentRunningBackground: 'rgba(103,203,101,0.125)',
  agentRunningPulse: '#67CB6570',
  agentRunningPulseTransparent: '#67CB6500',
  
  // Status Colors (Agent Waiting)
  agentWaitingPrimary: '#5FD3F3',
  agentWaitingBackground: 'rgba(95,211,243,0.125)',
  agentWaitingPulse: '#5FD3F370',
  agentWaitingPulseTransparent: '#5FD3F300',
  
  // Text Colors
  foreground: '#F8FAFC',
  mutedForeground: '#5C5F66',
  subtleText: '#939399',
  stepTitle: '#ACACB2',
  codeText: '#CCEDFF99',
  pathHighlight: '#FF99FD',
  
  // Accent Colors
  accentTeal: '#00CCAF',
  cyan: '#66EAFF',
  borderBlink: '#4d9fff',
  
  // Task Colors
  taskRunning: '#2EBBE5',
  taskDone: '#DDDDE6',
  stepSuccess: '#29CC83',
  stepInactive: '#5C5F66',
  stepCompleted: '#939399',
  
  // Special
  yellowPrimary: '#C9A74D',
  yellowText: 'hsl(40, 5%, 38%)',
} as const;

// Legacy colors export for backward compatibility
export const colors = {
  background: emergentColors.background,
  backgroundHover: emergentColors.hoverBackground,
  secondary: emergentColors.secondary,
  secondaryHover: emergentColors.hoverBackground,
  foreground: emergentColors.foreground,
  mutedForeground: emergentColors.mutedForeground,
  subtleText: emergentColors.subtleText,
  border: emergentColors.border,
  borderHover: '#3A3A3C',
  borderSubtle: emergentColors.divider,
  agentRunning: emergentColors.agentRunningPrimary,
  agentWaiting: emergentColors.agentWaitingPrimary,
  taskDone: emergentColors.taskDone,
  taskRunning: emergentColors.taskRunning,
  taskPending: emergentColors.mutedForeground,
  stepInactive: emergentColors.stepInactive,
  stepTitle: emergentColors.stepTitle,
  stepCompleted: emergentColors.stepCompleted,
  stepSuccess: emergentColors.stepSuccess,
  yellowPrimary: emergentColors.yellowPrimary,
  yellowText: emergentColors.yellowText,
  cyanAccent: emergentColors.cyan,
  buyCredits: '#22C55E',
  humanMessage: emergentColors.secondary,
  agentMessage: 'transparent',
  codeBackground: emergentColors.codeBackground,
  codeBorder: emergentColors.border,
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
  fontFamily: {
    sans: "Brockmann, ui-sans-serif, system-ui, sans-serif",
    mono: "JetBrains Mono, monospace",
    pixel: "Ndot, monospace",
    inter: "Inter, system-ui, sans-serif",
  },
  sizes: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
} as const;

export const layout = {
  headerHeight: '56px',
  tabBarHeight: '36px',
  inputMinHeight: '64px',
  inputMaxHeight: '200px',
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '14px',
    '2xl': '16px',
    full: '9999px',
  },
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
