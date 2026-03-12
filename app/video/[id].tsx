import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { getVideoById } from "@/lib/api/videos";
import { CommentSheet } from "@/components/feed/CommentSheet";
import { COLORS } from "@/constants/theme";

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: video } = useQuery({
    queryKey: ["video", id],
    queryFn: () => getVideoById(id!),
    enabled: !!id,
  });

  return (
    <View className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-16 pb-3 px-4 border-b border-dark-800">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">评论</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Comment Sheet */}
      {id && <CommentSheet videoId={id} />}
    </View>
  );
}
