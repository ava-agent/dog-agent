import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVideoComments, addComment } from "@/lib/api/videos";
import { useAuthStore } from "@/stores/authStore";
import { COLORS } from "@/constants/theme";
import { timeAgo } from "@/lib/utils/formatDate";

interface CommentSheetProps {
  videoId: string;
}

export function CommentSheet({ videoId }: CommentSheetProps) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => getVideoComments(videoId),
  });

  const addCommentMutation = useMutation({
    mutationFn: () => addComment(videoId, user!.id, commentText.trim()),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });

  const handleSend = () => {
    if (commentText.trim() && user) {
      addCommentMutation.mutate();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-dark-900"
    >
      {/* Header */}
      <View className="items-center py-3 border-b border-dark-700">
        <Text className="text-white font-bold text-base">
          {comments?.length ?? 0} 条评论
        </Text>
      </View>

      {/* Comments List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          className="flex-1 px-4"
          renderItem={({ item }) => (
            <View className="flex-row py-3">
              <View className="w-9 h-9 rounded-full bg-dark-700 overflow-hidden mr-3">
                {item.user?.avatar_url ? (
                  <Image source={{ uri: item.user.avatar_url }} style={{ width: "100%", height: "100%" }} />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="person" size={14} color={COLORS.textMuted} />
                  </View>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs mb-1">
                  {item.user?.username ?? "用户"} · {timeAgo(item.created_at)}
                </Text>
                <Text className="text-white text-sm">{item.content}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center py-10">
              <Text className="text-gray-500">还没有评论，快来说几句吧~</Text>
            </View>
          }
        />
      )}

      {/* Input */}
      <View className="flex-row items-center px-4 py-3 border-t border-dark-700">
        <TextInput
          className="flex-1 bg-dark-800 text-white rounded-full px-4 h-10 text-sm"
          placeholder="写评论..."
          placeholderTextColor={COLORS.textMuted}
          value={commentText}
          onChangeText={setCommentText}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          className="ml-3"
          onPress={handleSend}
          disabled={!commentText.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={commentText.trim() ? COLORS.primary : COLORS.textMuted}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
