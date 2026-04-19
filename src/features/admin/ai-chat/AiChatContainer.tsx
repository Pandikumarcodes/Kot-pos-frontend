import { useState, useRef, useCallback } from "react";
import api from "../../../services/apiClient";
import { getSummaryApi } from "../../../services/adminApi/Reports.api";
import { AiChatPresenter } from "./AiChatPresenter";
import type { Message } from "./AiChat.types";

export default function AiChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Hi! I am your KOT POS AI assistant. Ask me anything about your sales, orders, staff or menu performance. I will analyze your data and give you clear insights.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const addMessage = useCallback((role: "user" | "ai", text: string) => {
    const msg: Message = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleSend = useCallback(
    async (messageText: string) => {
      const trimmed = messageText.trim();
      if (!trimmed || loading) return;

      addMessage("user", trimmed);
      setInput("");
      setLoading(true);

      try {
        let context = {};
        try {
          const now = new Date();
          const from = new Date(now);
          from.setDate(from.getDate() - 7);
          const summaryRes = await getSummaryApi(
            "custom",
            from.toISOString().split("T")[0],
            now.toISOString().split("T")[0],
          );
          context = summaryRes.data;
        } catch {
          // Context fetch failed — AI will answer without data
        }

        const { data } = await api.post("/ai/chat", {
          message: trimmed,
          context,
        });

        addMessage("ai", data.reply);
      } catch (err) {
        const e = err as { response?: { data?: { error?: string } } };
        addMessage(
          "ai",
          e?.response?.data?.error ??
            "Sorry, I could not process that request. Please try again.",
        );
      } finally {
        setLoading(false);
        // Fix 2: single scroll call after everything is settled
        scrollToBottom();
      }
    },
    [loading, addMessage, scrollToBottom],
  );

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  return (
    <AiChatPresenter
      messages={messages}
      input={input}
      loading={loading}
      onInputChange={handleInputChange}
      onSend={() => handleSend(input)}
      onQuickQuestion={handleSend}
      messagesEndRef={messagesEndRef}
    />
  );
}
