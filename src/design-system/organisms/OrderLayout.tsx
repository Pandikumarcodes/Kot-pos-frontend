import { ReactNode } from "react";

type OrderLayoutProps = {
  menu: ReactNode;
  cart: ReactNode;
};

export default function OrderLayout({ menu, cart }: OrderLayoutProps) {
  return (
    <div className="grid grid-cols-3 gap-6 p-6 bg-kot-dark min-h-screen">
      <div className="col-span-2">{menu}</div>
      <div>{cart}</div>
    </div>
  );
}
