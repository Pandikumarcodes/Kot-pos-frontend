import { Card } from "../../components/atoms/Card";
import { Button } from "../../components/atoms/Button";

interface PaymentPanelProps {
  total: number;
  onPay: () => void;
}

export function PaymentPanel({ total, onPay }: PaymentPanelProps) {
  return (
    <Card className="max-w-sm">
      <h3 className="text-lg font-semibold text-[#1F2937]">Payment Summary</h3>

      <div className="flex justify-between mt-4 text-sm">
        <span>Total</span>
        <span className="font-medium">₹{total}</span>
      </div>

      <Button className="mt-6 w-full" onClick={onPay}>
        Complete Payment
      </Button>
    </Card>
  );
}
