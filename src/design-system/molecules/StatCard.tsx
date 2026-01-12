import { Card } from "../atoms/Card/Card";
export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  description?: string;
  onClick?: () => void;
}

export const StatCard = ({
  label,
  value,
  icon,
  trend,
  description,
  onClick,
}: StatCardProps) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === "number") {
      // Format numbers with commas for thousands
      return val.toLocaleString("en-IN");
    }
    return val;
  };

  return (
    <Card
      variant="elevated"
      padding="lg"
      hoverable={!!onClick}
      clickable={!!onClick}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header with label and icon */}
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-kot-text uppercase tracking-wide">
            {label}
          </p>
          {icon && (
            <div className="text-kot-primary w-8 h-8 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>

        {/* Main value */}
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-kot-darker">
            {formatValue(value)}
          </p>

          {/* Trend indicator */}
          {trend && (
            <span
              className={`text-sm font-semibold flex items-center gap-1 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </span>
          )}
        </div>

        {/* Optional description */}
        {description && <p className="text-sm text-kot-text">{description}</p>}
      </div>
    </Card>
  );
};

export default StatCard;

// // Simple stat
// <StatCard
//   label="Total Orders"
//   value={156}
// />

// // With icon (you'll need to import your icons)
// <StatCard
//   label="Revenue Today"
//   value="₹45,230"
//   icon={<DollarIcon />}
// />

// // With trend
// <StatCard
//   label="Sales"
//   value="₹1,25,000"
//   trend={{ value: 12.5, isPositive: true }}
//   description="vs last week"
// />

// // With all features
// <StatCard
//   label="Pending Orders"
//   value={8}
//   icon={<ClockIcon />}
//   trend={{ value: 3.2, isPositive: false }}
//   description="Needs attention"
//   onClick={() => navigateToOrders()}
// />

// // Grid layout example
// <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//   <StatCard label="Today's Orders" value={45} />
//   <StatCard label="Revenue" value="₹12,450" />
//   <StatCard label="Avg Order Value" value="₹276" />
//   <StatCard label="Active Tables" value={12} />
// </div>
