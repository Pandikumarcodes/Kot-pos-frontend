import { Card } from "../atoms/Card";
import Button from "../atoms/Button";

export default function KOTBoard() {
  return (
    <div className="p-6 grid grid-cols-3 gap-4 bg-kot-dark min-h-screen">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="bg-kot-card text-white">
          <div className="space-y-3">
            <h3 className="font-semibold">Table {i + 1}</h3>

            <ul className="text-sm space-y-1">
              <li>Paneer Butter Masala × 2</li>
              <li>Butter Naan × 4</li>
            </ul>

            <Button className="w-full">Mark Ready</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
