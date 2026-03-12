"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { demoPets, type PetProfile } from "@/lib/demo-data";

/* ════════════════════════════════════════════
   Helpers
   ════════════════════════════════════════════ */

function formatCount(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "w";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

/* ════════════════════════════════════════════
   SVG Icons — TikTok uses clean white strokes
   ════════════════════════════════════════════ */

function IconHeart({ filled, className = "" }: { filled: boolean; className?: string }) {
  if (filled) {
    return (
      <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="#ff2d55">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function IconComment({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

function IconBookmark({ filled, className = "" }: { filled: boolean; className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill={filled ? "#f5c542" : "none"} stroke={filled ? "#f5c542" : "white"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}

function IconShare({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function IconPlay({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="white" fillOpacity="0.85">
      <path d="M24 16v32l24-16z" />
    </svg>
  );
}

function IconMusic({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="white" fillOpacity="0.5">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   Heart Burst — double-tap particle effect
   ════════════════════════════════════════════ */

function HeartBurst({ x, y }: { x: number; y: number }) {
  const particles = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const dist = 50 + Math.random() * 60;
    return {
      id: i,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 30,
      s: 0.5 + Math.random() * 0.7,
      d: Math.random() * 0.08,
    };
  });

  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1.6, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <IconHeart filled className="w-16 h-16 drop-shadow-[0_0_20px_rgba(255,45,85,0.9)]" />
      </motion.div>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
          animate={{ scale: [0, p.s, 0], opacity: [0, 1, 0], x: p.dx, y: p.dy }}
          transition={{ duration: 0.7, delay: p.d, ease: "easeOut" }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <IconHeart filled className="w-6 h-6" />
        </motion.div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   Comment Bottom Sheet
   ════════════════════════════════════════════ */

const demoComments = [
  { avatar: "🐶", user: "旺旺主人", text: "太可爱了吧！想rua！", time: "2分钟前", likes: 423 },
  { avatar: "🐱", user: "猫咪控", text: "这是什么品种呀？好想养一只", time: "5分钟前", likes: 1281 },
  { avatar: "🦮", user: "遛狗达人", text: "我家毛孩子也是这样的！哈哈哈", time: "12分钟前", likes: 672 },
  { avatar: "🐾", user: "铲屎官日记", text: "每天看这些视频就很治愈～已关注", time: "30分钟前", likes: 2351 },
  { avatar: "🌸", user: "小花花", text: "好乖好可爱呜呜呜 我要抱走！", time: "1小时前", likes: 189 },
  { avatar: "⭐", user: "星星点灯", text: "已关注！求更新！坐等下一条", time: "1小时前", likes: 534 },
  { avatar: "🎀", user: "萌宠博主", text: "这个表情绝了哈哈哈 我截图了", time: "2小时前", likes: 912 },
  { avatar: "🐕", user: "汪星人联盟", text: "想带我家狗子一起玩 交个朋友", time: "3小时前", likes: 371 },
  { avatar: "🌈", user: "彩虹糖", text: "眼睛好漂亮！是天生的吗", time: "4小时前", likes: 156 },
  { avatar: "🏠", user: "萌宠之家", text: "养这种品种需要注意什么呀", time: "5小时前", likes: 89 },
];

function CommentSheet({
  isOpen,
  onClose,
  commentCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  commentCount: number;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="absolute inset-x-0 bottom-0 h-[60%] bg-[#161616] rounded-t-xl z-50 flex flex-col"
          >
            {/* drag handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-9 h-1 rounded-full bg-white/15" />
            </div>
            {/* header */}
            <div className="px-4 py-2 text-center relative">
              <span className="text-sm font-semibold text-white">
                {formatCount(commentCount)} 条评论
              </span>
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* comment list */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
              {demoComments.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm shrink-0 mt-0.5">
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-white/40">{c.user}</span>
                    <p className="text-[13px] text-white/90 leading-snug mt-0.5">
                      {c.text}
                    </p>
                    <div className="flex items-center gap-4 mt-1.5 text-[11px] text-white/25">
                      <span>{c.time}</span>
                      <button className="hover:text-white/50">回复</button>
                    </div>
                  </div>
                  <button className="flex flex-col items-center gap-0.5 pt-2 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1.5">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="text-[10px] text-white/20">{formatCount(c.likes)}</span>
                  </button>
                </motion.div>
              ))}
            </div>
            {/* input bar */}
            <div className="px-4 py-3 border-t border-white/5 flex items-center gap-3">
              <div className="flex-1 h-9 rounded-full bg-white/5 px-4 flex items-center">
                <span className="text-[13px] text-white/20">善意发言，留下你的评论</span>
              </div>
              <span className="text-lg opacity-30">@</span>
              <span className="text-lg opacity-30">😊</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════
   Share Bottom Sheet
   ════════════════════════════════════════════ */

const shareTargets = [
  { icon: "💚", label: "微信好友" },
  { icon: "🟢", label: "朋友圈" },
  { icon: "🐧", label: "QQ" },
  { icon: "🔗", label: "复制链接" },
  { icon: "💬", label: "私信" },
  { icon: "⬇️", label: "保存本地" },
  { icon: "🚫", label: "不感兴趣" },
  { icon: "⚠️", label: "举报" },
];

function ShareSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="absolute inset-x-0 bottom-0 bg-[#161616] rounded-t-xl z-50 pb-6"
          >
            <div className="flex justify-center pt-2 pb-3">
              <div className="w-9 h-1 rounded-full bg-white/15" />
            </div>
            <p className="text-center text-xs text-white/30 mb-4">分享到</p>
            {/* top row — share targets */}
            <div className="px-4 flex gap-4 overflow-x-auto pb-4 border-b border-white/5">
              {shareTargets.slice(0, 5).map((t) => (
                <button key={t.label} className="flex flex-col items-center gap-2 shrink-0 w-14">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl">
                    {t.icon}
                  </div>
                  <span className="text-[10px] text-white/40">{t.label}</span>
                </button>
              ))}
            </div>
            {/* bottom row — actions */}
            <div className="px-4 pt-4 flex gap-4 overflow-x-auto">
              {shareTargets.slice(5).map((t) => (
                <button key={t.label} className="flex flex-col items-center gap-2 shrink-0 w-14">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl">
                    {t.icon}
                  </div>
                  <span className="text-[10px] text-white/40">{t.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="mx-4 mt-5 h-11 w-[calc(100%-2rem)] rounded-lg bg-white/5 text-sm text-white/50 font-medium"
            >
              取消
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════
   Spinning Music Disc (TikTok bottom-right)
   ════════════════════════════════════════════ */

function MusicDisc({ photo, isPlaying }: { photo: string; isPlaying: boolean }) {
  return (
    <motion.div
      animate={isPlaying ? { rotate: 360 } : {}}
      transition={
        isPlaying
          ? { duration: 6, repeat: Infinity, ease: "linear" }
          : { duration: 0 }
      }
      className="w-[46px] h-[46px] rounded-full overflow-hidden relative"
      style={{
        background: "radial-gradient(circle at center, #1a1a1a 30%, #333 31%, #333 32%, #1a1a1a 33%)",
      }}
    >
      {/* album art */}
      <div className="absolute inset-[8px] rounded-full overflow-hidden border border-white/10">
        <Image src={photo} alt="" fill className="object-cover" />
      </div>
      {/* center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a]" />
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   Video Progress Bar
   ════════════════════════════════════════════ */

function ProgressBar({ isActive }: { isActive: boolean }) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive) {
      setProgress(0);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) return 0;
          return p + 0.5;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
      <motion.div
        className="h-full bg-white/70"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════
   Follow Button (red + on avatar)
   ════════════════════════════════════════════ */

function FollowBadge() {
  const [followed, setFollowed] = useState(false);

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        setFollowed(!followed);
      }}
      whileTap={{ scale: 0.85 }}
      className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-300 ${
        followed
          ? "bg-[#333] text-white/40 border border-white/10"
          : "bg-[#ff2d55] text-white shadow-[0_2px_8px_rgba(255,45,85,0.6)]"
      }`}
    >
      {followed ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )}
    </motion.button>
  );
}

/* ════════════════════════════════════════════
   Feed Card — one full-screen "video"
   ════════════════════════════════════════════ */

function FeedCard({
  pet,
  isActive,
  index,
}: {
  pet: PetProfile;
  isActive: boolean;
  index: number;
}) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [heartBursts, setHeartBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  const lastTapRef = useRef(0);
  const burstIdRef = useRef(0);
  const singleTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // TikTok behavior: single tap = pause, double tap = like
  const handleTap = useCallback(
    (e: React.MouseEvent) => {
      const now = Date.now();
      const timeSinceLastTap = now - lastTapRef.current;
      lastTapRef.current = now;

      if (timeSinceLastTap < 300) {
        // Double tap — like + heart burst
        if (singleTapTimerRef.current) {
          clearTimeout(singleTapTimerRef.current);
          singleTapTimerRef.current = null;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const bx = e.clientX - rect.left;
        const by = e.clientY - rect.top;
        const id = ++burstIdRef.current;
        setHeartBursts((prev) => [...prev, { id, x: bx, y: by }]);
        setTimeout(() => setHeartBursts((prev) => prev.filter((b) => b.id !== id)), 1000);
        if (!liked) setLiked(true);
      } else {
        // Single tap — pause/play (delayed to distinguish from double tap)
        singleTapTimerRef.current = setTimeout(() => {
          setPaused((p) => !p);
        }, 280);
      }
    },
    [liked]
  );

  // Ken Burns variants per card
  const kb = [
    { scale: [1, 1.06], x: [0, -8], y: [0, -4] },
    { scale: [1.04, 1], x: [-6, 4], y: [-2, 2] },
    { scale: [1, 1.05], x: [4, -4], y: [2, -2] },
    { scale: [1.03, 1.01], x: [-3, 6], y: [3, -1] },
    { scale: [1, 1.06], x: [2, -6], y: [-3, 4] },
  ][index % 5];

  const playing = isActive && !paused;

  return (
    <div
      className="relative w-full h-full flex-shrink-0 snap-start snap-always overflow-hidden bg-black"
      onClick={handleTap}
    >
      {/* Background image with Ken Burns */}
      <motion.div
        className="absolute inset-0"
        animate={
          playing
            ? { scale: kb.scale, x: kb.x, y: kb.y }
            : { scale: 1, x: 0, y: 0 }
        }
        transition={
          playing
            ? { duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
            : { duration: 0.4 }
        }
      >
        <Image
          src={pet.photo}
          alt={pet.name}
          fill
          className="object-cover"
          priority={index < 2}
          sizes="(max-width: 430px) 100vw, 430px"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent via-40% to-black/70 pointer-events-none" />

      {/* Pause overlay */}
      <AnimatePresence>
        {paused && isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <IconPlay />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heart burst particles */}
      {heartBursts.map((b) => (
        <HeartBurst key={b.id} x={b.x} y={b.y} />
      ))}

      {/* ──── Right sidebar actions ──── */}
      <div className="absolute right-3 bottom-36 flex flex-col items-center gap-4 z-10">
        {/* Avatar */}
        <div className="relative mb-1">
          <div className="w-12 h-12 rounded-full overflow-hidden border-[1.5px] border-white shadow-md">
            <div className="w-full h-full bg-[#333] flex items-center justify-center text-2xl">
              {pet.ownerAvatar}
            </div>
          </div>
          <FollowBadge />
        </div>

        {/* Like */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="flex flex-col items-center gap-0.5"
        >
          <motion.div
            animate={liked ? { scale: [1, 1.4, 0.9, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <IconHeart filled={liked} />
          </motion.div>
          <span className={`text-xs font-medium tabular-nums ${liked ? "text-[#ff2d55]" : "text-white/90"}`}>
            {formatCount(pet.likes + (liked ? 1 : 0))}
          </span>
        </button>

        {/* Comment */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowComments(true);
          }}
          className="flex flex-col items-center gap-0.5"
        >
          <IconComment />
          <span className="text-xs text-white/90 font-medium tabular-nums">
            {formatCount(pet.comments)}
          </span>
        </button>

        {/* Bookmark */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setBookmarked(!bookmarked);
          }}
          className="flex flex-col items-center gap-0.5"
        >
          <motion.div
            animate={bookmarked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <IconBookmark filled={bookmarked} />
          </motion.div>
          <span className={`text-xs font-medium tabular-nums ${bookmarked ? "text-[#f5c542]" : "text-white/90"}`}>
            {formatCount(pet.bookmarks)}
          </span>
        </button>

        {/* Share */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowShare(true);
          }}
          className="flex flex-col items-center gap-0.5"
        >
          <IconShare />
          <span className="text-xs text-white/90 font-medium tabular-nums">
            {formatCount(pet.shares)}
          </span>
        </button>

        {/* Music disc */}
        <div className="mt-1">
          <MusicDisc photo={pet.photo} isPlaying={playing} />
        </div>
      </div>

      {/* ──── Bottom info overlay ──── */}
      <div className="absolute left-4 right-[70px] bottom-20 z-10">
        {/* Username */}
        <p className="text-[15px] font-bold text-white mb-1.5 drop-shadow-sm">
          @{pet.owner}
        </p>
        {/* Description */}
        <p className="text-[13px] text-white/90 leading-[1.4] mb-3 drop-shadow-sm line-clamp-2">
          {pet.bio}
        </p>
        {/* Music row */}
        <div className="flex items-center gap-1.5">
          <IconMusic />
          <div className="overflow-hidden flex-1">
            <motion.p
              animate={playing ? { x: [0, -200] } : { x: 0 }}
              transition={playing ? { duration: 8, repeat: Infinity, ease: "linear" } : {}}
              className="whitespace-nowrap text-xs text-white/50"
            >
              {pet.musicName}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {pet.musicName}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Video progress bar */}
      <ProgressBar isActive={playing} />

      {/* Comment sheet */}
      <CommentSheet
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        commentCount={pet.comments}
      />

      {/* Share sheet */}
      <ShareSheet isOpen={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}

/* ════════════════════════════════════════════
   TikTok-style Publish Button
   ════════════════════════════════════════════ */

function PublishButton() {
  return (
    <div className="relative w-12 h-8 flex items-center justify-center">
      {/* Left color bar */}
      <div className="absolute left-0 w-8 h-full rounded-md bg-[#00f2ea]" />
      {/* Right color bar */}
      <div className="absolute right-0 w-8 h-full rounded-md bg-[#ff2d55]" />
      {/* Center white bar */}
      <div className="relative w-8 h-full rounded-md bg-white flex items-center justify-center z-10">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Main Page
   ════════════════════════════════════════════ */

export default function FeedDemoPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    setActiveIndex(Math.round(scrollTop / clientHeight));
  }, []);

  return (
    <div className="h-dvh w-full bg-black flex items-center justify-center overflow-hidden">
      {/* Phone frame on desktop, full-bleed on mobile */}
      <div className="relative w-full h-full max-w-[430px] md:h-[92vh] md:max-h-[920px] md:rounded-[3rem] md:border md:border-white/8 md:shadow-[0_0_100px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.03)] overflow-hidden">
        {/* Notch */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-2xl z-40 items-end justify-center pb-1.5">
          <div className="w-16 h-1 rounded-full bg-white/10" />
        </div>

        {/* ── Top navigation ── */}
        <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-12 md:pt-10 pb-2 flex items-center justify-between">
          <Link
            href="/"
            className="w-8 h-8 flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-[15px] text-white/35 font-medium">
              关注
            </button>
            <span className="text-white/15 text-xs">|</span>
            <button className="px-3 py-1 text-[15px] text-white font-semibold relative">
              推荐
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-white rounded-full" />
            </button>
          </div>
          <button className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* ── Feed scroll container ── */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          <style>{`div::-webkit-scrollbar{display:none}`}</style>
          {demoPets.map((pet, i) => (
            <div key={pet.id} className="h-full w-full">
              <FeedCard pet={pet} isActive={i === activeIndex} index={i} />
            </div>
          ))}
        </div>

        {/* ── Bottom tab bar ── */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/95 border-t border-white/5">
          <div className="flex items-end justify-around px-2 pt-2 pb-1">
            <div className="flex flex-col items-center gap-0.5 w-14">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" strokeWidth="0">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
              </svg>
              <span className="text-[10px] text-white font-medium">首页</span>
            </div>
            <Link href="/demo/matching" className="flex flex-col items-center gap-0.5 w-14">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="text-[10px] text-white/40">发现</span>
            </Link>
            <Link href="/demo/matching" className="flex items-center justify-center w-14 pb-1">
              <PublishButton />
            </Link>
            <Link href="/chat" className="flex flex-col items-center gap-0.5 w-14">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
              <span className="text-[10px] text-white/40">消息</span>
            </Link>
            <div className="flex flex-col items-center gap-0.5 w-14">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-[10px] text-white/40">我</span>
            </div>
          </div>
          {/* Home indicator */}
          <div className="flex justify-center pb-1.5">
            <div className="w-[134px] h-[5px] rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      {/* Desktop ambient background */}
      <div className="hidden md:block fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-[#ff2d55]/[0.03] blur-[150px]" />
        <div className="absolute bottom-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-[#00f2ea]/[0.03] blur-[120px]" />
      </div>
    </div>
  );
}
