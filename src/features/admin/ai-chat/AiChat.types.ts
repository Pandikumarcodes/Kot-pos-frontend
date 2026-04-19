import React from "react";

export interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface AiChatPresenterProps {
  messages: Message[];
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onQuickQuestion: (question: string) => void;
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
