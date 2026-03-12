import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { getPetById } from "@/lib/api/pets";
import { COLORS } from "@/constants/theme";
import { PET_SPECIES, PET_SIZES } from "@/constants/config";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: pet, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: () => getPetById(id!),
    enabled: !!id,
  });

  if (isLoading || !pet) {
    return (
      <View className="flex-1 bg-dark-900 items-center justify-center">
        <Text className="text-gray-400">加载中...</Text>
      </View>
    );
  }

  const speciesLabel = PET_SPECIES.find((s) => s.value === pet.species)?.label ?? pet.species;
  const sizeLabel = PET_SIZES.find((s) => s.value === pet.size)?.label ?? pet.size;

  return (
    <ScrollView className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="absolute top-16 left-4 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={{ height: SCREEN_WIDTH * 0.8 }} className="bg-dark-800">
        {pet.avatar_url ? (
          <Image
            source={{ uri: pet.avatar_url }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="paw" size={80} color={COLORS.textMuted} />
          </View>
        )}
      </View>

      <View className="px-6 pt-6 pb-12">
        {/* Name & Gender */}
        <View className="flex-row items-center mb-2">
          <Text className="text-white text-2xl font-bold mr-3">{pet.name}</Text>
          <Ionicons
            name={pet.gender === "male" ? "male" : pet.gender === "female" ? "female" : "help-circle"}
            size={22}
            color={pet.gender === "male" ? "#4FC3F7" : pet.gender === "female" ? "#FF6B6B" : "#888"}
          />
        </View>

        {/* Species & Breed */}
        <Text className="text-gray-400 text-base mb-4">
          {speciesLabel}
          {pet.breed ? ` · ${pet.breed}` : ""}
          {` · ${sizeLabel}`}
        </Text>

        {/* Owner */}
        {pet.owner && (
          <View className="flex-row items-center mb-6">
            <View className="w-8 h-8 rounded-full bg-dark-700 overflow-hidden mr-2">
              {pet.owner.avatar_url ? (
                <Image source={{ uri: pet.owner.avatar_url }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Ionicons name="person" size={14} color={COLORS.textMuted} />
                </View>
              )}
            </View>
            <Text className="text-gray-400 text-sm">@{pet.owner.username}</Text>
          </View>
        )}

        {/* Bio */}
        {pet.bio && (
          <View className="mb-6">
            <Text className="text-gray-400 text-sm mb-1">简介</Text>
            <Text className="text-white text-base">{pet.bio}</Text>
          </View>
        )}

        {/* Personality */}
        {pet.personality && pet.personality.length > 0 && (
          <View className="mb-6">
            <Text className="text-gray-400 text-sm mb-2">性格</Text>
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {pet.personality.map((trait) => (
                <View
                  key={trait}
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: COLORS.surfaceLight }}
                >
                  <Text className="text-sm" style={{ color: COLORS.accent }}>
                    {trait}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Info badges */}
        <View className="flex-row flex-wrap mb-6" style={{ gap: 8 }}>
          {pet.is_neutered && (
            <View className="flex-row items-center px-3 py-1.5 rounded-full bg-dark-700">
              <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
              <Text className="text-gray-300 text-xs ml-1">已绝育</Text>
            </View>
          )}
          {pet.is_vaccinated && (
            <View className="flex-row items-center px-3 py-1.5 rounded-full bg-dark-700">
              <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
              <Text className="text-gray-300 text-xs ml-1">已接种</Text>
            </View>
          )}
        </View>

        {/* Photo Wall */}
        {pet.photos && pet.photos.length > 0 && (
          <View>
            <Text className="text-gray-400 text-sm mb-2">照片墙</Text>
            <View className="flex-row flex-wrap" style={{ gap: 4 }}>
              {pet.photos.map((photo, i) => (
                <View
                  key={i}
                  style={{
                    width: (SCREEN_WIDTH - 48 - 8) / 3,
                    height: (SCREEN_WIDTH - 48 - 8) / 3,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <Image source={{ uri: photo }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
