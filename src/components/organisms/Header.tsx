import { Icon } from "../../components/atoms/Icon";

export function Header() {
  return (
    <header className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-[#1F2937]">Dashboard</h2>
      <div className="flex items-center gap-4  text-[#6B7280]">
        <Icon name="Bell" />
        <Icon name="UserCircle" />
      </div>
    </header>
  );
}
