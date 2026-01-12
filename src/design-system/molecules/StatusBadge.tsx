import type { LucideIcon } from "lucide-react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Flame,
  Package,
  DollarSign,
  User,
} from "lucide-react";

// Types
type StatusVariant =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled"
  | "occupied"
  | "available"
  | "reserved"
  | "paid"
  | "unpaid";

interface StatusBadgeProps {
  status: StatusVariant;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Configuration
const statusConfig: Record<
  StatusVariant,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: LucideIcon;
  }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: Clock,
  },
  preparing: {
    label: "Preparing",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: Flame,
  },
  ready: {
    label: "Ready",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Package,
  },
  completed: {
    label: "Completed",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: XCircle,
  },
  occupied: {
    label: "Occupied",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: User,
  },
  available: {
    label: "Available",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle,
  },
  reserved: {
    label: "Reserved",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: AlertCircle,
  },
  paid: {
    label: "Paid",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: DollarSign,
  },
  unpaid: {
    label: "Unpaid",
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    icon: DollarSign,
  },
};

const sizeConfig = {
  sm: {
    padding: "px-2 py-0.5",
    text: "text-xs",
    iconSize: 12,
  },
  md: {
    padding: "px-2.5 py-1",
    text: "text-sm",
    iconSize: 14,
  },
  lg: {
    padding: "px-3 py-1.5",
    text: "text-base",
    iconSize: 16,
  },
};

export default function StatusBadge({
  status,
  showIcon = true,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${config.color} ${config.bgColor} ${config.borderColor}
        ${sizeStyles.padding} ${sizeStyles.text}
        ${className}
      `}
    >
      {showIcon && <Icon size={sizeStyles.iconSize} />}
      <span>{config.label}</span>
    </span>
  );
}

// Demo Component
// function StatusBadgeDemo() {
//   const statuses: StatusVariant[] = [
//     "pending",
//     "preparing",
//     "ready",
//     "completed",
//     "cancelled",
//     "occupied",
//     "available",
//     "reserved",
//     "paid",
//     "unpaid",
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-4xl mx-auto space-y-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             StatusBadge Component
//           </h1>
//           <p className="text-gray-600">
//             Reusable status badge for KOT POS system
//           </p>
//         </div>

//         {/* Default Size */}
//         <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             Default (Medium)
//           </h2>
//           <div className="flex flex-wrap gap-3">
//             {statuses.map((status) => (
//               <StatusBadge key={status} status={status} />
//             ))}
//           </div>
//         </section>

//         {/* Small Size */}
//         <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             Small Size
//           </h2>
//           <div className="flex flex-wrap gap-2">
//             {statuses.map((status) => (
//               <StatusBadge key={status} status={status} size="sm" />
//             ))}
//           </div>
//         </section>

//         {/* Large Size */}
//         <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             Large Size
//           </h2>
//           <div className="flex flex-wrap gap-3">
//             {statuses.map((status) => (
//               <StatusBadge key={status} status={status} size="lg" />
//             ))}
//           </div>
//         </section>

//         {/* Without Icons */}
//         <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             Without Icons
//           </h2>
//           <div className="flex flex-wrap gap-3">
//             {statuses.map((status) => (
//               <StatusBadge key={status} status={status} showIcon={false} />
//             ))}
//           </div>
//         </section>

//         {/* Usage Examples */}
//         <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             Usage Examples
//           </h2>
//           <div className="space-y-4">
//             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
//               <span className="text-gray-700 font-medium">Order #1234</span>
//               <StatusBadge status="preparing" />
//               <span className="text-sm text-gray-500 ml-auto">Table 5</span>
//             </div>

//             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
//               <span className="text-gray-700 font-medium">Table #8</span>
//               <StatusBadge status="occupied" size="sm" />
//               <span className="text-sm text-gray-500 ml-auto">4 guests</span>
//             </div>

//             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
//               <span className="text-gray-700 font-medium">Invoice #5678</span>
//               <StatusBadge status="paid" />
//               <span className="text-sm text-gray-500 ml-auto">₹1,250</span>
//             </div>
//           </div>
//         </section>

//         {/* Props Documentation */}
//         <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">Props</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-2 text-left font-semibold">Prop</th>
//                   <th className="px-4 py-2 text-left font-semibold">Type</th>
//                   <th className="px-4 py-2 text-left font-semibold">Default</th>
//                   <th className="px-4 py-2 text-left font-semibold">
//                     Description
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 <tr>
//                   <td className="px-4 py-2 font-mono text-xs">status</td>
//                   <td className="px-4 py-2 font-mono text-xs">StatusVariant</td>
//                   <td className="px-4 py-2">-</td>
//                   <td className="px-4 py-2">Required. The status to display</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2 font-mono text-xs">showIcon</td>
//                   <td className="px-4 py-2 font-mono text-xs">boolean</td>
//                   <td className="px-4 py-2">true</td>
//                   <td className="px-4 py-2">Show/hide the icon</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2 font-mono text-xs">size</td>
//                   <td className="px-4 py-2 font-mono text-xs">
//                     'sm' | 'md' | 'lg'
//                   </td>
//                   <td className="px-4 py-2">'md'</td>
//                   <td className="px-4 py-2">Badge size variant</td>
//                 </tr>
//                 <tr>
//                   <td className="px-4 py-2 font-mono text-xs">className</td>
//                   <td className="px-4 py-2 font-mono text-xs">string</td>
//                   <td className="px-4 py-2">''</td>
//                   <td className="px-4 py-2">Additional CSS classes</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

/* import StatusBadge from "./design-system/molecules/StatusBadge";

// Basic usage
<StatusBadge status="preparing" />

// Different sizes
<StatusBadge status="completed" size="sm" />
<StatusBadge status="pending" size="lg" />

// Without icon
<StatusBadge status="available" showIcon={false} />

// With custom styling
<StatusBadge status="occupied" className="ml-2" />
 */
