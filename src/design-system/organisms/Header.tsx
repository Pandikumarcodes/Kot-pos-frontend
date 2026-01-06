import Button from "../atoms/Button";

export default function Header() {
  return (
    <header className="h-14 bg-kot-card flex items-center justify-between px-6 border-b border-slate-700">
      <p className="text-white font-medium">Welcome, Waiter</p>

      <Button variant="secondary">Logout</Button>
    </header>
  );
}
