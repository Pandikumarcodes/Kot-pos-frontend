// src/components/atoms/Card/Card.tsx

type CardVariant = "default" | "elevated" | "outlined" | "flat";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const variants: Record<CardVariant, string> = {
  default: "bg-kot-white shadow-kot",
  elevated: "bg-kot-white shadow-kot-lg",
  outlined: "bg-kot-white border-2 border-kot-chart",
  flat: "bg-kot-light",
};

const paddings: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export const Card = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
  hoverable = false,
  clickable = false,
  onClick,
}: CardProps) => {
  const hoverStyles =
    hoverable || clickable
      ? "transition-all duration-200 hover:shadow-kot-lg hover:-translate-y-0.5"
      : "";

  const clickableStyles =
    clickable || onClick ? "cursor-pointer active:scale-[0.98]" : "";

  return (
    <div
      className={`rounded-lg ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      role={clickable || onClick ? "button" : undefined}
      tabIndex={clickable || onClick ? 0 : undefined}
      onKeyDown={
        clickable || onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`mb-4 pb-4 border-b border-kot-chart ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={`text-lg font-semibold text-kot-darker ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={`text-sm text-kot-text mt-1 ${className}`}>{children}</p>
  );
};

export const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`text-kot-dark ${className}`}>{children}</div>;
};

export const CardFooter = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`mt-4 pt-4 border-t border-kot-chart flex items-center gap-2 ${className}`}
    >
      {children}
    </div>
  );
};

export type { CardProps, CardVariant, CardPadding };
