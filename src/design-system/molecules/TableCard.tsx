import { Card } from "../atoms/Card/Card";
import { Button } from "../atoms/Button/Button";

export type TableStatus = "available" | "occupied" | "billing" | "reserved";

export interface TableCardProps {
  id: string;
  tableNumber: number;
  status: TableStatus;
  capacity?: number;
  currentGuests?: number;
  orderAmount?: number;
  duration?: string; // e.g., "45 min"
  waiterName?: string;
  onClick?: (id: string) => void;
  onAction?: (id: string, action: string) => void;
}

const statusConfig: Record<
  TableStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    actionLabel: string;
  }
> = {
  available: {
    label: "Available",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    actionLabel: "Assign",
  },
  occupied: {
    label: "Occupied",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    actionLabel: "View Order",
  },
  billing: {
    label: "Billing",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    actionLabel: "Complete",
  },
  reserved: {
    label: "Reserved",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    actionLabel: "Check In",
  },
};

export const TableCard = ({
  id,
  tableNumber,
  status,
  capacity,
  currentGuests,
  orderAmount,
  duration,
  waiterName,
  onClick,
  onAction,
}: TableCardProps) => {
  const config = statusConfig[status];

  const handleCardClick = () => {
    onClick?.(id);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction?.(id, status);
  };

  return (
    <Card
      variant="outlined"
      padding="md"
      hoverable
      clickable={!!onClick}
      onClick={onClick ? handleCardClick : undefined}
      className={`border-l-4 ${config.borderColor} ${config.bgColor}/30`}
    >
      <div className="space-y-3">
        {/* Header - Table Number and Status */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-kot-darker">
              Table {tableNumber}
            </h3>
            <span
              className={`inline-flex items-center gap-1 text-sm font-semibold ${config.color}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${config.bgColor} border-2 ${config.borderColor}`}
              />
              {config.label}
            </span>
          </div>

          {/* Capacity */}
          {capacity && (
            <div className="text-right">
              <p className="text-xs text-kot-text">Capacity</p>
              <p className="text-sm font-semibold text-kot-darker">
                {currentGuests ? `${currentGuests}/` : ""}
                {capacity}
              </p>
            </div>
          )}
        </div>

        {/* Details for Occupied/Billing tables */}
        {(status === "occupied" || status === "billing") && (
          <div className="space-y-2 py-2 border-t border-kot-chart">
            {duration && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-kot-text">Duration</span>
                <span className="font-medium text-kot-darker">{duration}</span>
              </div>
            )}

            {orderAmount !== undefined && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-kot-text">Order Amount</span>
                <span className="font-semibold text-kot-primary">
                  ₹{orderAmount.toFixed(2)}
                </span>
              </div>
            )}

            {waiterName && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-kot-text">Waiter</span>
                <span className="font-medium text-kot-darker">
                  {waiterName}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          variant={status === "available" ? "primary" : "secondary"}
          onClick={handleActionClick}
          className="w-full"
        >
          {config.actionLabel}
        </Button>
      </div>
    </Card>
  );
};

export default TableCard;

/* // Available table
<TableCard
  id="table-1"
  tableNumber={5}
  status="available"
  capacity={4}
  onAction={(id) => assignTable(id)}
/>

// Occupied table with details
<TableCard
  id="table-2"
  tableNumber={12}
  status="occupied"
  capacity={6}
  currentGuests={4}
  orderAmount={1250}
  duration="25 min"
  waiterName="Rahul"
  onClick={(id) => viewTableDetails(id)}
  onAction={(id) => viewOrder(id)}
/>

// Billing table
<TableCard
  id="table-3"
  tableNumber={8}
  status="billing"
  capacity={2}
  orderAmount={850}
  duration="1h 15m"
  waiterName="Priya"
  onAction={(id) => completeBilling(id)}
/>

// Reserved table
<TableCard
  id="table-4"
  tableNumber={3}
  status="reserved"
  capacity={8}
  onAction={(id) => checkInGuests(id)}
/>

// Grid layout for restaurant floor
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {tables.map(table => (
    <TableCard key={table.id} {...table} />
  ))}
</div> */
