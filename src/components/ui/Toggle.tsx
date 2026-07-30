interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
}

export function Toggle({ checked, onChange, label, desc }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-kot-light">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded accent-kot-dark flex-shrink-0"
      />
      <div>
        <p className="font-medium text-kot-darker text-sm">{label}</p>
        {desc && <p className="text-xs text-kot-text">{desc}</p>}
      </div>
    </label>
  );
}
