type CardProps = {
  children: React.ReactNode;
};

export const Card = ({ children }: CardProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      {children}
    </div>
  );
};
