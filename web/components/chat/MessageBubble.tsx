"use client";

import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: { role: "user" | "assistant"; content: string };
  index: number;
}

export default function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm ${
          isUser
            ? "bg-[#1a1a2e] border border-white/10"
            : "bg-gradient-to-br from-[#ff2d55] to-[#ff6b6b]"
        }`}
      >
        {isUser ? "👤" : "🐾"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-gradient-to-r from-[#ff2d55] to-[#ff6b6b] text-white rounded-tr-sm"
            : "bg-[#111] border border-white/5 text-white/80 rounded-tl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}
