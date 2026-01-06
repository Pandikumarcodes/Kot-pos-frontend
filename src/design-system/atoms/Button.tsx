import { DASHBOARD_COLORS } from "../tokens/color";

type ButtonVariant = "primary" | "secondary" | "danger";

const base =
  "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition";

const variants: Record<ButtonVariant, string> = {
  primary: `bg-${DASHBOARD_COLORS.primary} text-white`,
  secondary: "bg-slate-700 text-white",
  danger: "bg-red-600 text-white",
};
export default function Button({
  children,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
