import { Card } from "../../components/atoms/Card";
import { OrderMeta } from "../../components/molecules/OrderMeta";
import { Button } from "../../components/atoms/Button";

interface Kot {
  id: string;
  time: string;
  status: any;
  items: string[];
}

interface KotListProps {
  orders: Kot[];
  onStatusChange?: (id: string) => void;
}

export function KotList({ orders, onStatusChange }: KotListProps) {
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
            {order?.items?.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>

          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              onClick={() => onStatusChange?.(order?.id)}
            >
              Mark Ready
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
