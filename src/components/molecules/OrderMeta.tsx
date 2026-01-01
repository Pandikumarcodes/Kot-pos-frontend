import { StatusPill } from "../../components/atoms/StatusPill";

interface OrderMetaProps {
  orderId: string;
  time: string;
  status: any;
}

export function OrderMeta({ orderId, time, status }: OrderMetaProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[#1F2937]">Order #{orderId}</p>
        <p className="text-xs text-[#6B7280]">{time}</p>
      </div>

      <StatusPill status={status} />
    </div>
  );
}
