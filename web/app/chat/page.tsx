"use client";

import Link from "next/link";
import ChatPanel from "@/components/chat/ChatPanel";

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <header className="shrink-0 border-b border-white/5 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors"
          >
            <svg
              className="w-4 h-4 text-white/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff2d55] to-[#ff6b6b] flex items-center justify-center text-sm">
              🐾
            </div>
            <div>
              <h1 className="text-sm font-semibold">AI 宠物匹配师 · 小爪</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/30">GLM-4 在线</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/20 hidden md:block">
            智谱 GLM-4 驱动
          </span>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden">
        <ChatPanel />
      </div>
    </div>
  );
}
