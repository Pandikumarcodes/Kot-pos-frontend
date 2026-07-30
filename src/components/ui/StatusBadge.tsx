import type { LucideIcon } from "lucide-react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Flame,
  Package,
  DollarSign,
  User,
  Lock,
} from "lucide-react";

type StatusVariant =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled"
  | "occupied"
  | "available"
  | "reserved"
  | "paid"
  | "unpaid"
  | "active"
  | "locked";

interface StatusBadgeProps {
  status: string; // string so any API value won't crash
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig: Record<
  StatusVariant,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: LucideIcon;
  }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: Clock,
  },
  preparing: {
    label: "Preparing",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: Flame,
  },
  ready: {
    label: "Ready",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Package,
  },
  completed: {
    label: "Completed",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: XCircle,
  },
  occupied: {
    label: "Occupied",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: User,
  },
  available: {
    label: "Available",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle,
  },
  reserved: {
    label: "Reserved",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: AlertCircle,
  },
  paid: {
    label: "Paid",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: DollarSign,
  },
  unpaid: {
    label: "Unpaid",
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    icon: DollarSign,
  },
  // Staff statuses
  active: {
    label: "Active",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle,
  },
  locked: {
    label: "Locked",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: Lock,
  },
};

const fallback: (typeof statusConfig)["active"] = {
  label: "Unknown",
  color: "text-gray-600",
  bgColor: "bg-gray-50",
  borderColor: "border-gray-200",
  icon: AlertCircle,
};

const sizeConfig = {
  sm: { padding: "px-2 py-0.5", text: "text-xs", iconSize: 12 },
  md: { padding: "px-2.5 py-1", text: "text-sm", iconSize: 14 },
  lg: { padding: "px-3 py-1.5", text: "text-base", iconSize: 16 },
};

export function StatusBadge({
  status,
  showIcon = true,
  size = "sm",
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status as StatusVariant] ?? fallback;
  const s = sizeConfig[size];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.color} ${config.bgColor} ${config.borderColor} ${s.padding} ${s.text} ${className}`}
    >
      {showIcon && <Icon size={s.iconSize} />}
      <span>{config.label}</span>
    </span>
  );
}
