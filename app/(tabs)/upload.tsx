import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { uploadVideo } from "@/lib/api/storage";
import { getUserPets } from "@/lib/api/pets";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { COLORS } from "@/constants/theme";

export default function UploadScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<string>("video/mp4");
  const [description, setDescription] = useState("");
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: pets } = useQuery({
    queryKey: ["pets", user?.id],
    queryFn: () => getUserPets(user!.id),
    enabled: !!user,
  });

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      videoMaxDuration: 60,
      quality: 0.8,
    });
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      setVideoType(result.assets[0].mimeType || "video/mp4");
    }
  };

  const handleUpload = async () => {
    if (!videoUri || !user) return;

    setUploading(true);
    try {
      const videoUrl = await uploadVideo(user.id, { uri: videoUri, type: videoType });

      // Extract hashtags from description
      const hashtags = description.match(/#[\u4e00-\u9fa5\w]+/g)?.map((t) => t.slice(1)) ?? [];

      await supabase.from("videos").insert({
        user_id: user.id,
        pet_id: selectedPetId,
        video_url: videoUrl,
        description,
        hashtags,
        is_published: true,
      });

      queryClient.invalidateQueries({ queryKey: ["videos"] });
      Alert.alert("发布成功", "你的视频已发布！", [
        { text: "好的", onPress: () => {
          setVideoUri(null);
          setDescription("");
          setSelectedPetId(null);
          router.push("/(tabs)");
        }},
      ]);
    } catch (error: any) {
      Alert.alert("上传失败", error.message || "请稍后再试");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-dark-900" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-4 pt-16">
        <Text className="text-white text-2xl font-bold text-center mb-6">发布视频</Text>

        {/* Video Picker */}
        {videoUri ? (
          <View className="mb-6">
            <View className="rounded-2xl overflow-hidden bg-dark-800 h-80">
              <Video
                source={{ uri: videoUri }}
                style={{ width: "100%", height: "100%" }}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
                useNativeControls
              />
            </View>
            <TouchableOpacity
              className="mt-3 items-center"
              onPress={() => setVideoUri(null)}
            >
              <Text className="text-gray-400">重新选择</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="h-80 rounded-2xl bg-dark-800 items-center justify-center mb-6 border-2 border-dashed border-dark-600"
            onPress={pickVideo}
            activeOpacity={0.7}
          >
            <Ionicons name="videocam" size={48} color={COLORS.textMuted} />
            <Text className="text-gray-400 text-lg mt-4">点击选择视频</Text>
            <Text className="text-gray-500 text-sm mt-1">最长60秒</Text>
          </TouchableOpacity>
        )}

        {/* Description */}
        <Text className="text-gray-400 text-sm mb-2 ml-1">描述</Text>
        <TextInput
          className="bg-dark-800 text-white rounded-xl px-4 py-3 text-base mb-4 border border-dark-600"
          placeholder="分享你和宠物的故事... #添加标签"
          placeholderTextColor={COLORS.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{ minHeight: 80, textAlignVertical: "top" }}
        />

        {/* Pet Selection */}
        {pets && pets.length > 0 && (
          <>
            <Text className="text-gray-400 text-sm mb-2 ml-1">关联宠物</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
              <TouchableOpacity
                className="mr-3 px-4 py-2 rounded-full border"
                style={{
                  backgroundColor: !selectedPetId ? COLORS.primary : "transparent",
                  borderColor: !selectedPetId ? COLORS.primary : COLORS.border,
                }}
                onPress={() => setSelectedPetId(null)}
              >
                <Text style={{ color: !selectedPetId ? "white" : COLORS.textSecondary }}>
                  不关联
                </Text>
              </TouchableOpacity>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  className="mr-3 px-4 py-2 rounded-full border"
                  style={{
                    backgroundColor: selectedPetId === pet.id ? COLORS.primary : "transparent",
                    borderColor: selectedPetId === pet.id ? COLORS.primary : COLORS.border,
                  }}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <Text
                    style={{
                      color: selectedPetId === pet.id ? "white" : COLORS.textSecondary,
                    }}
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Upload Button */}
        <TouchableOpacity
          className="h-14 rounded-xl items-center justify-center"
          style={{
            backgroundColor: videoUri ? COLORS.primary : COLORS.surfaceLight,
          }}
          onPress={handleUpload}
          disabled={!videoUri || uploading}
          activeOpacity={0.8}
        >
          {uploading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="white" size="small" />
              <Text className="text-white text-lg font-bold ml-2">上传中...</Text>
            </View>
          ) : (
            <Text
              className="text-lg font-bold"
              style={{ color: videoUri ? "white" : COLORS.textMuted }}
            >
              发布
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
