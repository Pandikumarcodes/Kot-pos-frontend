import { Input } from "../../components/atoms/Input";
import { Icon } from "../../components/atoms/Icon";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Icon name="Search" className="absolute left-3 top-2.5 text-[#9CA3AF]" />
      <Input placeholder={placeholder} className="pl-10" />
    </div>
  );
}
