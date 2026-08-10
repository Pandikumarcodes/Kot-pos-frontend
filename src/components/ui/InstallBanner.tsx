import { useState } from "react";
import { Download, X } from "lucide-react";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";

export function InstallBanner() {
  const { canInstall, install, isInstalled } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if already installed, can't install, or dismissed
  if (isInstalled || !canInstall || dismissed) return null;

  return (
    <div className="flex items-center rounded-lg border border-kot-chart bg-kot-white sm:gap-0.5">
      <button
        type="button"
        onClick={install}
        aria-label="Install KOT POS app"
        className="flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium text-kot-darker transition-colors hover:bg-kot-light hover:text-kot-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kot-dark"
      >
        <Download size={16} aria-hidden="true" />
        <span className="hidden sm:inline">Install App</span>
      </button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss install prompt"
        className="flex size-10 items-center justify-center rounded-md text-kot-text transition-colors hover:bg-kot-light hover:text-kot-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kot-dark"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
