import { Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";

type KOTStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

interface KOTItem {
  id: string;
  name: string;
  quantity: number;
  note?: string;
}

interface KOT {
  id: string;
  kotNumber: string;
  tableNumber: string;
  items: KOTItem[];
  status: KOTStatus;
  orderTime: string;
  waiter: string;
  priority?: "high" | "normal" | "low";
}

interface KOTCardProps {
  kot: KOT;
  onStatusChange?: (kotId: string, newStatus: KOTStatus) => void;
  onViewDetails?: (kot: KOT) => void;
  showActions?: boolean;
  className?: string;
}

export default function KOTCard({
  kot,
  onStatusChange,
  onViewDetails,
  showActions = true,
  className = "",
}: KOTCardProps) {
  const getStatusConfig = (status: KOTStatus) => {
    switch (status) {
      case "pending":
        return {
          color: "border-yellow-400 bg-yellow-50",
          badge: "bg-yellow-100 text-yellow-700",
          text: "Pending",
          icon: Clock,
        };
      case "preparing":
        return {
          color: "border-orange-400 bg-orange-50",
          badge: "bg-orange-100 text-orange-700",
          text: "Preparing",
          icon: AlertCircle,
        };
      case "ready":
        return {
          color: "border-kot-dark bg-kot-light",
          badge: "bg-kot-stats text-kot-darker",
          text: "Ready",
          icon: CheckCircle,
        };
      case "completed":
        return {
          color: "border-green-400 bg-green-50",
          badge: "bg-green-100 text-green-700",
          text: "Completed",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          color: "border-red-400 bg-red-50",
          badge: "bg-red-100 text-red-700",
          text: "Cancelled",
          icon: XCircle,
        };
    }
  };

  const statusConfig = getStatusConfig(kot.status);
  const StatusIcon = statusConfig.icon;

  const getPriorityBadge = () => {
    if (!kot.priority || kot.priority === "normal") return null;
    return (
      <span
        className={`text-xs font-bold px-2 py-1 rounded ${
          kot.priority === "high"
            ? "bg-red-500 text-white"
            : "bg-kot-text text-white"
        }`}
      >
        {kot.priority.toUpperCase()}
      </span>
    );
  };

  const getElapsedTime = () => {
    const orderDate = new Date(kot.orderTime);
    const now = new Date();
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min ago`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m ago`;
  };

  return (
    <div
      className={`border-2 rounded-lg ${statusConfig.color} shadow-kot hover:shadow-kot-lg transition-shadow ${className}`}
      onClick={() => onViewDetails?.(kot)}
    >
      {/* Header */}
      <div className="p-4 border-b border-kot-chart bg-kot-white/50">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-kot-darker">
              KOT #{kot.kotNumber}
            </h3>
            {getPriorityBadge()}
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig.badge} flex items-center gap-1`}
          >
            <StatusIcon size={14} />
            {statusConfig.text}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-kot-darker">
              Table: <span className="text-kot-dark">{kot.tableNumber}</span>
            </span>
            <span className="flex items-center gap-1 text-kot-text">
              <User size={14} />
              {kot.waiter}
            </span>
          </div>
          <span className="flex items-center gap-1 text-kot-text">
            <Clock size={14} />
            {getElapsedTime()}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="p-4 space-y-2">
        {kot.items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between py-2 border-b border-kot-chart last:border-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-kot-darker text-lg">
                  {item.quantity}x
                </span>
                <span className="text-kot-darker font-medium">{item.name}</span>
              </div>
              {item.note && (
                <p className="text-sm text-orange-600 italic mt-1 ml-8">
                  Note: {item.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer - Time */}
      <div className="px-4 py-3 bg-kot-light/50 border-t border-kot-chart text-xs text-kot-text">
        Order Time:{" "}
        {new Date(kot.orderTime).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      {/* Action Buttons */}
      {showActions &&
        kot.status !== "completed" &&
        kot.status !== "cancelled" && (
          <div className="p-4 border-t border-kot-chart bg-kot-white/50 flex gap-2">
            {kot.status === "pending" && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.(kot.id, "preparing");
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Start Preparing
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.(kot.id, "cancelled");
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
            {kot.status === "preparing" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange?.(kot.id, "ready");
                }}
                className="flex-1 bg-kot-dark hover:bg-kot-darker text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Mark as Ready
              </button>
            )}
            {kot.status === "ready" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange?.(kot.id, "completed");
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Complete Order
              </button>
            )}
          </div>
        )}
    </div>
  );
}
