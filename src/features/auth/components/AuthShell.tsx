// import type { ReactNode } from "react";

// const STATION_ROLES = ["Admin", "Manager", "Cashier", "Waiter", "Chef"];

// interface AuthShellProps {
//   children: ReactNode;
//   heading: string;
//   description: string;
//   features?: readonly string[];
//   contentClassName?: string;
// }

// function Brand() {
//   return (
//     <div className="flex items-center gap-3" aria-label="KOT POS">
//       <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-kot-dark shadow-kot">
//         <span className="text-sm font-bold text-white">K</span>
//       </div>
//       <span className="text-xl font-bold tracking-tight text-kot-darker">
//         KOT POS
//       </span>
//     </div>
//   );
// }

// export function AuthShell({
//   children,
//   heading,
//   description,
//   features,
//   contentClassName = "max-w-sm",
// }: AuthShellProps) {
//   return (
//     <div className="flex min-h-screen min-h-dvh bg-kot-primary lg:h-screen lg:h-dvh lg:overflow-hidden">
//       <aside className="hidden w-[40%] shrink-0 flex-col border-r border-kot-chart bg-kot-stats p-8 lg:flex xl:p-10">
//         <Brand />

//         <div className="flex flex-1 flex-col justify-center py-10">
//           <div className="max-w-md">
//             <h2 className="text-3xl font-bold leading-tight tracking-tight text-kot-darker xl:text-4xl">
//               {heading}
//             </h2>
//             <p className="mt-4 max-w-sm text-base leading-7 text-kot-text">
//               {description}
//             </p>

//             {features && (
//               <ul className="mt-7 space-y-3">
//                 {features.map((feature) => (
//                   <li
//                     key={feature}
//                     className="flex items-center gap-3 text-sm font-medium text-kot-dark"
//                   >
//                     <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-kot-dark text-xs font-bold text-white">
//                       ✓
//                     </span>
//                     {feature}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>

//         <div>
//           <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-kot-text">
//             Station Access
//           </p>
//           <div className="flex flex-wrap gap-2">
//             {STATION_ROLES.map((role) => (
//               <span
//                 key={role}
//                 className="rounded-full border border-kot-chart bg-kot-white px-3 py-1.5 text-xs font-medium text-kot-dark"
//               >
//                 {role}
//               </span>
//             ))}
//           </div>
//         </div>
//       </aside>

//       <main className="flex min-h-screen min-h-dvh min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-8 lg:min-h-0 lg:px-10">
//         <div className={`my-auto w-full ${contentClassName} mx-auto`}>
//           <div className="mb-8 lg:hidden">
//             <Brand />
//           </div>
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }
