"use client";

import { motion } from "framer-motion";

const techLayers = [
  {
    label: "Frontend",
    items: [
      { name: "React Native", desc: "跨平台" },
      { name: "Expo SDK 54", desc: "开发工具" },
      { name: "Expo Router", desc: "文件路由" },
      { name: "NativeWind", desc: "TailwindCSS" },
    ],
  },
  {
    label: "State",
    items: [
      { name: "Zustand", desc: "客户端状态" },
      { name: "TanStack Query", desc: "服务端状态" },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "Supabase Auth", desc: "认证" },
      { name: "PostgreSQL", desc: "数据库" },
      { name: "Realtime", desc: "实时通讯" },
      { name: "PostGIS", desc: "地理位置" },
      { name: "Storage", desc: "文件存储" },
    ],
  },
  {
    label: "AI",
    items: [{ name: "GLM-4", desc: "智谱大模型" }],
  },
];

export default function TechStack() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            技术
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2d55] to-[#ff6b6b]">
              架构
            </span>
          </h2>
          <p className="text-white/40 text-lg">
            现代化全栈技术，从前端到 AI
          </p>
        </motion.div>

        <div className="space-y-4">
          {techLayers.map((layer, layerIndex) => (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: layerIndex * 0.1 }}
              className="flex flex-col md:flex-row items-stretch gap-4"
            >
              {/* Label */}
              <div className="md:w-28 shrink-0 flex items-center">
                <span className="text-xs font-mono text-[#ff2d55]/60 tracking-widest uppercase">
                  {layer.label}
                </span>
              </div>

              {/* Items */}
              <div className="flex-1 flex flex-wrap gap-3">
                {layer.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: layerIndex * 0.1 + itemIndex * 0.05,
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-5 py-3 rounded-2xl border border-white/5 bg-[#111]/80 hover:border-[#ff2d55]/20 transition-colors duration-300 cursor-default"
                  >
                    <div className="text-sm font-semibold text-white/80">
                      {item.name}
                    </div>
                    <div className="text-xs text-white/30 mt-0.5">
                      {item.desc}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
