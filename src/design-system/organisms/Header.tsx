// src/design-system/organisms/Header.tsx
import { Menu } from "lucide-react";
import { Button } from "../../UiComponents/Button";
import { InstallBanner } from "../../UiComponents/InstallBanner";

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
  onProfileClick?: () => void;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  onMenuToggle?: () => void; // ← hamburger toggle
}

export const Header = ({
  title = "Restaurant POS",
  subtitle,
  userName,
  userRole,
  onLogout,
  onProfileClick,
  actions,
  showBackButton = false,
  onBack,
  onMenuToggle,
}: HeaderProps) => {
  return (
    <header className="bg-kot-header border-b border-kot-chart sticky top-0 z-40">
      <div className="px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-2">
          {/* Left Section */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-lg hover:bg-kot-light text-kot-text hover:text-kot-darker transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Back button */}
            {showBackButton && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-kot-light rounded-lg transition-colors flex-shrink-0"
                aria-label="Go back"
              >
                <svg
                  className="w-5 h-5 text-kot-text"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Title */}
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-bold text-kot-darker truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-kot-text truncate hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
            {/* Install Banner */}
            <InstallBanner />

            {/* Custom Actions */}
            {actions && (
              <div className="flex items-center gap-1 md:gap-2">{actions}</div>
            )}

            {/* User Info — hidden on small mobile */}
            {userName && (
              <button
                onClick={onProfileClick}
                className="hidden md:flex items-center gap-3 px-3 py-2 hover:bg-kot-light rounded-lg transition-colors"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-kot-darker">
                    {userName}
                  </p>
                  {userRole && (
                    <p className="text-xs text-kot-text capitalize">
                      {userRole}
                    </p>
                  )}
                </div>
                <div className="w-9 h-9 rounded-full bg-kot-dark text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </button>
            )}

            {/* Avatar only on small screens */}
            {userName && (
              <button
                onClick={onProfileClick}
                className="md:hidden w-8 h-8 rounded-full bg-kot-dark text-white flex items-center justify-center font-semibold text-sm flex-shrink-0"
              >
                {userName.charAt(0).toUpperCase()}
              </button>
            )}

            {/* Logout */}
            {onLogout && (
              <Button
                variant="secondary"
                onClick={onLogout}
                className="text-xs md:text-sm px-2 md:px-4"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
