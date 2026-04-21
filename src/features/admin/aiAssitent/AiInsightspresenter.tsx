import { useState } from "react";
import {
  Bot,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  Package,
  TrendingUp,
  Clock,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";

import type { AiInsightsPresenterProps } from "./AiInsights.types";
import { CATEGORIZED_QUESTIONS } from "./AiInsights.types";

const LEVEL_CONFIG = {
  critical: {
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700",
    icon: AlertTriangle,
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-700",
    icon: AlertCircle,
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
    icon: Info,
  },
  ok: {
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
  },
};

const CHAT_CATEGORIES = [
  { id: "sales", emoji: "📊", label: "Sales" },
  { id: "menu", emoji: "🍽️", label: "Menu" },
  { id: "ops", emoji: "⏰", label: "Ops" },
  { id: "staff", emoji: "👥", label: "Staff" },
];

export function AiInsightsPresenter({
  activeTab,
  onTabChange,
  summaryData,
  aiSummary,
  summaryLoading,
  summaryError,
  onRetrySummary,
  alerts,
  counts,
  alertsLoading,
  alertsError,
  filterLevel,
  onFilterChange,
  onRetryAlerts,
  onRefresh,
  messages,
  chatLoading,
  onChatSend,
  messagesEndRef,
}: AiInsightsPresenterProps) {
  const filteredAlerts =
    filterLevel === "all"
      ? alerts
      : alerts.filter((a) => a.level === filterLevel);

  const [chatCategory, setChatCategory] = useState("sales");

  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">
        {/* ── Header ────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-kot-dark flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-kot-darker">
                AI Insights
              </h1>
              <p className="text-sm text-kot-text">
                Smart analysis powered by AI
              </p>
            </div>
          </div>
          {activeTab !== "chat" && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-kot-chart text-kot-dark bg-kot-white hover:bg-kot-light transition-all"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          )}
        </div>

        {/* ── Tabs ──────────────────────────────────────────── */}
        <div className="bg-kot-white rounded-2xl p-1.5 flex gap-1 w-fit shadow-kot">
          <button
            onClick={() => onTabChange("summary")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "summary"
                ? "bg-kot-dark text-white"
                : "text-kot-text hover:bg-kot-light"
            }`}
          >
            <TrendingUp size={16} />
            Daily Summary
          </button>
          <button
            onClick={() => onTabChange("inventory")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "inventory"
                ? "bg-kot-dark text-white"
                : "text-kot-text hover:bg-kot-light"
            }`}
          >
            <Package size={16} />
            Inventory Alerts
            {(counts?.critical ?? 0) > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {counts!.critical}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange("chat")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "chat"
                ? "bg-kot-dark text-white"
                : "text-kot-text hover:bg-kot-light"
            }`}
          >
            <Bot size={16} />
            AI Chat
          </button>
        </div>

        {/* ════════════════════════════════════════════════════
            TAB 1 — DAILY SUMMARY
        ════════════════════════════════════════════════════ */}
        {activeTab === "summary" && (
          <div className="space-y-4">
            {summaryLoading ? (
              <LoadingCard message="Generating your daily summary..." />
            ) : summaryError ? (
              <ErrorCard message={summaryError} onRetry={onRetrySummary} />
            ) : (
              <>
                <div className="bg-kot-white rounded-2xl p-6 shadow-kot border-l-4 border-kot-dark">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot size={18} className="text-kot-dark" />
                    <span className="text-sm font-semibold text-kot-dark">
                      AI Summary
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-kot-stats text-kot-darker">
                      Powered by Gemini
                    </span>
                  </div>
                  <p className="text-kot-darker leading-relaxed">
                    {aiSummary || "No summary available."}
                  </p>
                </div>

                {summaryData && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        {
                          label: "Revenue",
                          value: summaryData.totalRevenue,
                          icon: TrendingUp,
                          color: "text-emerald-600",
                          bg: "bg-emerald-50",
                        },
                        {
                          label: "Orders",
                          value: summaryData.totalOrders,
                          icon: ShoppingBag,
                          color: "text-blue-600",
                          bg: "bg-blue-50",
                        },
                        {
                          label: "Avg Order",
                          value: summaryData.avgOrderValue,
                          icon: TrendingUp,
                          color: "text-purple-600",
                          bg: "bg-purple-50",
                        },
                        {
                          label: "Peak Hour",
                          value: summaryData.peakHour,
                          icon: Clock,
                          color: "text-orange-600",
                          bg: "bg-orange-50",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="bg-kot-white rounded-2xl p-4 shadow-kot"
                        >
                          <div
                            className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}
                          >
                            <s.icon size={18} className={s.color} />
                          </div>
                          <p className="text-xl font-bold text-kot-darker">
                            {s.value}
                          </p>
                          <p className="text-xs text-kot-text">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-kot-white rounded-2xl p-5 shadow-kot">
                        <h3 className="font-bold text-kot-darker mb-4">
                          🏆 Top Selling Items
                        </h3>
                        {summaryData.topItems.length === 0 ? (
                          <p className="text-kot-text text-sm">
                            No orders yesterday
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {summaryData.topItems.map((item, i) => (
                              <div
                                key={item.name}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : "bg-orange-500"}`}
                                  >
                                    {i + 1}
                                  </span>
                                  <span className="text-sm text-kot-darker">
                                    {item.name}
                                  </span>
                                </div>
                                <span className="text-sm font-bold text-kot-dark">
                                  {item.qty} orders
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="bg-kot-white rounded-2xl p-5 shadow-kot">
                        <h3 className="font-bold text-kot-darker mb-4">
                          📊 Order Breakdown
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-kot-text">
                              🪑 Dine-in
                            </span>
                            <span className="font-bold text-kot-darker">
                              {summaryData.dineIn}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-kot-text">
                              🥡 Takeaway
                            </span>
                            <span className="font-bold text-kot-darker">
                              {summaryData.takeaway}
                            </span>
                          </div>
                          <div className="border-t border-kot-chart pt-3">
                            <p className="text-xs font-semibold text-kot-text mb-2">
                              PAYMENT METHODS
                            </p>
                            {Object.entries(summaryData.paymentBreakdown).map(
                              ([method, count]) => (
                                <div
                                  key={method}
                                  className="flex justify-between items-center"
                                >
                                  <span className="text-sm text-kot-text capitalize">
                                    {method}
                                  </span>
                                  <span className="font-semibold text-kot-darker">
                                    {count}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {summaryData.criticalStockItems.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                        <AlertTriangle
                          size={20}
                          className="text-red-500 flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="font-semibold text-red-700">
                            Stock Alert
                          </p>
                          <p className="text-sm text-red-600 mt-0.5">
                            Reorder needed:{" "}
                            {summaryData.criticalStockItems.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 2 — INVENTORY ALERTS
        ════════════════════════════════════════════════════ */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            {alertsLoading ? (
              <LoadingCard message="Analyzing inventory usage..." />
            ) : alertsError ? (
              <ErrorCard message={alertsError} onRetry={onRetryAlerts} />
            ) : (
              <>
                {counts && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        label: "Critical",
                        count: counts.critical,
                        bg: "bg-red-50",
                        text: "text-red-700",
                        dot: "bg-red-500",
                      },
                      {
                        label: "Warning",
                        count: counts.warning,
                        bg: "bg-yellow-50",
                        text: "text-yellow-700",
                        dot: "bg-yellow-500",
                      },
                      {
                        label: "Info",
                        count: counts.info,
                        bg: "bg-blue-50",
                        text: "text-blue-700",
                        dot: "bg-blue-500",
                      },
                      {
                        label: "OK",
                        count: counts.ok,
                        bg: "bg-emerald-50",
                        text: "text-emerald-700",
                        dot: "bg-emerald-500",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className={`${s.bg} rounded-2xl p-4 shadow-kot flex items-center gap-3`}
                      >
                        <div className={`w-3 h-3 rounded-full ${s.dot}`} />
                        <div>
                          <p className={`text-xl font-bold ${s.text}`}>
                            {s.count}
                          </p>
                          <p className="text-xs text-kot-text">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-kot-white rounded-2xl p-1.5 flex gap-1 w-fit shadow-kot flex-wrap">
                  {(["all", "critical", "warning", "info", "ok"] as const).map(
                    (level) => (
                      <button
                        key={level}
                        onClick={() => onFilterChange(level)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize transition-all ${
                          filterLevel === level
                            ? "bg-kot-dark text-white"
                            : "text-kot-text hover:bg-kot-light"
                        }`}
                      >
                        {level === "all" ? `All (${alerts.length})` : level}
                      </button>
                    ),
                  )}
                </div>

                {filteredAlerts.length === 0 ? (
                  <div className="bg-kot-white rounded-2xl p-12 text-center shadow-kot">
                    <p className="text-2xl mb-2">📦</p>
                    <p className="font-semibold text-kot-darker">
                      No items in this category
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAlerts.map((alert) => {
                      const cfg = LEVEL_CONFIG[alert.level];
                      const Icon = cfg.icon;
                      return (
                        <div
                          key={alert._id}
                          className={`${cfg.bg} border ${cfg.border} rounded-2xl p-4 flex items-start gap-4`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}
                          >
                            <Icon size={20} className={cfg.text} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className="font-bold text-kot-darker">
                                {alert.name}
                              </p>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${cfg.badge}`}
                              >
                                {alert.level}
                              </span>
                            </div>
                            <p className={`text-sm ${cfg.text}`}>
                              {alert.message}
                            </p>
                            <div className="flex gap-4 mt-2 flex-wrap">
                              <span className="text-xs text-kot-text">
                                Stock:{" "}
                                <span className="font-semibold text-kot-darker">
                                  {alert.currentStock}
                                  {alert.unit}
                                </span>
                              </span>
                              <span className="text-xs text-kot-text">
                                Daily usage:{" "}
                                <span className="font-semibold text-kot-darker">
                                  {alert.avgDailyUsage}
                                  {alert.unit}
                                </span>
                              </span>
                              <span className="text-xs text-kot-text">
                                Reorder at:{" "}
                                <span className="font-semibold text-kot-darker">
                                  {alert.reorderLevel}
                                  {alert.unit}
                                </span>
                              </span>
                            </div>
                          </div>
                          {alert.daysUntilStockout !== null && (
                            <div className="text-right flex-shrink-0">
                              <p className={`text-2xl font-bold ${cfg.text}`}>
                                {alert.daysUntilStockout}
                              </p>
                              <p className="text-xs text-kot-text">days left</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 3 — AI CHAT (no text input — category tabs only)
        ════════════════════════════════════════════════════ */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ── Left: Chat Window ────────────────────────── */}
            <div className="bg-kot-white rounded-2xl shadow-kot flex flex-col h-[520px]">
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-kot-chart flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-kot-dark flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-kot-darker">
                    KOT Assistant
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium">
                    ● Active
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-medium text-emerald-700">
                    Online
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "ai" ? "bg-kot-dark" : "bg-kot-stats"}`}
                    >
                      {msg.role === "ai" ? (
                        <Bot size={14} className="text-white" />
                      ) : (
                        <User size={14} className="text-kot-darker" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 max-w-[80%]">
                      <div
                        className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "ai" ? "bg-kot-light text-kot-darker rounded-tl-none" : "bg-kot-dark text-white rounded-tr-none"}`}
                      >
                        {msg.text}
                      </div>
                      <span
                        className={`text-[10px] text-kot-text ${msg.role === "user" ? "text-right" : ""}`}
                      >
                        {msg.timestamp.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {chatLoading && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-kot-dark flex items-center justify-center flex-shrink-0">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="px-3 py-2.5 rounded-2xl rounded-tl-none bg-kot-light">
                      <div className="flex gap-1 items-center h-4">
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-kot-dark animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-kot-dark animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-kot-dark animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom hint — replaces text input */}
              <div className="px-4 py-3 border-t border-kot-chart">
                <p className="text-xs text-kot-text text-center">
                  👉 Select a question from the panel to get started
                </p>
              </div>
            </div>

            {/* ── Right: Question Panel ────────────────────── */}
            <div className="bg-kot-white rounded-2xl shadow-kot flex flex-col h-[520px]">
              {/* Panel header */}
              <div className="px-4 py-3 border-b border-kot-chart">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-kot-dark" />
                  <p className="text-sm font-semibold text-kot-darker">
                    Quick Questions
                  </p>
                </div>
                <p className="text-xs text-kot-text mt-0.5">
                  Click any question to get instant AI insights
                </p>
              </div>

              {/* Category tabs */}
              <div className="flex border-b border-kot-chart">
                {CHAT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setChatCategory(cat.id)}
                    className={`flex-1 py-2.5 text-xs font-medium transition-colors flex flex-col items-center gap-0.5 ${
                      chatCategory === cat.id
                        ? "text-kot-darker border-b-2 border-kot-dark bg-kot-light"
                        : "text-kot-text hover:text-kot-darker hover:bg-kot-light/50"
                    }`}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Questions list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {CATEGORIZED_QUESTIONS[chatCategory]?.map((question) => (
                  <button
                    key={question}
                    onClick={() => onChatSend(question)}
                    disabled={chatLoading}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      chatLoading
                        ? "opacity-50 cursor-not-allowed border-kot-chart text-kot-text bg-kot-light/50"
                        : "border-kot-chart text-kot-darker bg-kot-white hover:border-kot-dark hover:bg-kot-light hover:shadow-sm active:scale-[0.98]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-kot-dark font-bold">→</span>
                      {question}
                    </span>
                  </button>
                ))}
              </div>

              {/* Panel footer */}
              <div className="px-4 py-3 border-t border-kot-chart bg-kot-light/50 rounded-b-2xl">
                <p className="text-[10px] text-kot-text text-center">
                  AI analyzes your live restaurant data in real time
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared UI components ──────────────────────────────────────
function LoadingCard({ message }: { message: string }) {
  return (
    <div className="bg-kot-white rounded-2xl p-12 flex flex-col items-center gap-3 shadow-kot">
      <div className="w-10 h-10 border-4 border-kot-dark border-t-transparent rounded-full animate-spin" />
      <p className="text-kot-text text-sm">{message}</p>
    </div>
  );
}

function ErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="bg-red-50 rounded-2xl p-6 text-center shadow-kot">
      <p className="text-red-600 font-medium">{message}</p>
      <button
        onClick={onRetry}
        className="mt-3 px-4 py-2 bg-kot-dark text-white rounded-lg text-sm hover:bg-kot-darker transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
