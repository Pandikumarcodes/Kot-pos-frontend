type AuthTemplateProps = {
  children: React.ReactNode;
};

export default function AuthTemplate({ children }: AuthTemplateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-kot-dark">
      <div className="w-full max-w-md bg-kot-card p-6 rounded-lg">
        {children}
      </div>
    </div>
  );
}
