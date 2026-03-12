import { supabase } from "@/lib/supabase";
import type { Pet } from "@/types/database";

export async function createPet(pet: {
  owner_id: string;
  name: string;
  species?: string;
  breed?: string;
  gender?: string;
  size?: string;
  birth_date?: string;
  bio?: string;
  personality?: string[];
  avatar_url?: string;
  photos?: string[];
}) {
  const { data, error } = await supabase
    .from("pets")
    .insert(pet as any)
    .select()
    .single();
  if (error) throw error;
  return data as Pet;
}

export async function updatePet(petId: string, updates: Partial<Pet>) {
  const { data, error } = await supabase
    .from("pets")
    .update({ ...updates, updated_at: new Date().toISOString() } as any)
    .eq("id", petId)
    .select()
    .single();
  if (error) throw error;
  return data as Pet;
}

export async function getUserPets(userId: string) {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Pet[];
}

export async function getPetById(petId: string) {
  const { data, error } = await supabase
    .from("pets")
    .select("*, owner:profiles!owner_id(id, username, avatar_url)")
    .eq("id", petId)
    .single();
  if (error) throw error;
  return data as Pet;
}

export async function deletePet(petId: string) {
  const { error } = await supabase.from("pets").delete().eq("id", petId);
  if (error) throw error;
}
