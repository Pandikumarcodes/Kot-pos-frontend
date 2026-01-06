import { Card } from "../atoms/Card";
import Button from "../atoms/Button";
import { Input } from "../atoms/Input";

type OrderItemRowProps = {
  name: string;
  price: number;
  quantity: number;
};

export default function OrderItemRow({
  name,
  price,
  quantity,
}: OrderItemRowProps) {
  return (
    <Card>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-slate-500">₹{price}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary">−</Button>
            <span className="font-medium">{quantity}</span>
            <Button variant="secondary">+</Button>
          </div>
        </div>

        <Input placeholder="Add note (less spicy, no onion…)" />
      </div>
    </Card>
  );
}
