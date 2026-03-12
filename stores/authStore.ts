import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile, Pet } from "@/types/database";

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  pets: Pet[];
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setPets: (pets: Pet[]) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  user: null,
  profile: null,
  pets: [],
  setSession: (session) =>
    set({ session, user: session?.user ?? null }),
  setProfile: (profile) => set({ profile }),
  setPets: (pets) => set({ pets }),
  clear: () => set({ session: null, user: null, profile: null, pets: [] }),
}));
