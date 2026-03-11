import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-kot-primary">
      {/* ── Left Banner — hidden on mobile, shown lg+ ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between p-10 xl:p-14 bg-kot-stats">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-kot-dark">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-bold text-xl xl:text-2xl text-kot-darker">
            KOT POS
          </span>
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6 xl:px-8">
          <div className="relative mb-10">
            <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-3xl flex items-center justify-center mx-auto bg-kot-light shadow-kot-lg">
              <svg
                className="w-10 h-10 xl:w-12 xl:h-12"
                fill="none"
                stroke="#4A5F52"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="absolute -top-3 -right-8 bg-kot-white rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-kot">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-kot-darker">
                Live Orders
              </span>
            </div>
            <div className="absolute -bottom-3 -left-8 bg-kot-white rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-kot">
              <span className="text-xs">👨‍🍳</span>
              <span className="text-xs font-medium text-kot-darker">
                Kitchen Ready
              </span>
            </div>
          </div>
          <h2 className="text-xl xl:text-2xl font-bold mb-3 leading-tight text-kot-darker">
            Manage your restaurant
            <br />
            from one place
          </h2>
          <p className="text-sm leading-relaxed max-w-xs text-kot-text">
            Orders, tables, billing and kitchen display — all connected in real
            time.
          </p>
        </div>

        {/* Role pills */}
        <div>
          <p className="text-xs mb-3 font-medium uppercase tracking-widest text-kot-text">
            Station Access
          </p>
          <div className="flex gap-2 flex-wrap">
            {["⚙️ Admin", "💳 Cashier", "🍽️ Waiter", "👨‍🍳 Chef"].map((r) => (
              <span
                key={r}
                className="bg-kot-white text-xs px-3 py-1.5 rounded-full font-medium text-kot-dark shadow-kot"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-4 sm:p-6 xl:p-8">
        <div className="w-full max-w-sm xl:max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-kot-dark">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-lg text-kot-darker">KOT POS</span>
          </div>

          {/* Mobile brand strip */}
          <div className="lg:hidden mb-6 p-4 bg-kot-stats rounded-2xl">
            <p className="text-xs font-medium uppercase tracking-widest text-kot-text mb-2">
              Station Access
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["⚙️ Admin", "💳 Cashier", "🍽️ Waiter", "👨‍🍳 Chef"].map((r) => (
                <span
                  key={r}
                  className="bg-kot-white text-xs px-2.5 py-1 rounded-full font-medium text-kot-dark shadow-kot"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold mb-2 text-kot-darker">
              Welcome back
            </h1>
            <p className="text-sm text-kot-text">
              Choose an option to access your station.
            </p>
          </div>

          {/* Sign In Card */}
          <div
            onClick={() => navigate("/signin")}
            className="group bg-kot-white rounded-2xl p-4 sm:p-6 mb-3 cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-kot-dark shadow-kot hover:shadow-kot-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-kot-light flex-shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="#4A5F52"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-kot-darker">
                    Sign In
                  </p>
                  <p className="text-xs mt-0.5 text-kot-text">
                    Access your account
                  </p>
                </div>
              </div>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0"
                fill="none"
                stroke="#C1D9CD"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Sign Up Card */}
          <div
            onClick={() => navigate("/signup")}
            className="group bg-kot-white rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-kot-dark shadow-kot hover:shadow-kot-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-kot-stats flex-shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="#4A5F52"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-kot-darker">
                    Create Account
                  </p>
                  <p className="text-xs mt-0.5 text-kot-text">
                    New staff registration
                  </p>
                </div>
              </div>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0"
                fill="none"
                stroke="#C1D9CD"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          <p className="text-center text-xs mt-6 sm:mt-8 text-kot-text">
            © 2026 KOT POS · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
