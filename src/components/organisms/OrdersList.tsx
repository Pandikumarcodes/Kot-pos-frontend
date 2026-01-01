import { Card } from "../../components/atoms/Card";
import { Button } from "../../components/atoms/Button";
import { OrderMeta } from "../../components/molecules/OrderMeta";

interface Order {
  id: string;
  time: string;
  status: any;
  items: string[];
}

interface OrderListProps {
  orders: Order[];
  onAction?: (id: string) => void;
}

export function OrderList({ orders, onAction }: OrderListProps) {
  return (
    <div className="space-y-4">
      {orders?.map((order) => (
        <Card key={order?.id}>
          <OrderMeta
            orderId={order?.id}
            time={order?.time}
            status={order?.status}
          />

          <ul className="mt-3 space-y-1 text-sm text-[#374151]">
            {order?.items?.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>

          <div className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={() => onAction?.(order?.id)}>
              Action
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
