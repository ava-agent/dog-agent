import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { getConversations } from "@/lib/api/messages";
import { getUserMatches } from "@/lib/api/matches";
import { useAuthStore } from "@/stores/authStore";
import { COLORS } from "@/constants/theme";
import { timeAgo } from "@/lib/utils/formatDate";

export default function MessagesScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: () => getConversations(user!.id),
    enabled: !!user,
  });

  const { data: matches } = useQuery({
    queryKey: ["matches", user?.id],
    queryFn: () => getUserMatches(user!.id),
    enabled: !!user,
  });

  // New matches without messages
  const newMatches = (matches ?? []).filter(
    (m) => !(conversations ?? []).some(
      (c) => c.match_id === m.id && c.last_message_content
    )
  );

  const getOtherPet = (conversation: any) => {
    const match = conversation.match;
    if (!match) return null;
    const pet1Owner = match.pet1?.owner?.id;
    return pet1Owner === user?.id ? match.pet2 : match.pet1;
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-dark-900 items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="pt-16 pb-3 px-4">
        <Text className="text-white text-2xl font-bold">消息</Text>
      </View>

      {/* New Matches */}
      {newMatches.length > 0 && (
        <View className="mb-4">
          <Text className="text-gray-400 text-sm px-4 mb-3">新匹配</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={newMatches}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            renderItem={({ item }) => {
              const otherPet = item.pet1?.owner?.id === user?.id ? item.pet2 : item.pet1;
              return (
                <TouchableOpacity
                  className="items-center"
                  onPress={() => router.push(`/chat/${item.id}`)}
                >
                  <View className="w-16 h-16 rounded-full bg-dark-700 overflow-hidden border-2 border-primary">
                    {otherPet?.avatar_url ? (
                      <Image
                        source={{ uri: otherPet.avatar_url }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <View className="flex-1 items-center justify-center">
                        <Ionicons name="paw" size={24} color={COLORS.textMuted} />
                      </View>
                    )}
                  </View>
                  <Text className="text-white text-xs mt-1" numberOfLines={1}>
                    {otherPet?.name ?? "宠物"}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {/* Conversations */}
      <FlatList
        data={conversations ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const otherPet = getOtherPet(item);
          return (
            <TouchableOpacity
              className="flex-row items-center px-4 py-3"
              onPress={() => router.push(`/chat/${item.match_id}`)}
              activeOpacity={0.7}
            >
              <View className="w-14 h-14 rounded-full bg-dark-700 overflow-hidden mr-3">
                {otherPet?.avatar_url ? (
                  <Image
                    source={{ uri: otherPet.avatar_url }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="paw" size={20} color={COLORS.textMuted} />
                  </View>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-white text-base font-medium">
                  {otherPet?.name ?? "宠物"}
                </Text>
                <Text className="text-gray-400 text-sm mt-0.5" numberOfLines={1}>
                  {item.last_message_content ?? "开始聊天吧~"}
                </Text>
              </View>
              {item.last_message_at && (
                <Text className="text-gray-500 text-xs">
                  {timeAgo(item.last_message_at)}
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-dark-800 ml-20" />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
            <Ionicons name="chatbubbles-outline" size={64} color={COLORS.textMuted} />
            <Text className="text-gray-400 text-lg mt-4">还没有消息</Text>
            <Text className="text-gray-500 text-sm mt-1">匹配成功后就可以聊天啦</Text>
          </View>
        }
      />
    </View>
  );
}
