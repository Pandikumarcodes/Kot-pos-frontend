// src/components/organisms/Header/Header.tsx
import { Button } from "../atoms/Button/Button";

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
}

export const Header = ({
  title = "Dashboard",
  subtitle,
  userName,
  userRole,
  onLogout,
  onProfileClick,
  actions,
  showBackButton = false,
  onBack,
}: HeaderProps) => {
  return (
    <header className="bg-kot-header border-b border-kot-chart">
      <div className="px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
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

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-kot-darker truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-kot-text truncate">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right Section - Actions and User */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Custom Actions */}
            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}

            {/* User Info */}
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
                    <p className="text-xs text-kot-text">{userRole}</p>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-kot-primary text-white flex items-center justify-center font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </button>
            )}

            {/* Logout Button */}
            {onLogout && (
              <Button variant="secondary" onClick={onLogout}>
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">
                  <svg
                    className="w-5 h-5"
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
