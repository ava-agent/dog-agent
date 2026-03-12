import { supabase } from "@/lib/supabase";
import type { Message, Conversation } from "@/types/database";

export async function getConversations(userId: string) {
  const { data: pets } = await supabase
    .from("pets")
    .select("id")
    .eq("owner_id", userId);

  if (!pets?.length) return [];

  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      match:matches!match_id(
        *,
        pet1:pets!pet1_id(id, name, avatar_url, owner:profiles!owner_id(id, username, avatar_url)),
        pet2:pets!pet2_id(id, name, avatar_url, owner:profiles!owner_id(id, username, avatar_url))
      )
    `)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return (data ?? []) as Conversation[];
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*, sender:profiles!sender_id(id, username, avatar_url)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Message[];
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      message_type: "text",
    })
    .select("*, sender:profiles!sender_id(id, username, avatar_url)")
    .single();
  if (error) throw error;
  return data as Message;
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .eq("is_read", false);
}
