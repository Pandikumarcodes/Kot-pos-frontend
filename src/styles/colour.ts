// src/styles/colors.ts
export const DASHBOARD_COLORS = {
  bgMain: "#1F262E",
  bgCard: "#262E37",
  sidebar: "#622125",
  activeTab: "#D8434D",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  accentTeal: "#4FD1C5",
  accentGold: "#F6AD55",
} as const;

export type DashboardTheme = typeof DASHBOARD_COLORS;
