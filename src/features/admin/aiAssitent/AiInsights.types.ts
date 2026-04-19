export interface InventoryAlert {
  _id: string;
  name: string;
  currentStock: number;
  unit: string;
  reorderLevel: number;
  avgDailyUsage: number;
  daysUntilStockout: number | null;
  level: "ok" | "info" | "warning" | "critical";
  emoji: string;
  message: string;
}

export interface AlertCounts {
  critical: number;
  warning: number;
  info: number;
  ok: number;
}

export interface SummaryData {
  date: string;
  totalRevenue: string;
  totalOrders: number;
  orderChange: string;
  orderTrend: "up" | "down" | "neutral";
  topItems: { name: string; qty: number }[];
  peakHour: string;
  paymentBreakdown: Record<string, number>;
  dineIn: number;
  takeaway: number;
  avgOrderValue: string;
  criticalStockItems: string[];
}
export interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

export type AlertFilterLevel = "all" | "critical" | "warning" | "info" | "ok";
export type ActiveTab = "summary" | "inventory" | "chat";

export interface AiInsightsPresenterProps {
  // Tab
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;

  // Summary
  summaryData: SummaryData | null;
  aiSummary: string;
  summaryLoading: boolean;
  summaryError: string | null;
  onRetrySummary: () => void;

  // Inventory
  alerts: InventoryAlert[];
  counts: AlertCounts | null;
  alertsLoading: boolean;
  alertsError: string | null;
  filterLevel: AlertFilterLevel;
  onFilterChange: (level: AlertFilterLevel) => void;
  onRetryAlerts: () => void;

  // Refresh all
  onRefresh: () => void;

  // Chat
  messages: Message[];
  chatInput: string;
  chatLoading: boolean;
  onChatInputChange: (value: string) => void;
  onChatSend: (text: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}
export const QUICK_QUESTIONS = [
  "What was my total revenue yesterday?",
  "Which item sold the most today?",
  "What are my peak hours?",
  "Which payment method is most used?",
  "How many orders did I get this week?",
  "Which waiter had the most orders?",
  "What is my average order value?",
  "Compare today's sales with yesterday",
] as const;
