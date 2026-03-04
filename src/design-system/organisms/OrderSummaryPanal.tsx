import { Trash2, Plus, Minus, Send, X } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

interface OrderSummaryPanelProps {
  items: OrderItem[];
  tableNumber?: string;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onUpdateNote?: (id: string, note: string) => void;
  onRemoveItem?: (id: string) => void;
  onSendToKitchen?: () => void;
  onClearOrder?: () => void;
  className?: string;
}

export default function OrderSummaryPanel({
  items = [],
  tableNumber,
  onUpdateQuantity,
  onUpdateNote,
  onRemoveItem,
  onSendToKitchen,
  onClearOrder,
  className = "",
}: OrderSummaryPanelProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div
      className={`flex flex-col h-full bg-kot-white border-l border-kot-chart ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-kot-chart bg-kot-header">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-kot-darker">
            Current Order
          </h2>
          {items.length > 0 && (
            <button
              onClick={onClearOrder}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>

        {tableNumber && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-kot-text">Table:</span>
            <span className="text-sm font-semibold text-kot-darker bg-kot-stats px-2 py-1 rounded">
              {tableNumber}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-kot-text">Items</span>
          <span className="text-sm font-medium text-kot-darker">
            {items.length}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-kot-primary">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-kot-text">
            <div className="w-16 h-16 bg-kot-stats rounded-full flex items-center justify-center mb-3">
              <Send size={32} className="text-kot-dark" />
            </div>
            <p className="text-sm font-medium">No items added yet</p>
            <p className="text-xs mt-1">Start adding items from the menu</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-kot-white rounded-lg p-3 border border-kot-chart hover:border-kot-stats transition-colors"
            >
              {/* Item Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-kot-darker">{item.name}</h3>
                  <p className="text-sm text-kot-text">₹{item.price}</p>
                </div>
                <button
                  onClick={() => onRemoveItem?.(item.id)}
                  className="text-kot-text hover:text-red-600 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-kot-text">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onUpdateQuantity?.(item.id, item.quantity - 1)
                    }
                    className="w-7 h-7 flex items-center justify-center bg-kot-white border border-kot-chart rounded hover:bg-kot-light transition-colors"
                  >
                    <Minus size={14} className="text-kot-darker" />
                  </button>
                  <span className="font-medium text-kot-darker w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      onUpdateQuantity?.(item.id, item.quantity + 1)
                    }
                    className="w-7 h-7 flex items-center justify-center bg-kot-white border border-kot-chart rounded hover:bg-kot-light transition-colors"
                  >
                    <Plus size={14} className="text-kot-darker" />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-kot-text">Subtotal</span>
                <span className="text-sm font-semibold text-kot-darker">
                  ₹{item.price * item.quantity}
                </span>
              </div>

              {/* Notes */}
              <input
                type="text"
                placeholder="Add special instructions..."
                value={item.note || ""}
                onChange={(e) => onUpdateNote?.(item.id, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-kot-chart rounded-md focus:outline-none focus:ring-2 focus:ring-kot-dark focus:border-transparent bg-kot-white text-kot-darker placeholder:text-kot-text/50"
              />
            </div>
          ))
        )}
      </div>

      {/* Footer - Pricing & Actions */}
      {items.length > 0 && (
        <div className="border-t border-kot-chart p-4 space-y-3 bg-kot-light">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-kot-text">Subtotal</span>
              <span className="font-medium text-kot-darker">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-kot-text">Tax (5%)</span>
              <span className="font-medium text-kot-darker">
                ₹{tax.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold pt-2 border-t border-kot-chart">
              <span className="text-kot-darker">Total</span>
              <span className="text-kot-dark">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onSendToKitchen}
            className="w-full bg-kot-dark hover:bg-kot-darker text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Send size={18} />
            Send to Kitchen (KOT)
          </button>
        </div>
      )}
    </div>
  );
}
