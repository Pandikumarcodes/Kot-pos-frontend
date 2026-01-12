import AppRouter from "./Router/AppRouter";
import Header from "./design-system/organisms/Header";
import Sidebar from "./design-system/organisms/Sidebar";
export default function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <AppRouter />
          </main>
        </div>
      </div>
    </>
  );
}
