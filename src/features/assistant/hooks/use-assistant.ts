"use client";

import { useCallback, useState } from "react";
import { askComsAi } from "../services/assistant.service";
import type { ChatMessage } from "../types";

export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setSending(true);

    try {
      const reply = await askComsAi(text);
      setMessages((prev) => [...prev, reply]);
    } finally {
      setSending(false);
    }
  }, []);

  return { messages, sending, sendMessage };
}
