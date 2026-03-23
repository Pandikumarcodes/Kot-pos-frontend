import { useState } from "react";
import { Download, X } from "lucide-react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

export function InstallBanner() {
  const { canInstall, install, isInstalled } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if already installed, can't install, or dismissed
  if (isInstalled || !canInstall || dismissed) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-kot-stats rounded-xl border border-kot-chart">
      <button
        onClick={install}
        className="flex items-center gap-1.5 text-xs font-semibold text-kot-darker hover:text-kot-dark transition-colors"
      >
        <Download size={14} />
        Install App
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="text-kot-text hover:text-kot-darker transition-colors"
      >
        <X size={12} />
      </button>
    </div>
  );
}
