import { Card } from "../../design-system/atoms/Card/Card";
import { Button } from "../../design-system/atoms/Button/Button";
import { Input } from "../../design-system/atoms/Input/Input";

export default function OrderPage() {
  return (
    <div className="h-full p-6 grid grid-cols-3 gap-6 bg-slate-50">
      {/* ================= LEFT: MENU ================= */}
      <div className="col-span-2 space-y-4">
        <h1 className="text-xl font-semibold">Menu</h1>

        {/* Category Tabs */}
        <div className="flex gap-2">
          <Button variant="secondary">All</Button>
          <Button variant="secondary">Starters</Button>
          <Button variant="secondary">Main Course</Button>
          <Button variant="secondary">Breads</Button>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Paneer Butter Masala</p>
                  <p className="text-sm text-slate-500">₹220</p>
                </div>
                <Button>Add</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ================= RIGHT: ORDER SUMMARY ================= */}
      <div className="border-l border-slate-200 pl-4 flex flex-col">
        <h1 className="text-xl font-semibold mb-4">Current Order</h1>

        {/* Order Items */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Veg Fried Rice</p>
                    <p className="text-sm text-slate-500">₹180</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="secondary">−</Button>
                    <span className="font-medium">1</span>
                    <Button variant="secondary">+</Button>
                  </div>
                </div>

                {/* Notes */}
                <Input placeholder="Add note (less spicy, no onion...)" />
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-4 mt-4 space-y-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹580</span>
          </div>

          <Button className="w-full">Send to Kitchen (KOT)</Button>
        </div>
      </div>
    </div>
  );
}
