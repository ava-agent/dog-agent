"use client";

import { useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { demoPets, type PetProfile } from "@/lib/demo-data";

function SwipeCard({
  pet,
  onSwipe,
  isTop,
}: {
  pet: PetProfile;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const threshold = 100;
      if (info.offset.x > threshold || info.velocity.x > 500) {
        onSwipe("right");
      } else if (info.offset.x < -threshold || info.velocity.x < -500) {
        onSwipe("left");
      }
    },
    [onSwipe]
  );

  if (!isTop) {
    return (
      <div className="absolute inset-4 rounded-3xl overflow-hidden border border-white/5">
        <Image
          src={pet.photo}
          alt={pet.name}
          fill
          className="object-cover scale-[1.02]"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-4 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing touch-none border border-white/10 shadow-2xl"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      exit={{ x: 500, opacity: 0, transition: { duration: 0.3 } }}
    >
      {/* Photo */}
      <Image
        src={pet.photo}
        alt={pet.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* LIKE / NOPE stamps */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-8 z-20 px-6 py-2 border-4 border-green-400 rounded-xl rotate-[-20deg]"
      >
        <span className="text-green-400 text-3xl font-black tracking-wider">
          LIKE
        </span>
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 right-8 z-20 px-6 py-2 border-4 border-red-400 rounded-xl rotate-[20deg]"
      >
        <span className="text-red-400 text-3xl font-black tracking-wider">
          NOPE
        </span>
      </motion.div>

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-3xl font-black text-white">
              {pet.name}
              <span className="text-xl ml-2 font-normal text-white/60">
                {pet.age}
              </span>
            </h2>
            <p className="text-white/60 text-sm mt-1 flex items-center gap-1">
              <span>📍</span> {pet.distance} ·{" "}
              {pet.gender === "male" ? "♂" : "♀"} · {pet.breed}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-lg border border-white/20">
            ℹ️
          </div>
        </div>

        {/* Personality tags */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {pet.personality.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs text-white/80 border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-white/50 text-sm leading-relaxed">{pet.bio}</p>
      </div>
    </motion.div>
  );
}

function MatchModal({ pet, onClose }: { pet: PetProfile; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-[#111] rounded-3xl p-8 max-w-sm mx-4 text-center border border-[#ff2d55]/20"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h3 className="text-2xl font-black text-white mb-2">配对成功！</h3>
        <p className="text-white/40 mb-6">
          你和 <span className="text-[#ff2d55] font-bold">{pet.name}</span>{" "}
          互相喜欢！
        </p>
        <div className="w-20 h-20 rounded-full mx-auto mb-6 overflow-hidden border-2 border-[#ff2d55] relative">
          <Image src={pet.photo} alt={pet.name} fill className="object-cover" />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-white/10 text-white/60 font-medium hover:bg-white/5 transition-colors"
          >
            继续匹配
          </button>
          <Link
            href="/chat"
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#ff2d55] to-[#ff6b6b] text-white font-medium hover:shadow-[0_0_30px_rgba(255,45,85,0.3)] transition-shadow"
          >
            发消息
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MatchingDemoPage() {
  const [cards, setCards] = useState([...demoPets]);
  const [matchedPet, setMatchedPet] = useState<PetProfile | null>(null);
  const [swipeCount, setSwipeCount] = useState({ left: 0, right: 0 });

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      const swiped = cards[0];
      setSwipeCount((prev) => ({
        ...prev,
        [direction]: prev[direction] + 1,
      }));

      // 30% chance of match on right swipe
      if (direction === "right" && Math.random() < 0.3) {
        setTimeout(() => setMatchedPet(swiped), 400);
      }

      setCards((prev) => {
        const remaining = prev.slice(1);
        // Loop cards when exhausted
        if (remaining.length === 0) return [...demoPets];
        return remaining;
      });
    },
    [cards]
  );

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-2 flex items-center justify-between">
        <Link
          href="/"
          className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center"
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
        <div className="text-center">
          <h1 className="text-lg font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2d55] to-[#ff6b6b]">
              宠物匹配
            </span>
          </h1>
          <p className="text-[10px] text-white/30">附近 5km</p>
        </div>
        <div className="flex gap-3 text-xs text-white/30">
          <span>👈 {swipeCount.left}</span>
          <span className="text-[#ff2d55]">❤️ {swipeCount.right}</span>
        </div>
      </div>

      {/* Cards area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence>
          {cards.slice(0, 2).map((pet, index) => (
            <SwipeCard
              key={pet.id + "-" + (cards.length + index)}
              pet={pet}
              onSwipe={handleSwipe}
              isTop={index === 0}
            />
          ))}
        </AnimatePresence>

        {cards.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/30">加载更多...</p>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="shrink-0 pb-8 pt-4 flex items-center justify-center gap-6">
        <button
          onClick={() => handleSwipe("left")}
          className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center text-2xl hover:border-red-400/40 hover:bg-red-400/5 transition-all active:scale-90"
        >
          ✕
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-[#ff2d55] to-[#ff6b6b] flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(255,45,85,0.3)] hover:shadow-[0_0_50px_rgba(255,45,85,0.5)] transition-all active:scale-90"
        >
          ❤️
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center text-2xl hover:border-yellow-400/40 hover:bg-yellow-400/5 transition-all active:scale-90"
        >
          ⭐
        </button>
      </div>

      {/* Hint */}
      <p className="text-center text-xs text-white/20 pb-4">
        拖拽卡片左右滑动，或点击下方按钮
      </p>

      {/* Match modal */}
      <AnimatePresence>
        {matchedPet && (
          <MatchModal
            pet={matchedPet}
            onClose={() => setMatchedPet(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
