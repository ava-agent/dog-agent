"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: "📹",
    title: "抖音式视频流",
    description: "全屏上下滑动，沉浸式宠物视频体验。双击点赞，评论互动",
    gradient: "from-[#ff2d55] to-[#ff6b6b]",
    href: "/demo/feed",
    mockup: (
      <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a] rounded-2xl p-3 flex flex-col">
        <div className="flex-1 rounded-xl bg-gradient-to-br from-[#ff2d55]/20 to-transparent flex items-center justify-center">
          <span className="text-5xl">🐕</span>
        </div>
        <div className="flex items-center gap-3 mt-3 px-1">
          <div className="w-8 h-8 rounded-full bg-[#ff2d55]/30" />
          <div className="flex-1">
            <div className="h-2 w-20 bg-white/20 rounded" />
            <div className="h-1.5 w-14 bg-white/10 rounded mt-1" />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs">❤️</span>
            <span className="text-xs">💬</span>
            <span className="text-xs">↗️</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: "💕",
    title: "Tinder式匹配",
    description: "左滑跳过，右滑喜欢。基于位置的智能匹配，互相喜欢自动配对",
    gradient: "from-[#ff6b6b] to-[#ffa07a]",
    href: "/demo/matching",
    mockup: (
      <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a] rounded-2xl p-3 flex items-center justify-center">
        <div className="relative">
          {[2, 1, 0].map((i) => (
            <div
              key={i}
              className="w-40 h-52 rounded-2xl border border-white/10 bg-[#111] absolute top-1/2 left-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${(i - 1) * 5}deg) scale(${1 - i * 0.05})`,
                zIndex: 3 - i,
                opacity: 1 - i * 0.2,
              }}
            >
              {i === 0 && (
                <div className="p-3 h-full flex flex-col">
                  <div className="flex-1 rounded-xl bg-gradient-to-br from-[#ff6b6b]/20 to-transparent flex items-center justify-center">
                    <span className="text-4xl">🐱</span>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="h-2 w-16 bg-white/20 rounded mx-auto" />
                    <div className="h-1.5 w-10 bg-white/10 rounded mx-auto mt-1" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: "💬",
    title: "实时聊天",
    description: "匹配成功即刻开聊。Supabase Realtime 驱动的即时通讯",
    gradient: "from-[#7c3aed] to-[#ff2d55]",
    href: "/chat",
    mockup: (
      <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a] rounded-2xl p-3 flex flex-col justify-end gap-2">
        <div className="flex gap-2 items-end">
          <div className="w-6 h-6 rounded-full bg-[#ff2d55]/30 shrink-0" />
          <div className="bg-[#1a1a2e] rounded-2xl rounded-bl-sm px-3 py-2 max-w-[70%]">
            <div className="h-1.5 w-24 bg-white/20 rounded" />
            <div className="h-1.5 w-16 bg-white/10 rounded mt-1" />
          </div>
        </div>
        <div className="flex gap-2 items-end justify-end">
          <div className="bg-gradient-to-r from-[#ff2d55] to-[#ff6b6b] rounded-2xl rounded-br-sm px-3 py-2 max-w-[70%]">
            <div className="h-1.5 w-20 bg-white/30 rounded" />
          </div>
        </div>
        <div className="flex gap-2 items-end">
          <div className="w-6 h-6 rounded-full bg-[#ff2d55]/30 shrink-0" />
          <div className="bg-[#1a1a2e] rounded-2xl rounded-bl-sm px-3 py-2 max-w-[70%]">
            <div className="h-1.5 w-32 bg-white/20 rounded" />
          </div>
        </div>
        <div className="flex gap-2 mt-1">
          <div className="flex-1 h-8 rounded-full bg-[#1a1a2e] border border-white/5" />
          <div className="w-8 h-8 rounded-full bg-[#ff2d55]/30 flex items-center justify-center text-xs">
            ↑
          </div>
        </div>
      </div>
    ),
  },
];

export default function FeatureShowcase() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            三大核心
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2d55] to-[#ff6b6b]">
              体验
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-lg mx-auto">
            从发现到匹配，从互动到交友，一站式宠物社交
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className="group"
            >
              <Link href={feature.href}>
                <div className="relative rounded-3xl border border-white/5 bg-[#111]/80 backdrop-blur-sm p-6 h-full transition-all duration-500 hover:border-[#ff2d55]/20 hover:shadow-[0_0_60px_rgba(255,45,85,0.08)]">
                  {/* Phone mockup */}
                  <div className="w-full aspect-[9/14] mb-6 rounded-2xl border border-white/5 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                    {feature.mockup}
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <h3
                      className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}`}
                    >
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Try it CTA */}
                  <div className="mt-4 flex items-center gap-2 text-[#ff2d55] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>立即体验</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
