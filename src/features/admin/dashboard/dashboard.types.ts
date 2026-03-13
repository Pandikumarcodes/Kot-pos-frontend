export type RangeType = "today" | "week" | "month";
export type ViewType = "overview" | "tables" | "analytics";

export interface Summary {
  totalRevenue: number;
  totalOrders: number;
  totalBills: number;
  avgOrderValue: number;
  dineInCount: number;
  takeawayCount: number;
}

export interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

export interface DashboardTable {
  _id: string;
  tableNumber: number;
  status: "available" | "occupied" | "billing" | "reserved";
  capacity: number;
}

export interface HourlyData {
  hour: string;
  orders: number;
  revenue: number;
}

export interface PaymentMethod {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

// Props passed from container → presenter
export interface AdminDashboardPresenterProps {
  // data
  summary: Summary | null;
  topItems: TopItem[];
  tables: DashboardTable[];
  hourly: HourlyData[];
  payments: PaymentMethod[];
  // ui state
  loading: boolean;
  refreshing: boolean;
  range: RangeType;
  selectedView: ViewType;
  // actions
  onRangeChange: (r: RangeType) => void;
  onViewChange: (v: ViewType) => void;
  onRefresh: () => void;
  onNavigate: (path: string) => void;
}
