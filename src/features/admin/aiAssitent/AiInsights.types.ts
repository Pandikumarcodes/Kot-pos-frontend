import React from "react";

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
  chatLoading: boolean;
  onChatSend: (text: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

// ── Categorized questions for chat tab ────────────────────────
export const CATEGORIZED_QUESTIONS: Record<string, string[]> = {
  sales: [
    "What was my total revenue yesterday?",
    "What is my average order value?",
    "Which payment method is most used?",
    "Compare today's sales with yesterday",
    "How many orders did I get this week?",
  ],
  menu: [
    "Which item sold the most today?",
    "What are my top 5 best selling items?",
    "Which items are selling slow?",
    "What is the most popular category?",
    "Which item generates most revenue?",
  ],
  ops: [
    "What are my peak hours?",
    "How many dine-in vs takeaway orders?",
    "What is the busiest day of the week?",
    "What time do most customers arrive?",
  ],
  staff: [
    "Which waiter had the most orders?",
    "Who is the top performing staff today?",
    "How many orders per waiter on average?",
    "Which shift is most productive?",
  ],
};

// kept for backward compat — no longer used in chat tab
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
