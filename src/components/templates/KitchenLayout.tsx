interface KitchenLayoutProps {
  children: React.ReactNode;
}

export function KitchenLayout({ children }: KitchenLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">
      {/* Top bar */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kitchen Orders</h1>
        <span className="text-sm text-green-400">● LIVE</span>
      </header>

      {/* Orders */}
      <main>{children}</main>
    </div>
  );
}
