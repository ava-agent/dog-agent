import { useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage, markMessagesAsRead } from "@/lib/api/messages";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { Avatar } from "@/components/ui/Avatar";
import { COLORS } from "@/constants/theme";
import type { Message } from "@/types/database";

export default function ChatScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);

  // Get conversation for this match
  const { data: conversation } = useQuery({
    queryKey: ["conversation", matchId],
    queryFn: async () => {
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
        .eq("match_id", matchId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!matchId,
  });

  const conversationId = conversation?.id;

  const otherPet = conversation?.match
    ? (conversation.match as any).pet1?.owner?.id === user?.id
      ? (conversation.match as any).pet2
      : (conversation.match as any).pet1
    : null;

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId!),
    enabled: !!conversationId,
  });

  // Mark messages as read
  useEffect(() => {
    if (conversationId && user) {
      markMessagesAsRead(conversationId, user.id);
    }
  }, [conversationId, messages?.length]);

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

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      sendMessage(conversationId!, user!.id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark-900"
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View className="flex-row items-center pt-16 pb-3 px-4 border-b border-dark-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Avatar uri={otherPet?.avatar_url} size={36} />
        <Text className="text-white text-lg font-bold ml-3">
          {otherPet?.name ?? "宠物"}
        </Text>
      </View>

      {/* Messages */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              content={item.content}
              createdAt={item.created_at}
              isMine={item.sender_id === user?.id}
            />
          )}
          contentContainerStyle={{ paddingVertical: 16 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-gray-500">说点什么吧~</Text>
            </View>
          }
        />
      )}

      {/* Input */}
      <MessageInput
        onSend={(content) => sendMutation.mutate(content)}
        disabled={!conversationId || sendMutation.isPending}
      />
    </KeyboardAvoidingView>
  );
}
