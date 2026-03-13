// ── Colour palette (mirrors tailwind.config.js) ──────────────
export const colors = {
  primary: "bg-kot-primary", // #EEF4F0 — page backgrounds
  stats: "bg-kot-stats", // #DFF0E6 — stat card fills
  light: "bg-kot-light", // #C8E3D0 — subtle fills, tab bg
  chart: "bg-kot-chart", // #A8C5B2 — borders, dividers
  dark: "bg-kot-dark", // #4A5F52 — primary buttons
  darker: "bg-kot-darker", // #2E3D34 — hover states
  white: "bg-kot-white", // #FFFFFF — card backgrounds
} as const;

export const text = {
  darker: "text-kot-darker", // headings
  dark: "text-kot-dark", // active links, icons
  body: "text-kot-text", // secondary text #6B8A75
  white: "text-white",
} as const;

export const border = {
  chart: "border-kot-chart", // standard border
  dark: "border-kot-dark", // focus / active border
} as const;

export const shadow = {
  sm: "shadow-kot", // card shadow
  lg: "shadow-kot-lg", // modal / elevated shadow
} as const;

// ── Spacing & shape ────────────────────────────────────────────
export const radius = {
  sm: "rounded-lg", // inputs, small elements
  md: "rounded-xl", // buttons, badges, tabs
  lg: "rounded-2xl", // cards
  full: "rounded-full", // pills, avatars
} as const;

// ── Typography scale ───────────────────────────────────────────
export const type = {
  pageTitle: "text-lg sm:text-2xl font-bold text-kot-darker",
  sectionTitle: "text-base sm:text-lg font-bold text-kot-darker",
  cardTitle: "text-sm sm:text-base font-bold text-kot-darker",
  label: "text-sm font-semibold text-kot-darker",
  body: "text-sm text-kot-darker",
  caption: "text-xs text-kot-text",
  micro: "text-[10px] text-kot-text",
} as const;

/** Standard page wrapper */
export const page = "min-h-screen bg-kot-primary";

/** Standard content container */
export const container = "p-3 sm:p-4 md:p-6 max-w-[2400px] mx-auto";

/** Standard card */
export const card = "bg-kot-white rounded-2xl shadow-kot";

/** Sticky header bar */
export const stickyHeader =
  "bg-kot-white border-b border-kot-chart shadow-kot sticky top-0 z-10";

// ── Button variants ───────────────────────────────────────────
export const btn = {
  primary:
    "bg-kot-dark hover:bg-kot-darker text-white font-semibold rounded-xl transition-colors",
  secondary:
    "border-2 border-kot-chart text-kot-darker font-semibold rounded-xl hover:bg-kot-light transition-colors bg-kot-white",
  ghost:
    "bg-kot-light hover:bg-kot-stats text-kot-dark font-medium rounded-xl transition-colors",
  danger: "text-red-600 hover:bg-red-50 rounded-lg transition-colors",
  icon: "p-1.5 rounded-lg transition-colors",
  tabInactive:
    "text-kot-text hover:bg-kot-light hover:text-kot-darker rounded-xl transition-colors",
  tabActive: "bg-kot-dark text-white rounded-xl",
  sm: "px-3 py-1.5 text-xs sm:text-sm",
  md: "px-3 py-2 sm:px-4 sm:py-2.5 text-sm",
  lg: "px-4 py-2.5 sm:px-6 sm:py-3 text-base",
} as const;

// ── Form / input ──────────────────────────────────────────────
export const input = {
  base: "w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-kot-dark focus:border-kot-dark bg-kot-white text-kot-darker placeholder:text-kot-text/50 text-sm transition-colors",
  normal: "border-kot-chart",
  error: "border-red-500",
  label: "block text-sm font-semibold text-kot-darker mb-1",
} as const;

// ── Badge / status pill ────────────────────────────────────────
export const badge = {
  success: "bg-kot-stats text-kot-darker",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-800",
  neutral: "bg-kot-light text-kot-text",
  base: "text-xs font-semibold px-2.5 py-1 rounded-full",
} as const;

// ── Skeleton / pulse ──────────────────────────────────────────
export const skeleton = "bg-kot-chart rounded animate-pulse";

// ── Table ────────────────────────────────────────────────────
export const table = {
  wrapper:
    "bg-kot-white rounded-xl shadow-kot border border-kot-chart overflow-hidden",
  thead: "bg-kot-light border-b border-kot-chart",
  th: "px-4 py-3 text-xs font-semibold text-kot-text uppercase text-left",
  thRight: "px-4 py-3 text-xs font-semibold text-kot-text uppercase text-right",
  tbody: "divide-y divide-kot-chart",
  tr: "hover:bg-kot-primary transition-colors",
  td: "px-4 py-3 text-sm text-kot-darker",
  tdRight: "px-4 py-3 text-sm text-kot-darker text-right",
} as const;

// ── Modal ────────────────────────────────────────────────────
export const modal = {
  overlay:
    "fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4",
  panel:
    "bg-kot-white rounded-t-3xl sm:rounded-xl shadow-kot-lg w-full sm:max-w-md",
  header: "flex items-center justify-between p-5 border-b border-kot-chart",
  body: "p-5 space-y-4 max-h-[80vh] overflow-y-auto",
  dragHandle: "flex justify-center pt-3 pb-1 sm:hidden",
} as const;

// ── Stat card ─────────────────────────────────────────────────
export const statCard = {
  wrapper: "rounded-2xl p-3 sm:p-4 shadow-kot",
  label: "text-xs text-kot-text font-medium",
  value: "text-xl sm:text-2xl font-bold text-kot-darker mt-1",
} as const;

// ── Empty state ───────────────────────────────────────────────
export const emptyState = {
  wrapper: "bg-kot-white rounded-2xl p-10 sm:p-16 text-center shadow-kot",
  icon: "text-4xl mb-3",
  title: "text-base sm:text-lg font-bold text-kot-darker",
  sub: "text-sm text-kot-text mt-1",
} as const;

// ── Progress bar ──────────────────────────────────────────────
export const progress = {
  track: "bg-kot-light rounded-full overflow-hidden",
  fill: "bg-kot-dark rounded-full transition-all",
} as const;
