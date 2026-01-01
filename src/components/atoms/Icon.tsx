import * as Icons from "lucide-react";

interface IconProps {
  name: keyof typeof Icons;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 18, className }: IconProps) {
  const LucideIcon = Icons[name];
  return <LucideIcon size={size} className={className} />;
}
