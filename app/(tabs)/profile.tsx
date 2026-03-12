import { View, Text, TouchableOpacity, FlatList, Dimensions, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { getProfile } from "@/lib/api/auth";
import { getUserPets } from "@/lib/api/pets";
import { getUserVideos } from "@/lib/api/videos";
import { signOut } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { COLORS } from "@/constants/theme";
import { formatNumber } from "@/lib/utils/formatNumber";
import { supabase } from "@/lib/supabase";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_GAP = 2;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - GRID_GAP * 2) / 3;

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user,
  });

  const { data: pets } = useQuery({
    queryKey: ["pets", user?.id],
    queryFn: () => getUserPets(user!.id),
    enabled: !!user,
  });

  const { data: videos } = useQuery({
    queryKey: ["videos", "user", user?.id],
    queryFn: () => getUserVideos(user!.id),
    enabled: !!user,
  });

  const { data: followCounts } = useQuery({
    queryKey: ["followCounts", user?.id],
    queryFn: async () => {
      const [{ count: followers }, { count: following }] = await Promise.all([
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", user!.id),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", user!.id),
      ]);
      return { followers: followers ?? 0, following: following ?? 0 };
    },
    enabled: !!user,
  });

  const handleSignOut = () => {
    Alert.alert("退出登录", "确定要退出吗？", [
      { text: "取消", style: "cancel" },
      {
        text: "退出",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="pt-16 pb-4 px-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-xl font-bold">
            @{profile?.username ?? "用户"}
          </Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Ionicons name="settings-outline" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Avatar & Stats */}
        <View className="flex-row items-center mb-4">
          <View className="w-20 h-20 rounded-full bg-dark-700 overflow-hidden mr-6">
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={{ width: "100%", height: "100%" }} />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Ionicons name="person" size={32} color={COLORS.textMuted} />
              </View>
            )}
          </View>
          <View className="flex-row flex-1 justify-around">
            <View className="items-center">
              <Text className="text-white text-lg font-bold">{videos?.length ?? 0}</Text>
              <Text className="text-gray-400 text-xs">作品</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-lg font-bold">
                {formatNumber(followCounts?.followers ?? 0)}
              </Text>
              <Text className="text-gray-400 text-xs">粉丝</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-lg font-bold">
                {formatNumber(followCounts?.following ?? 0)}
              </Text>
              <Text className="text-gray-400 text-xs">关注</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        {profile?.bio ? (
          <Text className="text-gray-300 text-sm mb-4">{profile.bio}</Text>
        ) : null}
      </View>

      {/* My Pets */}
      {pets && pets.length > 0 && (
        <View className="mb-4">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text className="text-white text-base font-bold">我的宠物</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/onboarding")}>
              <Text style={{ color: COLORS.primary }} className="text-sm">
                + 添加
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={pets}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="items-center"
                onPress={() => router.push(`/pet/${item.id}`)}
              >
                <View className="w-16 h-16 rounded-full bg-dark-700 overflow-hidden border-2 border-dark-600">
                  {item.avatar_url ? (
                    <Image
                      source={{ uri: item.avatar_url }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <View className="flex-1 items-center justify-center">
                      <Ionicons name="paw" size={24} color={COLORS.textMuted} />
                    </View>
                  )}
                </View>
                <Text className="text-white text-xs mt-1">{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Divider */}
      <View className="h-px bg-dark-800 mb-1" />

      {/* Video Grid */}
      <View className="flex-row flex-wrap">
        {(videos ?? []).map((video) => (
          <TouchableOpacity
            key={video.id}
            style={{
              width: GRID_ITEM_SIZE,
              height: GRID_ITEM_SIZE * 1.3,
              marginRight: GRID_GAP,
              marginBottom: GRID_GAP,
            }}
            onPress={() => router.push(`/video/${video.id}`)}
            activeOpacity={0.9}
          >
            <View className="flex-1 bg-dark-800">
              {video.thumbnail_url ? (
                <Image
                  source={{ uri: video.thumbnail_url }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Ionicons name="videocam" size={24} color={COLORS.textMuted} />
                </View>
              )}
            </View>
            <View className="absolute bottom-2 left-2 flex-row items-center">
              <Ionicons name="heart" size={12} color="white" />
              <Text className="text-white text-xs ml-1">{video.like_count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {(!videos || videos.length === 0) && (
        <View className="items-center py-16">
          <Ionicons name="videocam-outline" size={48} color={COLORS.textMuted} />
          <Text className="text-gray-400 text-base mt-3">还没有作品</Text>
          <TouchableOpacity
            className="mt-3 px-6 py-2 rounded-full"
            style={{ backgroundColor: COLORS.primary }}
            onPress={() => router.push("/(tabs)/upload")}
          >
            <Text className="text-white font-bold">去拍摄</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
