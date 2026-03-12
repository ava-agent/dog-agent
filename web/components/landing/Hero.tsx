"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#ff2d55]/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#ff6b6b]/15 rounded-full blur-[128px] animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff2d55]/5 rounded-full blur-[200px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Floating paw prints */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-[#ff2d55]/10 text-4xl select-none pointer-events-none"
          style={{
            top: `${15 + i * 14}%`,
            left: `${10 + (i * 17) % 80}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          🐾
        </motion.div>
      ))}

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff2d55]/30 bg-[#ff2d55]/5 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#ff2d55] animate-pulse" />
          <span className="text-sm text-[#ff2d55] tracking-wide font-medium">
            MVP 已完成 · 开放体验中
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6"
        >
          <span className="text-white">Paw</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2d55] to-[#ff6b6b]">
            Pal
          </span>
          <br />
          <span className="text-3xl md:text-5xl font-light tracking-normal text-white/60">
            宠友圈
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          让毛孩子也有朋友圈 —— 抖音风格视频流 × Tinder式宠物匹配 × AI智能推荐
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/chat"
            className="group relative px-8 py-4 bg-gradient-to-r from-[#ff2d55] to-[#ff6b6b] rounded-2xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,45,85,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              🤖 体验 AI 匹配师
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>

          <a
            href="https://github.com/ava-agent/dog-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-2xl border border-white/10 text-white/70 font-medium text-lg hover:border-white/30 hover:text-white transition-all duration-300 hover:bg-white/5"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </span>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-3 rounded-full bg-[#ff2d55]/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
