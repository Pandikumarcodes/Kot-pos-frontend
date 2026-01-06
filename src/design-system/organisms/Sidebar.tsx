import { NavLink } from "react-router-dom";

const links = [
  { label: "Tables", to: "/waiter/tables" },
  { label: "Orders", to: "/waiter/order/1" },
  { label: "Billing", to: "/cashier/billing" },
  { label: "Kitchen", to: "/chef/kot" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-kot-sidebar text-white p-4">
      <h1 className="text-xl font-bold mb-6">KOT POS</h1>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${
                isActive ? "bg-kot-active" : "hover:bg-kot-card"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
