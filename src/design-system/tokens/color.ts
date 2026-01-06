export const DASHBOARD_COLORS = {
  background: "kot-dark",
  surface: "kot-card",
  sidebar: "kot-sidebar",

  primary: "kot-active",
  success: "kot-teal",
  warning: "kot-gold",

  textPrimary: "white",
  textMuted: "slate-400",
} as const;
export type DashboardTheme = typeof DASHBOARD_COLORS;
