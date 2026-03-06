// src/pages/auth/SignUpPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  status: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  terms?: string;
  api?: string;
}

export default function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    confirmPassword: "",
    role: "waiter",
    status: "active",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputClass =
    "w-full px-4 py-3 rounded-xl border-2 border-kot-chart bg-kot-white text-kot-darker text-sm outline-none transition-all duration-200 placeholder:text-kot-text/50 focus:border-kot-dark";

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!formData.username.trim()) e.username = "Username is required";
    else if (formData.username.trim().length < 2)
      e.username = "At least 2 characters";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 8) e.password = "Minimum 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      e.password = "Must contain uppercase, lowercase and number";
    if (!formData.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!formData.role) e.role = "Please select a role";
    if (!agreeToTerms) e.terms = "You must agree to the terms";
    return e;
  };

  const passwordChecks = [
    { label: "At least 8 characters", pass: formData.password.length >= 8 },
    {
      label: "Uppercase & lowercase",
      pass: /(?=.*[a-z])(?=.*[A-Z])/.test(formData.password),
    },
    { label: "Contains a number", pass: /(?=.*\d)/.test(formData.password) },
  ];
  const strengthCount = passwordChecks.filter((c) => c.pass).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      await axios.post(
        "http://localhost:3000/auth/signup",
        {
          username: formData.username,
          password: formData.password,
          role: formData.role,
          status: formData.status,
        },
        { withCredentials: true },
      );
      navigate("/signin");
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setErrors({
        api: error?.response?.data?.error || "Registration failed. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex bg-kot-primary">
      {/* ── Left Banner ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 bg-kot-stats">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-kot-dark">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-bold text-xl text-kot-darker">KOT POS</span>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center px-8">
          <div className="relative mb-10">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto bg-kot-light shadow-kot-lg">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="#4A5F52"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
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

          <h2 className="text-2xl font-bold mb-3 leading-tight text-kot-darker">
            Join KOT and take
            <br />
            control today
          </h2>
          <p className="text-sm leading-relaxed max-w-xs text-kot-text">
            Orders, tables, billing and kitchen display — all connected in real
            time.
          </p>

          <div className="mt-8 space-y-3 text-left w-full max-w-xs">
            {[
              "Streamline Order Management",
              "Optimize Table Reservations",
              "Real-time Kitchen Display",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-kot-dark">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-kot-dark">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs mb-3 font-medium uppercase tracking-widest text-kot-text">
            Station Access
          </p>
          <div className="flex gap-2 flex-wrap">
            {["📋 Manager","⚙️ Admin", "💳 Cashier", "🍽️ Waiter", "👨‍🍳 Chef"].map((r) => (
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

      {/* ── Right Form Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-sm py-8">
          {/* Back */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 mb-8 text-sm font-medium text-kot-text hover:text-kot-darker transition-colors"
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

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1 text-kot-darker">
              Create Account
            </h1>
            <p className="text-sm text-kot-text">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="font-semibold text-kot-dark hover:text-kot-darker transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>

          {/* API Error */}
          {errors.api && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-600">
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-kot-darker">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="e.g. john_waiter"
                className={`${inputClass} ${errors.username ? "border-red-500" : ""}`}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-kot-darker">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="manager">📋 Manager</option>
                <option value="admin">⚙️ Admin</option>
                <option value="cashier">💳 Cashier</option>
                <option value="waiter">🍽️ Waiter</option>
                <option value="chef">👨‍🍳 Chef</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-500">{errors.role}</p>
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
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className={`${inputClass} pr-11 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-kot-text hover:text-kot-darker transition-colors"
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
              {formData.password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < strengthCount ? "bg-kot-dark" : "bg-kot-chart"}`}
                      />
                    ))}
                  </div>
                  <div className="space-y-0.5">
                    {passwordChecks.map((c) => (
                      <p
                        key={c.label}
                        className={`text-xs flex items-center gap-1 ${c.pass ? "text-kot-dark" : "text-kot-text"}`}
                      >
                        {c.pass ? "✓" : "·"} {c.label}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-kot-darker">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  placeholder="Re-enter password"
                  className={`${inputClass} pr-11 ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-kot-text hover:text-kot-darker transition-colors"
                >
                  <EyeIcon show={showConfirm} />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked);
                    if (errors.terms)
                      setErrors((prev) => ({ ...prev, terms: undefined }));
                  }}
                  className="mt-0.5 w-4 h-4 rounded cursor-pointer accent-kot-dark"
                />
                <span className="text-xs leading-relaxed text-kot-text">
                  I agree to the{" "}
                  <span className="underline cursor-pointer font-medium text-kot-dark">
                    Terms
                  </span>{" "}
                  and{" "}
                  <span className="underline cursor-pointer font-medium text-kot-dark">
                    Privacy Policy
                  </span>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-kot-dark hover:bg-kot-darker transition-all duration-200 disabled:opacity-60"
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
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
