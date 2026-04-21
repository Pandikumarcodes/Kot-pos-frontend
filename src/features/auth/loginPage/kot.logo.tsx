// ── Reusable KOT POS Logo Component ──────────────────────────
// Use this across all auth pages and sidebar
// Usage: <KotLogo size="sm" /> or <KotLogo size="md" />

interface KotLogoProps {
  size?: "sm" | "md" | "lg";
}

export function KotLogo({ size = "md" }: KotLogoProps) {
  const imgSize =
    size === "sm" ? "w-9 h-9" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const textSize =
    size === "sm"
      ? "text-lg"
      : size === "lg"
        ? "text-2xl"
        : "text-xl xl:text-2xl";

  return (
    <div className="flex items-center gap-3">
      <img
        src="/icons/icon.png"
        alt="KOT POS Logo"
        className={`${imgSize} rounded-xl object-cover shadow-kot`}
      />
      <span className={`font-bold ${textSize} text-kot-darker`}>KOT POS</span>
    </div>
  );
}
