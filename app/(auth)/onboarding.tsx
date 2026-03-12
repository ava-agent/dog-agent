import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { createPet } from "@/lib/api/pets";
import { uploadFile } from "@/lib/api/storage";
import { useAuthStore } from "@/stores/authStore";
import { COLORS } from "@/constants/theme";
import { PERSONALITY_TRAITS, PET_SPECIES, PET_SIZES } from "@/constants/config";

export default function OnboardingScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [breed, setBreed] = useState("");
  const [size, setSize] = useState("medium");
  const [bio, setBio] = useState("");
  const [personality, setPersonality] = useState<string[]>([]);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const toggleTrait = (trait: string) => {
    setPersonality((prev) =>
      prev.includes(trait)
        ? prev.filter((t) => t !== trait)
        : prev.length < 5
          ? [...prev, trait]
          : prev
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("提示", "请输入宠物名字");
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      let avatar_url: string | undefined;
      if (avatarUri) {
        avatar_url = await uploadFile("pet-photos", `${user.id}/pet_avatar_${Date.now()}.jpg`, {
          uri: avatarUri,
          type: "image/jpeg",
        });
      }

      await createPet({
        owner_id: user.id,
        name: name.trim(),
        species: species as any,
        breed: breed.trim() || undefined,
        size: size as any,
        bio: bio.trim() || undefined,
        personality,
        avatar_url,
        photos: [],
      });

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("创建失败", error.message || "请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-dark-900" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-16">
        {/* Header */}
        <Text className="text-white text-2xl font-bold text-center mb-2">
          创建宠物档案
        </Text>
        <Text className="text-gray-400 text-center mb-8">
          告诉大家你的毛孩子是谁
        </Text>

        {/* Avatar */}
        <TouchableOpacity
          className="self-center mb-8"
          onPress={pickAvatar}
          activeOpacity={0.7}
        >
          <View className="w-28 h-28 rounded-full bg-dark-700 items-center justify-center overflow-hidden border-2 border-dark-600">
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <Ionicons name="camera" size={32} color={COLORS.textMuted} />
                <Text className="text-gray-500 text-xs mt-1">添加头像</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Name */}
        <Text className="text-gray-400 text-sm mb-2 ml-1">宠物名字 *</Text>
        <TextInput
          className="bg-dark-800 text-white rounded-xl px-4 h-14 text-base mb-4 border border-dark-600"
          placeholder="给你的宝贝取个名字"
          placeholderTextColor={COLORS.textMuted}
          value={name}
          onChangeText={setName}
        />

        {/* Species */}
        <Text className="text-gray-400 text-sm mb-2 ml-1">宠物类型</Text>
        <View className="flex-row flex-wrap mb-4">
          {PET_SPECIES.map((s) => (
            <TouchableOpacity
              key={s.value}
              className="mr-2 mb-2 px-4 py-2 rounded-full border"
              style={{
                backgroundColor: species === s.value ? COLORS.primary : "transparent",
                borderColor: species === s.value ? COLORS.primary : COLORS.border,
              }}
              onPress={() => setSpecies(s.value)}
            >
              <Text
                className="text-sm"
                style={{ color: species === s.value ? "white" : COLORS.textSecondary }}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Breed */}
        <Text className="text-gray-400 text-sm mb-2 ml-1">品种</Text>
        <TextInput
          className="bg-dark-800 text-white rounded-xl px-4 h-14 text-base mb-4 border border-dark-600"
          placeholder="例如：金毛、英短蓝猫..."
          placeholderTextColor={COLORS.textMuted}
          value={breed}
          onChangeText={setBreed}
        />

        {/* Size */}
        <Text className="text-gray-400 text-sm mb-2 ml-1">体型</Text>
        <View className="flex-row flex-wrap mb-4">
          {PET_SIZES.map((s) => (
            <TouchableOpacity
              key={s.value}
              className="mr-2 mb-2 px-4 py-2 rounded-full border"
              style={{
                backgroundColor: size === s.value ? COLORS.primary : "transparent",
                borderColor: size === s.value ? COLORS.primary : COLORS.border,
              }}
              onPress={() => setSize(s.value)}
            >
              <Text
                className="text-sm"
                style={{ color: size === s.value ? "white" : COLORS.textSecondary }}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Personality */}
        <Text className="text-gray-400 text-sm mb-2 ml-1">性格标签 (最多5个)</Text>
        <View className="flex-row flex-wrap mb-4">
          {PERSONALITY_TRAITS.map((trait) => (
            <TouchableOpacity
              key={trait}
              className="mr-2 mb-2 px-3 py-1.5 rounded-full border"
              style={{
                backgroundColor: personality.includes(trait) ? COLORS.accent : "transparent",
                borderColor: personality.includes(trait) ? COLORS.accent : COLORS.border,
              }}
              onPress={() => toggleTrait(trait)}
            >
              <Text
                className="text-sm"
                style={{
                  color: personality.includes(trait) ? "#000" : COLORS.textSecondary,
                }}
              >
                {trait}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bio */}
        <Text className="text-gray-400 text-sm mb-2 ml-1">简介</Text>
        <TextInput
          className="bg-dark-800 text-white rounded-xl px-4 py-3 text-base mb-8 border border-dark-600"
          placeholder="介绍一下你的宝贝..."
          placeholderTextColor={COLORS.textMuted}
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
          style={{ minHeight: 80, textAlignVertical: "top" }}
        />

        {/* Submit */}
        <TouchableOpacity
          className="h-14 rounded-xl items-center justify-center"
          style={{ backgroundColor: COLORS.primary }}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">完成创建</Text>
          )}
        </TouchableOpacity>

        {/* Skip */}
        <TouchableOpacity
          className="mt-4 items-center"
          onPress={() => router.replace("/(tabs)")}
        >
          <Text className="text-gray-500 text-base">稍后再说</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
