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
  // Status configuration
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
          color: "border-blue-400 bg-blue-50",
          badge: "bg-blue-100 text-blue-700",
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

  // Priority badge
  const getPriorityBadge = () => {
    if (!kot.priority || kot.priority === "normal") return null;

    return (
      <span
        className={`text-xs font-bold px-2 py-1 rounded ${
          kot.priority === "high"
            ? "bg-red-500 text-white"
            : "bg-gray-400 text-white"
        }`}
      >
        {kot.priority.toUpperCase()}
      </span>
    );
  };

  // Calculate elapsed time
  const getElapsedTime = () => {
    const orderDate = new Date(kot.orderTime);
    const now = new Date();
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m ago`;
    }
  };

  return (
    <div
      className={`border-2 rounded-lg ${statusConfig.color} shadow-md hover:shadow-lg transition-shadow ${className}`}
      onClick={() => onViewDetails?.(kot)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-300 bg-white bg-opacity-50">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">
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
            <span className="font-semibold text-gray-700">
              Table: <span className="text-blue-600">{kot.tableNumber}</span>
            </span>
            <span className="flex items-center gap-1 text-gray-600">
              <User size={14} />
              {kot.waiter}
            </span>
          </div>
          <span className="flex items-center gap-1 text-gray-600">
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
            className="flex items-start justify-between py-2 border-b border-gray-200 last:border-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-lg">
                  {item.quantity}x
                </span>
                <span className="text-gray-900 font-medium">{item.name}</span>
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
      <div className="px-4 py-3 bg-gray-100 bg-opacity-50 border-t border-gray-300 text-xs text-gray-600">
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
          <div className="p-4 border-t border-gray-300 bg-white bg-opacity-50 flex gap-2">
            {kot.status === "pending" && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.(kot.id, "preparing");
                  }}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Start Preparing
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.(kot.id, "cancelled");
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
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

{
  /* <KOTCard
  kot={kotData}
  onStatusChange={(id, status) => handleStatusChange(id, status)}
  onViewDetails={(kot) => handleViewDetails(kot)}
  showActions={true}
/> */
}
