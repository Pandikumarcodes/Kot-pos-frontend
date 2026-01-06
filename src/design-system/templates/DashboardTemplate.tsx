import AppTemplate from "./AppTemplate";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppTemplate>
      <div className="max-w-7xl mx-auto space-y-6">{children}</div>
    </AppTemplate>
  );
}
