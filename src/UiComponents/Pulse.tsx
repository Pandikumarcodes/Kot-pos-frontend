import { skeleton } from "./Token";

export function Pulse({
  className,
  style,
}: {
  className: string;
  style?: React.CSSProperties;
}) {
  return <div className={`${skeleton} ${className}`} style={style} />;
}
