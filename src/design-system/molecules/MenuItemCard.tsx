import { Card } from "../atoms/Card";
import Button from "../atoms/Button";

type MenuItemCardProps = {
  name: string;
  price: number;
};

export default function MenuItemCard({ name, price }: MenuItemCardProps) {
  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-slate-900">{name}</p>
          <p className="text-sm text-slate-500">₹{price}</p>
        </div>

        <Button>Add</Button>
      </div>
    </Card>
  );
}
