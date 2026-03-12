import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "@/lib/api/messages";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import type { Message } from "@/types/database";

export function useMessages(conversationId: string | undefined) {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const query = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId!),
    enabled: !!conversationId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          queryClient.setQueryData(
            ["messages", conversationId],
            (old: Message[] | undefined) => [...(old ?? []), payload.new as Message]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const send = useMutation({
    mutationFn: (content: string) =>
      sendMessage(conversationId!, user!.id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  return { ...query, sendMessage: send };
}
