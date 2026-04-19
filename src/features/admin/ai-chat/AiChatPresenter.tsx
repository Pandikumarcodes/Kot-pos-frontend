import { Bot, User, Send, Sparkles } from "lucide-react";
import type { AiChatPresenterProps } from "./AiChat.types";
import { QUICK_QUESTIONS } from "./AiChat.types";

export function AiChatPresenter({
  messages,
  input,
  loading,
  onInputChange,
  onSend,
  onQuickQuestion,
  messagesEndRef,
}: AiChatPresenterProps) {
  return (
    <div className="min-h-screen bg-kot-primary">
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
        {/* ── Header ────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-kot-dark flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-kot-darker">
              AI Sales Assistant
            </h1>
            <p className="text-sm text-kot-text flex items-center gap-1">
              <Sparkles size={12} className="text-kot-dark" />
              Powered by Google Gemini — asks about your real restaurant data
            </p>
          </div>
        </div>

        {/* ── Chat Window ───────────────────────────────────── */}
        <div className="bg-kot-white rounded-2xl shadow-kot flex flex-col h-[500px]">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "ai" ? "bg-kot-dark" : "bg-kot-stats"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <Bot size={16} className="text-white" />
                  ) : (
                    <User size={16} className="text-kot-darker" />
                  )}
                </div>

                {/* Bubble */}
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "ai"
                        ? "bg-kot-light text-kot-darker rounded-tl-none"
                        : "bg-kot-dark text-white rounded-tr-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {/* Timestamp */}
                  <span
                    className={`text-[10px] text-kot-text ${
                      msg.role === "user" ? "text-right" : ""
                    }`}
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
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-kot-dark flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-kot-light">
                  <div className="flex gap-1 items-center">
                    <div
                      className="w-2 h-2 rounded-full bg-kot-dark animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-kot-dark animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-kot-dark animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-kot-chart p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                placeholder="Ask about sales, orders, staff, menu..."
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-kot-chart bg-kot-white text-kot-darker text-sm focus:outline-none focus:border-kot-dark placeholder:text-kot-text/50 disabled:opacity-50"
              />
              <button
                onClick={onSend}
                disabled={loading || !input.trim()}
                className="px-4 py-3 bg-kot-dark hover:bg-kot-darker text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-kot-text mt-2 text-center">
              Press Enter to send · AI analyzes your live restaurant data
            </p>
          </div>
        </div>

        {/* ── Quick Questions ───────────────────────────────── */}
        <div className="bg-kot-white rounded-2xl p-5 shadow-kot">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-kot-dark" />
            <p className="text-sm font-semibold text-kot-darker">
              Quick Questions
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => onQuickQuestion(q)}
                disabled={loading}
                className="px-3 py-1.5 bg-kot-light hover:bg-kot-stats rounded-xl text-xs font-medium text-kot-darker border border-kot-chart transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* ── How it works ──────────────────────────────────── */}
        <div className="bg-kot-white rounded-2xl p-5 shadow-kot">
          <p className="text-sm font-semibold text-kot-darker mb-3">
            💡 What can I ask?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                emoji: "📊",
                title: "Sales & Revenue",
                examples: "Daily revenue, weekly trends, payment methods",
              },
              {
                emoji: "🍽️",
                title: "Menu Performance",
                examples: "Best sellers, slow items, category trends",
              },
              {
                emoji: "👨‍🍳",
                title: "Operations",
                examples: "Peak hours, order counts, dine-in vs takeaway",
              },
            ].map((item) => (
              <div key={item.title} className="bg-kot-light rounded-xl p-3">
                <p className="text-lg mb-1">{item.emoji}</p>
                <p className="text-sm font-semibold text-kot-darker">
                  {item.title}
                </p>
                <p className="text-xs text-kot-text mt-0.5">{item.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
