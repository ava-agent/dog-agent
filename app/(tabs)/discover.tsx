import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { supabase } from "@/lib/supabase";
import { COLORS } from "@/constants/theme";
import { PET_SPECIES } from "@/constants/config";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_GAP = 2;
const GRID_COLUMNS = 3;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

export default function DiscoverScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: trendingVideos } = useQuery({
    queryKey: ["videos", "trending", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("videos")
        .select("id, thumbnail_url, video_url, like_count, view_count")
        .eq("is_published", true)
        .order("like_count", { ascending: false })
        .limit(30);

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const categories = [
    { key: null, label: "全部", icon: "apps" as const },
    ...PET_SPECIES.map((s) => ({
      key: s.value,
      label: s.label,
      icon: s.value === "dog" ? "paw" as const :
            s.value === "cat" ? "paw" as const :
            "leaf" as const,
    })),
  ];

  return (
    <View className="flex-1 bg-dark-900">
      {/* Search Bar */}
      <View className="px-4 pt-16 pb-3">
        <View className="flex-row items-center bg-dark-800 rounded-full px-4 h-12">
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            className="flex-1 text-white text-base ml-3"
            placeholder="搜索宠物、视频、标签..."
            placeholderTextColor={COLORS.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 mb-4"
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.key ?? "all"}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: selectedCategory === cat.key ? COLORS.primary : COLORS.surface,
              }}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Text
                className="text-sm font-medium"
                style={{
                  color: selectedCategory === cat.key ? "white" : COLORS.textSecondary,
                }}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Find Playmates Button */}
        <TouchableOpacity
          className="mx-4 mb-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: COLORS.primary }}
          onPress={() => router.push("/matching")}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center py-4 px-6">
            <Ionicons name="heart" size={24} color="white" />
            <Text className="text-white text-lg font-bold ml-3">
              找玩伴 - 宠物匹配交友
            </Text>
          </View>
        </TouchableOpacity>

        {/* Trending Section */}
        <View className="px-4 mb-3">
          <Text className="text-white text-lg font-bold">热门视频</Text>
        </View>

        {/* Video Grid */}
        <View className="flex-row flex-wrap">
          {(trendingVideos ?? []).map((video) => (
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
              <Image
                source={{ uri: video.thumbnail_url || video.video_url }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
              <View className="absolute bottom-2 left-2 flex-row items-center">
                <Ionicons name="heart" size={12} color="white" />
                <Text className="text-white text-xs ml-1">{video.like_count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
