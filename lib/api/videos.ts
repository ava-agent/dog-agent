import { supabase } from "@/lib/supabase";
import type { Video, Comment } from "@/types/database";

const PAGE_SIZE = 10;

export async function fetchVideoFeed(pageParam = 0) {
  const from = pageParam * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from("videos")
    .select(`
      *,
      user:profiles!user_id(id, username, avatar_url),
      pet:pets!pet_id(id, name, breed, avatar_url)
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return {
    data: (data ?? []) as Video[],
    nextCursor: data && data.length === PAGE_SIZE ? pageParam + 1 : undefined,
  };
}

export async function getVideoById(videoId: string) {
  const { data, error } = await supabase
    .from("videos")
    .select(`
      *,
      user:profiles!user_id(id, username, avatar_url),
      pet:pets!pet_id(id, name, breed, avatar_url)
    `)
    .eq("id", videoId)
    .single();
  if (error) throw error;
  return data as Video;
}

export async function getUserVideos(userId: string) {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Video[];
}

export async function toggleLike(videoId: string, userId: string, isLiked: boolean) {
  if (isLiked) {
    await supabase.from("likes").delete().eq("video_id", videoId).eq("user_id", userId);
  } else {
    await supabase.from("likes").insert({ video_id: videoId, user_id: userId });
  }
}

export async function checkIsLiked(videoId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("likes")
    .select("id")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

export async function getVideoComments(videoId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*, user:profiles!user_id(id, username, avatar_url)")
    .eq("video_id", videoId)
    .is("parent_id", null)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Comment[];
}

export async function addComment(videoId: string, userId: string, content: string) {
  const { data, error } = await supabase
    .from("comments")
    .insert({ video_id: videoId, user_id: userId, content })
    .select("*, user:profiles!user_id(id, username, avatar_url)")
    .single();
  if (error) throw error;
  return data as Comment;
}
