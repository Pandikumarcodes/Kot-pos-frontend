import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// ── Design tokens ─────────────────────────────────────────────
export const GREEN = "#4A5F52";
export const GREEN_L = "#A8C5B2";
export const DARK = "#2D3A33";
export const MUTED = "#7E8681";

export const PAYMENT_PALETTE: Record<
  string,
  { fill: string; border: string; label: string; emoji: string }
> = {
  cash: { fill: "#d1fae5", border: "#059669", label: "Cash", emoji: "💵" },
  card: { fill: "#dbeafe", border: "#2563eb", label: "Card", emoji: "💳" },
  upi: { fill: "#ede9fe", border: "#7c3aed", label: "UPI", emoji: "📱" },
  none: { fill: "#f3f4f6", border: "#9ca3af", label: "Other", emoji: "❓" },
};

// ── Shared base options ───────────────────────────────────────
export const baseTooltip = {
  backgroundColor: DARK,
  titleColor: "#fff",
  bodyColor: "#C1D9CD",
  padding: 10,
  cornerRadius: 8,
};

export const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: baseTooltip,
  },
};

export const axisStyle = {
  grid: { color: "#E6F2EB" },
  ticks: { color: MUTED, font: { size: 11 } },
};
