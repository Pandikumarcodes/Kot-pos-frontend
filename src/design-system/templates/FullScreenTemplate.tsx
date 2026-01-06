type FullScreenTemplateProps = {
  children: React.ReactNode;
};

export default function FullScreenTemplate({
  children,
}: FullScreenTemplateProps) {
  return <div className="min-h-screen bg-kot-dark">{children}</div>;
}
