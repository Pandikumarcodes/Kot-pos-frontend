import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
