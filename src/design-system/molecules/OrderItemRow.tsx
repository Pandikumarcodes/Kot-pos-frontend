// src/components/molecules/OrderItemRow/OrderItemRow.tsx
import { Card } from "../atoms/Card/Card";
// import { Button } from "../atoms/Button/Button";
import { Input } from "../atoms/Input/Input";

export interface OrderItemRowProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
  onRemove?: (id: string) => void;
  onNoteChange?: (id: string, note: string) => void;
  showNote?: boolean;
}

export const OrderItemRow = ({
  id,
  name,
  price,
  quantity,
  note = "",
  onIncrease,
  onDecrease,
  onRemove,
  onNoteChange,
  showNote = true,
}: OrderItemRowProps) => {
  const subtotal = price * quantity;

  const handleIncrease = () => {
    onIncrease?.(id);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onDecrease?.(id);
    } else {
      // If quantity is 1 and user decreases, remove the item
      onRemove?.(id);
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNoteChange?.(id, e.target.value);
  };

  return (
    <Card padding="md" variant="outlined">
      <div className="space-y-3">
        {/* Item Info and Quantity Controls */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-kot-darker mb-1">{name}</h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-kot-text">
                ₹{price.toFixed(2)} × {quantity}
              </span>
              <span className="text-kot-text">•</span>
              <span className="font-semibold text-kot-primary">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDecrease}
              className="w-8 h-8 rounded-full border-2 border-kot-primary text-kot-primary flex items-center justify-center text-lg font-bold hover:bg-kot-primary hover:text-white transition-colors active:scale-95"
              aria-label="Decrease quantity"
            >
              {quantity === 1 ? "×" : "−"}
            </button>
            <span className="w-8 text-center font-semibold text-kot-darker">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="w-8 h-8 rounded-full bg-kot-primary text-white flex items-center justify-center text-lg font-bold hover:bg-kot-primary/90 transition-colors active:scale-95"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Note Input */}
        {showNote && (
          <Input
            placeholder="Add note (less spicy, no onion…)"
            value={note}
            onChange={handleNoteChange}
            inputSize="sm"
            className="text-sm"
          />
        )}
      </div>
    </Card>
  );
};

export default OrderItemRow;

// const [orderItems, setOrderItems] = useState([
//   { id: '1', name: 'Masala Dosa', price: 120, quantity: 2, note: '' }
// ]);

// <OrderItemRow
//   id={item.id}
//   name={item.name}
//   price={item.price}
//   quantity={item.quantity}
//   note={item.note}
//   onIncrease={(id) => updateQuantity(id, item.quantity + 1)}
//   onDecrease={(id) => updateQuantity(id, item.quantity - 1)}
//   onRemove={(id) => removeItem(id)}
//   onNoteChange={(id, note) => updateNote(id, note)}
// />
