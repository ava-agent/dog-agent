"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AIEntry() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/chat" className="group block">
            <div className="relative rounded-3xl border border-[#ff2d55]/20 bg-gradient-to-br from-[#ff2d55]/10 via-[#111] to-[#0a0a0a] p-10 md:p-14 overflow-hidden transition-all duration-500 hover:border-[#ff2d55]/40 hover:shadow-[0_0_80px_rgba(255,45,85,0.15)]">
              {/* Animated bg */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff2d55]/10 rounded-full blur-[150px] group-hover:scale-110 transition-transform duration-700" />
              </div>

              {/* Floating sparkles */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#ff2d55]/40 rounded-full"
                  style={{
                    top: `${20 + i * 20}%`,
                    left: `${15 + i * 22}%`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                {/* AI Avatar */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#ff2d55] to-[#ff6b6b] flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(255,45,85,0.3)] group-hover:shadow-[0_0_60px_rgba(255,45,85,0.5)] transition-shadow duration-500">
                    🐾
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0a0a0a] border-2 border-[#ff2d55] flex items-center justify-center text-sm">
                    🤖
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2d55]/10 border border-[#ff2d55]/20 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d55] animate-pulse" />
                    <span className="text-xs text-[#ff2d55] font-medium">
                      GLM-4 驱动
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black mb-3">
                    AI 宠物匹配师
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2d55] to-[#ff6b6b]">
                      {" "}
                      小爪
                    </span>
                  </h3>
                  <p className="text-white/40 text-lg leading-relaxed max-w-xl">
                    描述你的毛孩子，小爪会分析TA的性格特点，推荐最合拍的玩伴。
                    基于智谱 GLM 大模型，懂宠物、更懂社交。
                  </p>
                </div>

                {/* Arrow */}
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center group-hover:border-[#ff2d55]/40 group-hover:bg-[#ff2d55]/10 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-white/40 group-hover:text-[#ff2d55] transition-all duration-300 group-hover:translate-x-1"
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
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
