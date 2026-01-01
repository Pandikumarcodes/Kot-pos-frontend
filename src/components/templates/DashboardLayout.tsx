import { Sidebar } from "../../components/organisms/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#ECF6F1]">
      <Sidebar />

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
