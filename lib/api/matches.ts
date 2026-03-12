import { supabase } from "@/lib/supabase";
import type { Match, Swipe } from "@/types/database";

export async function getMatchingCandidates(params: {
  petId: string;
  ownerId: string;
  species?: string;
  latitude?: number;
  longitude?: number;
  maxDistanceKm?: number;
  limit?: number;
}) {
  const { data, error } = await supabase.rpc("get_matching_candidates", {
    p_pet_id: params.petId,
    p_owner_id: params.ownerId,
    p_species: params.species ?? null,
    p_latitude: params.latitude ?? null,
    p_longitude: params.longitude ?? null,
    p_max_distance_km: params.maxDistanceKm ?? 50,
    p_limit: params.limit ?? 20,
  });
  if (error) throw error;
  return data ?? [];
}

export async function createSwipe(
  swiperPetId: string,
  swipedPetId: string,
  direction: "left" | "right" | "super"
) {
  const { data, error } = await supabase
    .from("swipes")
    .insert({ swiper_pet_id: swiperPetId, swiped_pet_id: swipedPetId, direction })
    .select()
    .single();
  if (error) throw error;

  // Check if match was created
  let match = null;
  if (direction === "right" || direction === "super") {
    const [id1, id2] = [swiperPetId, swipedPetId].sort();
    const { data: matchData } = await supabase
      .from("matches")
      .select("*")
      .eq("pet1_id", id1)
      .eq("pet2_id", id2)
      .eq("status", "matched")
      .maybeSingle();
    match = matchData;
  }

  return { swipe: data as Swipe, match: match as Match | null };
}

export async function getUserMatches(userId: string) {
  const { data: pets } = await supabase
    .from("pets")
    .select("id")
    .eq("owner_id", userId);

  if (!pets?.length) return [];
  const petIds = pets.map((p) => p.id);

  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      pet1:pets!pet1_id(*, owner:profiles!owner_id(id, username, avatar_url)),
      pet2:pets!pet2_id(*, owner:profiles!owner_id(id, username, avatar_url))
    `)
    .eq("status", "matched")
    .or(petIds.map((id) => `pet1_id.eq.${id},pet2_id.eq.${id}`).join(","))
    .order("matched_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Match[];
}
