import { useState, useCallback, useRef } from "react";
import api from "../../../services/apiClient";
import { AiInsightsPresenter } from "./AiInsightspresenter";
import type {
  InventoryAlert,
  AlertCounts,
  SummaryData,
  ActiveTab,
  AlertFilterLevel,
  Message,
} from "./AiInsights.types";

export default function AiInsightsContainer() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");

  // ── Daily summary state ───────────────────────────────────
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // ── Inventory alerts state ────────────────────────────────
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [counts, setCounts] = useState<AlertCounts | null>(null);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<AlertFilterLevel>("all");

  // ── Track which tabs have already been fetched ────────────

  const fetchedTabs = useRef<Set<ActiveTab>>(new Set());

  // ── Chat state ────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Hi! I'm your KOT POS AI assistant. Ask me anything about your sales, orders, staff or menu performance.",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ── Fetch daily summary ───────────────────────────────────
  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      setSummaryError(null);
      const { data } = await api.get("/ai/daily-summary");
      setSummaryData(data.data);
      setAiSummary(data.aiSummary);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setSummaryError(e?.response?.data?.error ?? "Failed to load summary");
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // ── Fetch inventory alerts ────────────────────────────────
  const fetchAlerts = useCallback(async () => {
    try {
      setAlertsLoading(true);
      setAlertsError(null);
      const { data } = await api.get("/ai/inventory-alerts");
      setAlerts(data.alerts);
      setCounts(data.counts);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setAlertsError(e?.response?.data?.error ?? "Failed to load alerts");
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  // ── Tab change — fetch only on first visit, not every switch
  const handleTabChange = useCallback(
    (tab: ActiveTab) => {
      setActiveTab(tab);

      // Chat tab needs no fetch
      if (tab === "chat") return;

      // Already fetched this tab — don't call Gemini again
      if (fetchedTabs.current.has(tab)) return;

      fetchedTabs.current.add(tab);

      if (tab === "summary") fetchSummary();
      else if (tab === "inventory") fetchAlerts();
    },
    [fetchSummary, fetchAlerts],
  );

  // ── Refresh — force re-fetch current tab only ─────────────
  const handleRefresh = useCallback(() => {
    if (activeTab === "summary") {
      fetchedTabs.current.delete("summary");
      fetchedTabs.current.add("summary");
      fetchSummary();
    } else if (activeTab === "inventory") {
      fetchedTabs.current.delete("inventory");
      fetchedTabs.current.add("inventory");
      fetchAlerts();
    }
  }, [activeTab, fetchSummary, fetchAlerts]);

  // ── Chat send ─────────────────────────────────────────────
  const handleChatSend = useCallback(
    async (messageText: string) => {
      const trimmed = messageText.trim();
      if (!trimmed || chatLoading) return;

      const userMsg: Message = {
        id: `${Date.now()}-u`,
        role: "user",
        text: trimmed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setChatInput("");
      setChatLoading(true);

      try {
        // Use already-loaded summaryData from state — no extra API call
        const context = summaryData ?? {};

        const { data } = await api.post("/ai/chat", {
          message: trimmed,
          context,
        });

        const aiMsg: Message = {
          id: `${Date.now()}-ai`,
          role: "ai",
          text: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        const e = err as { response?: { data?: { error?: string } } };
        const errMsg: Message = {
          id: `${Date.now()}-err`,
          role: "ai",
          text:
            e?.response?.data?.error ??
            "Sorry, I could not process that. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setChatLoading(false);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    },
    [chatLoading, summaryData],
  );

  return (
    <AiInsightsPresenter
      activeTab={activeTab}
      onTabChange={handleTabChange}
      summaryData={summaryData}
      aiSummary={aiSummary}
      summaryLoading={summaryLoading}
      summaryError={summaryError}
      onRetrySummary={fetchSummary}
      alerts={alerts}
      counts={counts}
      alertsLoading={alertsLoading}
      alertsError={alertsError}
      filterLevel={filterLevel}
      onFilterChange={setFilterLevel}
      onRetryAlerts={fetchAlerts}
      onRefresh={handleRefresh}
      messages={messages}
      chatInput={chatInput}
      chatLoading={chatLoading}
      onChatInputChange={setChatInput}
      onChatSend={handleChatSend}
      messagesEndRef={messagesEndRef}
    />
  );
}
