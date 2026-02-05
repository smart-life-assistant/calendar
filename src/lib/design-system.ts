// Design System - Shared constants and utilities

export const COLORS = {
  primary: {
    50: "from-blue-50 to-indigo-50",
    100: "from-blue-100 to-indigo-100",
    500: "from-blue-500 to-indigo-600",
    600: "from-blue-600 to-indigo-700",
    gradient: "bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600",
  },
  accent: {
    gradient: "bg-linear-to-r from-amber-500 via-orange-500 to-red-500",
  },
  background: {
    light: "bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/30",
    dark: "dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20",
  },
} as const;

export const SHADOWS = {
  sm: "shadow-sm hover:shadow-md transition-shadow",
  md: "shadow-md hover:shadow-lg transition-shadow",
  lg: "shadow-lg hover:shadow-xl transition-shadow",
  xl: "shadow-xl hover:shadow-2xl transition-shadow",
  glow: "shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-shadow",
} as const;

export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring" as const, stiffness: 100 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring" as const, stiffness: 200 },
  },
} as const;

export const CARD_STYLES = {
  base: "bg-card border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300",
  interactive:
    "bg-card border rounded-2xl shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer",
  glass:
    "bg-card/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-xl",
} as const;

export const BUTTON_STYLES = {
  primary:
    "px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
  secondary:
    "px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300",
  outline:
    "px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-xl transition-all duration-300",
  ghost:
    "px-6 py-3 hover:bg-accent hover:text-accent-foreground font-medium rounded-xl transition-all duration-300",
} as const;

export const GRADIENT_TEXT =
  "bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent";

export const GLASSMORPHISM =
  "backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-white/10";
