"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stats = [
  { label: "数据库表", value: 10, suffix: "张", icon: "🗄️" },
  { label: "SQL迁移", value: 8, suffix: "个", icon: "📦" },
  { label: "源码文件", value: 71, suffix: "个", icon: "📝" },
  { label: "自动触发器", value: 6, suffix: "个", icon: "⚡" },
];

function AnimatedNumber({
  value,
  duration = 1.5,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = value / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

export default function StatsBoard() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl border border-white/5 bg-gradient-to-br from-[#111] to-[#0a0a0a] p-10 md:p-14 overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#ff2d55]/5 rounded-full blur-[100px]" />

          <h3 className="text-2xl md:text-3xl font-bold mb-2 relative z-10">
            项目规模
          </h3>
          <p className="text-white/30 mb-10 relative z-10">
            完整的全栈移动应用，从认证到实时通讯
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="text-center"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                  <AnimatedNumber value={stat.value} />
                  <span className="text-lg font-normal text-white/30 ml-1">
                    {stat.suffix}
                  </span>
                </div>
                <div className="text-sm text-white/40 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
