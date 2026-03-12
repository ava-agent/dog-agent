import { create } from "zustand";

interface FeedState {
  activeVideoIndex: number;
  isMuted: boolean;
  setActiveVideoIndex: (index: number) => void;
  toggleMute: () => void;
}

export const useFeedStore = create<FeedState>()((set) => ({
  activeVideoIndex: 0,
  isMuted: false,
  setActiveVideoIndex: (index) => set({ activeVideoIndex: index }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
}));
