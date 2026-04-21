import type { SignInPresenterProps } from "./SignIn.types.ts";

const EyeIcon = ({ show }: { show: boolean }) =>
  show ? (
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
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  ) : (
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
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

const inputBase =
  "w-full px-4 py-3 rounded-xl border-2 border-kot-chart bg-kot-white text-kot-darker text-sm outline-none transition-all duration-200 placeholder:text-kot-text/50 focus:border-kot-dark";

export function SignInPresenter({
  formData,
  errors,
  isLoading,
  rememberMe,
  showPassword,
  showForgotModal,
  onFieldChange,
  onTogglePassword,
  onToggleRemember,
  onSubmit,
  onBack,
  onSignUp,
  onForgotPassword,
  onCloseForgotModal,
}: SignInPresenterProps) {
  return (
    <div className="min-h-screen flex bg-kot-primary">
      {/* ── Forgot Password Modal ─────────────────────────── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-kot-white rounded-2xl p-6 w-full max-w-sm shadow-kot-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-kot-stats flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-kot-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-kot-darker">
                  Forgot Password?
                </h2>
              </div>
              <button
                onClick={onCloseForgotModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-kot-text hover:bg-kot-light hover:text-kot-darker transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-kot-chart mb-4" />

            {/* Info */}
            <div className="bg-kot-stats rounded-xl p-4 mb-4">
              <p className="text-sm text-kot-darker leading-relaxed">
                🔐 Password resets for KOT POS are managed by your restaurant
                admin.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-5">
              {[
                { step: "1", text: "Contact your restaurant admin or manager" },
                {
                  step: "2",
                  text: "Ask them to reset your password from Staff Management",
                },
                { step: "3", text: "Use your new password to sign in" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-kot-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">
                      {item.step}
                    </span>
                  </div>
                  <p className="text-sm text-kot-text">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Admin info box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-5 flex items-start gap-2">
              <span className="text-emerald-600 text-base flex-shrink-0">
                💡
              </span>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Admin can reset passwords from the{" "}
                <span className="font-semibold">Staff Management</span> page
                under the Admin dashboard.
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onCloseForgotModal}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-kot-dark hover:bg-kot-darker transition-all"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}

      {/* ── Left Banner — desktop only ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between p-10 xl:p-14 bg-kot-stats">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-kot-dark">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-bold text-xl xl:text-2xl text-kot-darker">
            KOT POS
          </span>
        </div>
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
        <div>
          <p className="text-xs mb-3 font-medium uppercase tracking-widest text-kot-text">
            Station Access
          </p>
          <div className="flex gap-2 flex-wrap">
            {[
              "⚙️ Admin",
              "📋 Manager",
              "💳 Cashier",
              "🍽️ Waiter",
              "👨‍🍳 Chef",
            ].map((r) => (
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

      {/* ── Right Form ── */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-4 sm:p-6 xl:p-8 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-kot-dark">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-lg text-kot-darker">KOT POS</span>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 mb-6 text-sm font-medium text-kot-text hover:text-kot-darker transition-colors"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-kot-darker">
              Sign In
            </h1>
            <p className="text-sm text-kot-text">
              Welcome back! Access your station below.
            </p>
          </div>

          {errors.api && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-600">
              {errors.api}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-kot-darker">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => onFieldChange("username", e.target.value)}
                placeholder="Enter your username"
                className={`${inputBase} ${errors.username ? "border-red-500" : ""}`}
                autoComplete="username"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-kot-darker">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => onFieldChange("password", e.target.value)}
                  placeholder="••••••••"
                  className={`${inputBase} pr-11 ${errors.password ? "border-red-500" : ""}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={onTogglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-kot-text hover:text-kot-darker transition-colors p-1"
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => onToggleRemember(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer accent-kot-dark"
                />
                <span className="text-xs text-kot-text">Remember me</span>
              </label>
              {/* ✅ Fixed: now calls onForgotPassword */}
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-medium text-kot-dark hover:text-kot-darker transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-kot-dark hover:bg-kot-darker transition-all duration-200 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="white"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-5 text-kot-text">
            Don't have an account?{" "}
            <button
              onClick={onSignUp}
              className="font-semibold text-kot-dark hover:text-kot-darker transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
