import Sidebar from "../organisms/Sidebar";
import Header from "../organisms/Header";

type AppTemplateProps = {
  children: React.ReactNode;
};

export default function AppTemplate({ children }: AppTemplateProps) {
  return (
    <div className="flex min-h-screen bg-kot-dark">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
