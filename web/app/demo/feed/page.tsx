"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { demoPets } from "@/lib/demo-data";

function formatNumber(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + "w";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

function FeedCard({
  pet,
  isActive,
}: {
  pet: (typeof demoPets)[0];
  isActive: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const lastTapRef = useRef(0);

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setLiked(true);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    lastTapRef.current = now;
  }, []);

  return (
    <div
      className="relative w-full h-full flex-shrink-0 snap-start snap-always"
      onClick={handleDoubleTap}
    >
      {/* Background image */}
      <Image
        src={pet.photo}
        alt={pet.name}
        fill
        className="object-cover"
        priority={isActive}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

      {/* Double-tap heart animation */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <span className="text-8xl drop-shadow-2xl">❤️</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right side actions */}
      <div className="absolute right-4 bottom-44 flex flex-col items-center gap-6 z-10">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-2xl">
            {pet.ownerAvatar}
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#ff2d55] flex items-center justify-center text-[10px] text-white font-bold">
            +
          </div>
        </div>

        {/* Like */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="flex flex-col items-center gap-1"
        >
          <motion.div
            animate={liked ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <span className="text-3xl">{liked ? "❤️" : "🤍"}</span>
          </motion.div>
          <span className="text-xs text-white/80 font-medium">
            {formatNumber(pet.likes + (liked ? 1 : 0))}
          </span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1">
          <span className="text-3xl">💬</span>
          <span className="text-xs text-white/80 font-medium">
            {formatNumber(pet.comments)}
          </span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1">
          <span className="text-3xl">↗️</span>
          <span className="text-xs text-white/80 font-medium">分享</span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute left-4 right-20 bottom-24 z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white font-bold text-base">@{pet.owner}</span>
          <span className="text-white/50 text-sm">· {pet.distance}</span>
        </div>
        <p className="text-white/90 text-sm leading-relaxed mb-3">{pet.bio}</p>
        <div className="flex gap-2 flex-wrap">
          {pet.personality.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-xs text-white/70 border border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>
        {/* Marquee pet info */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm">🎵</span>
          <div className="overflow-hidden flex-1">
            <motion.div
              animate={{ x: [0, -200] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="whitespace-nowrap text-xs text-white/50"
            >
              {pet.name} · {pet.breed} · {pet.age} ·{" "}
              {pet.gender === "male" ? "♂" : "♀"} &nbsp;&nbsp;&nbsp;&nbsp;
              {pet.name} · {pet.breed} · {pet.age} ·{" "}
              {pet.gender === "male" ? "♂" : "♀"}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Swipe hint */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, delay: 1 }}
          className="absolute inset-x-0 bottom-8 text-center text-white/40 text-xs z-10 pointer-events-none"
        >
          ↑ 上滑查看更多
        </motion.div>
      )}
    </div>
  );
}

export default function FeedDemoPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const index = Math.round(scrollTop / height);
    setActiveIndex(index);
  };

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-4 pb-2 flex items-center justify-between">
        <Link
          href="/"
          className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10"
        >
          <svg
            className="w-4 h-4 text-white"
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
        <div className="flex gap-4 text-sm font-medium">
          <span className="text-white/40">关注</span>
          <span className="text-white border-b-2 border-[#ff2d55] pb-1">
            推荐
          </span>
        </div>
        <div className="w-9" />
      </div>

      {/* Feed container - snap scroll */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {demoPets.map((pet, index) => (
          <div key={pet.id} className="h-full w-full">
            <FeedCard pet={pet} isActive={index === activeIndex} />
          </div>
        ))}
      </div>

      {/* Bottom tab bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 to-transparent pt-6 pb-4">
        <div className="flex items-center justify-around px-4">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg">🏠</span>
            <span className="text-[10px] text-[#ff2d55] font-medium">
              首页
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg">🔍</span>
            <span className="text-[10px] text-white/40">发现</span>
          </div>
          <Link
            href="/demo/matching"
            className="flex flex-col items-center gap-0.5"
          >
            <div className="w-10 h-7 rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff6b6b] flex items-center justify-center">
              <span className="text-white text-lg font-bold">+</span>
            </div>
          </Link>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg">💬</span>
            <span className="text-[10px] text-white/40">消息</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg">👤</span>
            <span className="text-[10px] text-white/40">我</span>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1">
        {demoPets.map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "h-4 bg-[#ff2d55]"
                : "h-1 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
