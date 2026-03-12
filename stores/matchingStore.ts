import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MatchingState {
  activePetId: string | null;
  speciesFilter: string | null;
  maxDistanceKm: number;
  setActivePet: (petId: string) => void;
  setSpeciesFilter: (species: string | null) => void;
  setMaxDistance: (km: number) => void;
}

export const useMatchingStore = create<MatchingState>()(
  persist(
    (set) => ({
      activePetId: null,
      speciesFilter: null,
      maxDistanceKm: 50,
      setActivePet: (petId) => set({ activePetId: petId }),
      setSpeciesFilter: (species) => set({ speciesFilter: species }),
      setMaxDistance: (km) => set({ maxDistanceKm: km }),
    }),
    {
      name: "matching-preferences",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
