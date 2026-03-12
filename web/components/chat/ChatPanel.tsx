"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("API error");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              assistantContent += delta;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            } catch {
              // Skip non-JSON lines
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，我暂时无法回应。请检查 GLM API Key 是否已配置。",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#ff2d55] to-[#ff6b6b] flex items-center justify-center text-4xl mb-6 shadow-[0_0_40px_rgba(255,45,85,0.3)]"
            >
              🐾
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold mb-2"
            >
              嗨！我是小爪 🐾
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/40 max-w-sm mb-8"
            >
              你的 AI 宠物匹配师，告诉我你家毛孩子的品种和性格，我来推荐最合拍的玩伴！
            </motion.p>

            {/* Quick prompts */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 justify-center max-w-md"
            >
              {[
                "我家有只3岁金毛，很活泼",
                "我的猫很内向，适合什么朋友？",
                "小型犬适合交什么朋友？",
                "两只猫能一起养吗？",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                    inputRef.current?.focus();
                  }}
                  className="px-4 py-2 rounded-xl border border-white/10 text-sm text-white/50 hover:border-[#ff2d55]/30 hover:text-[#ff2d55] transition-all duration-200 hover:bg-[#ff2d55]/5"
                >
                  {prompt}
                </button>
              ))}
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} index={index} />
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff2d55] to-[#ff6b6b] flex items-center justify-center text-sm">
              🐾
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#ff2d55]/40"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-white/5 px-4 md:px-6 py-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="描述你的宠物，或问我任何宠物社交问题..."
            rows={1}
            className="flex-1 bg-[#111] border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-[#ff2d55]/40 focus:ring-1 focus:ring-[#ff2d55]/20 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-r from-[#ff2d55] to-[#ff6b6b] flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(255,45,85,0.3)] transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19V5m0 0l-7 7m7-7l7 7"
              />
            </svg>
          </button>
        </form>
        <p className="text-xs text-white/20 mt-2 text-center">
          由智谱 GLM-4 驱动 · 回复仅供参考
        </p>
      </div>
    </div>
  );
}
