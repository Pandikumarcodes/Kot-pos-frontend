interface TabBarProps<T extends string> {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}

export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
}: TabBarProps<T>) {
  return (
    <div className="bg-kot-white rounded-2xl p-1 sm:p-2 flex gap-1 shadow-kot w-fit overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium capitalize transition-all whitespace-nowrap ${
            active === tab.key
              ? "bg-kot-dark text-white"
              : "text-kot-text hover:bg-kot-light hover:text-kot-darker"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
