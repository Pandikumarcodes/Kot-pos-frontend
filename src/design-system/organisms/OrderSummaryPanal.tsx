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
    0
  );
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  return (
    <div
      className={`flex flex-col h-full bg-white border-l border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Current Order</h2>
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
            <span className="text-sm text-gray-500">Table:</span>
            <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
              {tableNumber}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-500">Items</span>
          <span className="text-sm font-medium text-gray-900">
            {items.length}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Send size={32} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium">No items added yet</p>
            <p className="text-xs mt-1">Start adding items from the menu</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {/* Item Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>

                <button
                  onClick={() => onRemoveItem?.(item.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onUpdateQuantity?.(item.id, item.quantity - 1)
                    }
                    className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-medium text-gray-900 w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      onUpdateQuantity?.(item.id, item.quantity + 1)
                    }
                    className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{item.price * item.quantity}
                </span>
              </div>

              {/* Notes */}
              <input
                type="text"
                placeholder="Add special instructions..."
                value={item.note || ""}
                onChange={(e) => onUpdateNote?.(item.id, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))
        )}
      </div>

      {/* Footer - Pricing & Actions */}
      {items.length > 0 && (
        <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
          {/* Pricing Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tax (5%)</span>
              <span className="font-medium text-gray-900">
                ₹{tax.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold pt-2 border-t border-gray-300">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onSendToKitchen}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Send size={18} />
            Send to Kitchen (KOT)
          </button>
        </div>
      )}
    </div>
  );
}

{
  /* <OrderSummaryPanel
  items={orderItems}
  tableNumber="5"
  onUpdateQuantity={(id, qty) => handleUpdateQuantity(id, qty)}
  onUpdateNote={(id, note) => handleUpdateNote(id, note)}
  onRemoveItem={(id) => handleRemoveItem(id)}
  onSendToKitchen={() => handleSendToKitchen()}
  onClearOrder={() => handleClearOrder()}
/> */
}

// // Demo Component
// function OrderSummaryPanelDemo() {
//   const mockItems: OrderItem[] = [
//     { id: "1", name: "Paneer Butter Masala", price: 220, quantity: 2, note: "Less spicy" },
//     { id: "2", name: "Veg Fried Rice", price: 180, quantity: 1 },
//     { id: "3", name: "Garlic Naan", price: 45, quantity: 4, note: "Extra butter" }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">OrderSummaryPanel Organism</h1>

//         <div className="grid grid-cols-2 gap-6">
//           {/* With Items */}
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '700px' }}>
//             <div className="bg-gray-800 text-white p-3 text-sm font-semibold">
//               With Items
//             </div>
//             <OrderSummaryPanel
//               items={mockItems}
//               tableNumber="5"
//               onUpdateQuantity={(id, qty) => console.log("Update quantity:", id, qty)}
//               onUpdateNote={(id, note) => console.log("Update note:", id, note)}
//               onRemoveItem={(id) => console.log("Remove item:", id)}
//               onSendToKitchen={() => console.log("Send to kitchen")}
//               onClearOrder={() => console.log("Clear order")}
//             />
//           </div>

//           {/* Empty State */}
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '700px' }}>
//             <div className="bg-gray-800 text-white p-3 text-sm font-semibold">
//               Empty State
//             </div>
//             <OrderSummaryPanel
//               items={[]}
//               tableNumber="8"
//             />
//           </div>
//         </div>

//         {/* Props Documentation */}
//         <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">Props</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-2 text-left font-semibold">Prop</th>
//                   <th className="px-4 py-2 text-left font-semibold">Type</th>
//                   <th className="px-4 py-2 text-left font-semibold">Description</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 <tr>
//                   <td className="px-4 py-2 font-mono text-xs">items</td>
//                   <td className="px-4 py-2 font-mono text-xs">OrderItem[]</td>
//                   <td className="px-4 py-2">Array of order items to display</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2 font-mono text-xs">tableNumber</td>
//                   <td className="px-4 py-2 font-mono text-xs">string</td>
//                   <td className="px-4 py-2">Optional table number</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2 font-mono text-xs">onUpdateQuantity</td>
//                   <td className="px-4 py-2 font-mono text-xs">(id, qty) =&gt; void</td>
//                   <td className="px-4 py-2">Callback when quantity changes</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2 font-mono text-xs">onUpdateNote</td>
//                   <td className="px-4 py-2 font-mono text-xs">(id, note) =&gt; void</td>
//                   <td className="px-4 py-2">Callback when note changes</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2 font-mono text-xs">onRemoveItem</td>
//                   <td className="px-4 py-2 font-mono text-xs">(id) =&gt; void</td>
//                   <td className="px-4 py-2">Callback to remove an item</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2 font-mono text-xs">onSendToKitchen</td>
//                   <td className="px-4 py-2 font-mono text-xs">() =&gt; void</td>
//                   <td className="px-4 py-2">Callback to send order to kitchen</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2 font-mono text-xs">onClearOrder</td>
//                   <td className="px-4 py-2 font-mono text-xs">() =&gt; void</td>
//                   <td className="px-4 py-2">Callback to clear entire order</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
