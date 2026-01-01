import { Sidebar } from "../organisms/Sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen p-6 gap-6 bg-[var(--bg-app)]">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-[#f6fbf8] to-[#ecf6f1] rounded-xl p-6">
        {children}
      </main>
    </div>
  );
}
