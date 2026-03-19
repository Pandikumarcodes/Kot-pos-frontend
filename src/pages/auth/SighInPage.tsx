// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch } from "../../Store/hooks";
// import { setCredentials } from "../../Store/Slices/authSlice";
// import api from "../../services/apiClient";
// import { validateLogin, hasErrors } from "../../utils/validation";

// interface FormErrors {
//   username?: string;
//   password?: string;
//   api?: string;
// }

// // ── Shared Left Banner ────────────────────────────────────────
// function LeftBanner() {
//   return (
//     <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between p-10 xl:p-14 bg-kot-stats">
//       <div className="flex items-center gap-3">
//         <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-kot-dark">
//           <span className="text-white font-bold text-sm">K</span>
//         </div>
//         <span className="font-bold text-xl xl:text-2xl text-kot-darker">
//           KOT POS
//         </span>
//       </div>
//       <div className="flex-1 flex flex-col justify-center items-center text-center px-6 xl:px-8">
//         <div className="relative mb-10">
//           <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-3xl flex items-center justify-center mx-auto bg-kot-light shadow-kot-lg">
//             <svg
//               className="w-10 h-10 xl:w-12 xl:h-12"
//               fill="none"
//               stroke="#4A5F52"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//               />
//             </svg>
//           </div>
//           <div className="absolute -top-3 -right-8 bg-kot-white rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-kot">
//             <div className="w-2 h-2 rounded-full bg-emerald-400" />
//             <span className="text-xs font-medium text-kot-darker">
//               Live Orders
//             </span>
//           </div>
//           <div className="absolute -bottom-3 -left-8 bg-kot-white rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-kot">
//             <span className="text-xs">👨‍🍳</span>
//             <span className="text-xs font-medium text-kot-darker">
//               Kitchen Ready
//             </span>
//           </div>
//         </div>
//         <h2 className="text-xl xl:text-2xl font-bold mb-3 leading-tight text-kot-darker">
//           Manage your restaurant
//           <br />
//           from one place
//         </h2>
//         <p className="text-sm leading-relaxed max-w-xs text-kot-text">
//           Orders, tables, billing and kitchen display — all connected in real
//           time.
//         </p>
//       </div>
//       <div>
//         <p className="text-xs mb-3 font-medium uppercase tracking-widest text-kot-text">
//           Station Access
//         </p>
//         <div className="flex gap-2 flex-wrap">
//           {["⚙️ Admin", "📋 Manager", "💳 Cashier", "🍽️ Waiter", "👨‍🍳 Chef"].map(
//             (r) => (
//               <span
//                 key={r}
//                 className="bg-kot-white text-xs px-3 py-1.5 rounded-full font-medium text-kot-dark shadow-kot"
//               >
//                 {r}
//               </span>
//             ),
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function SignInPage() {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [rememberMe, setRememberMe] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const ROLE_HOME: Record<string, string> = {
//     admin: "/admin/dashboard",
//     manager: "/admin/dashboard",
//     cashier: "/cashier/billing",
//     waiter: "/waiter/tables",
//     chef: "/chef/kot",
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const errs = validateLogin(formData);
//     if (hasErrors(errs)) {
//       setErrors(errs);
//       return;
//     }
//     setIsLoading(true);
//     setErrors({});
//     try {
//       const res = await api.post("/auth/login", {
//         username: formData.username.trim(),
//         password: formData.password,
//       });
//       const { user } = res.data;
//       dispatch(
//         setCredentials({
//           id: user.id,
//           name: user.username,
//           email: user.username,
//           role: user.role,
//         }),
//       );
//       navigate(ROLE_HOME[user.role] ?? "/");
//     } catch (err) {
//       const error = err as { response?: { data?: { error?: string } } };
//       setErrors({
//         api: error?.response?.data?.error || "Invalid username or password",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const inputBase =
//     "w-full px-4 py-3 rounded-xl border-2 border-kot-chart bg-kot-white text-kot-darker text-sm outline-none transition-all duration-200 placeholder:text-kot-text/50 focus:border-kot-dark";

//   return (
//     <div className="min-h-screen flex bg-kot-primary">
//       <LeftBanner />

//       {/* ── Right Form ── */}
//       <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-4 sm:p-6 xl:p-8 overflow-y-auto">
//         <div className="w-full max-w-sm xl:max-w-md">
//           {/* Mobile logo */}
//           <div className="flex items-center gap-3 mb-6 lg:hidden">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-kot-dark">
//               <span className="text-white font-bold text-sm">K</span>
//             </div>
//             <span className="font-bold text-lg text-kot-darker">KOT POS</span>
//           </div>

//           <button
//             onClick={() => navigate("/login")}
//             className="flex items-center gap-1.5 mb-6 sm:mb-8 text-sm font-medium text-kot-text hover:text-kot-darker transition-colors"
//           >
//             <svg
//               className="w-4 h-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//             Back
//           </button>

//           <div className="mb-6 sm:mb-8">
//             <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold mb-1 text-kot-darker">
//               Sign In
//             </h1>
//             <p className="text-sm text-kot-text">
//               Welcome back! Access your station below.
//             </p>
//           </div>

//           {errors.api && (
//             <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-600">
//               {errors.api}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Username */}
//             <div>
//               <label className="block text-sm font-medium mb-1.5 text-kot-darker">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 value={formData.username}
//                 onChange={(e) => {
//                   setFormData({ ...formData, username: e.target.value });
//                   if (errors.username)
//                     setErrors({ ...errors, username: undefined });
//                 }}
//                 placeholder="Enter your username"
//                 className={`${inputBase} ${errors.username ? "border-red-500" : ""}`}
//               />
//               {errors.username && (
//                 <p className="mt-1 text-xs text-red-500">{errors.username}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium mb-1.5 text-kot-darker">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={(e) => {
//                     setFormData({ ...formData, password: e.target.value });
//                     if (errors.password)
//                       setErrors({ ...errors, password: undefined });
//                   }}
//                   placeholder="••••••••"
//                   className={`${inputBase} pr-11 ${errors.password ? "border-red-500" : ""}`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-kot-text hover:text-kot-darker transition-colors"
//                 >
//                   {showPassword ? (
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                       />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-xs text-red-500">{errors.password}</p>
//               )}
//             </div>

//             {/* Remember me */}
//             <div className="flex items-center justify-between">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="w-4 h-4 rounded cursor-pointer accent-kot-dark"
//                 />
//                 <span className="text-xs text-kot-text">Remember me</span>
//               </label>
//               <button
//                 type="button"
//                 className="text-xs font-medium text-kot-dark hover:text-kot-darker transition-colors"
//               >
//                 Forgot password?
//               </button>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3 sm:py-3.5 rounded-xl text-sm font-semibold text-white bg-kot-dark hover:bg-kot-darker transition-all duration-200 mt-2 disabled:opacity-60"
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg
//                     className="animate-spin w-4 h-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="white"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="white"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                     />
//                   </svg>
//                   Signing in...
//                 </span>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </form>

//           <p className="text-center text-sm mt-5 sm:mt-6 text-kot-text">
//             Don't have an account?{" "}
//             <button
//               onClick={() => navigate("/signup")}
//               className="font-semibold text-kot-dark hover:text-kot-darker transition-colors"
//             >
//               Sign up
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
