type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50";

const variants = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
