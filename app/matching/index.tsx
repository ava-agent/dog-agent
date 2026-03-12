import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMatchingCandidates, createSwipe } from "@/lib/api/matches";
import { getUserPets } from "@/lib/api/pets";
import { useAuthStore } from "@/stores/authStore";
import { useMatchingStore } from "@/stores/matchingStore";
import { SwipeCard } from "@/components/matching/SwipeCard";
import { MatchModal } from "@/components/matching/MatchModal";
import { COLORS } from "@/constants/theme";
import * as Haptics from "expo-haptics";

export default function MatchingScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { activePetId, setActivePet, speciesFilter } = useMatchingStore();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedPet, setMatchedPet] = useState<any>(null);

  const { data: pets } = useQuery({
    queryKey: ["pets", user?.id],
    queryFn: () => getUserPets(user!.id),
    enabled: !!user,
  });

  // Auto-select first pet if none selected
  const currentPetId = activePetId ?? pets?.[0]?.id;
  const currentPet = pets?.find((p) => p.id === currentPetId);

  const { data: candidates, isLoading } = useQuery({
    queryKey: ["matching", "candidates", currentPetId, speciesFilter],
    queryFn: () =>
      getMatchingCandidates({
        petId: currentPetId!,
        ownerId: user!.id,
        species: speciesFilter ?? undefined,
      }),
    enabled: !!currentPetId && !!user,
  });

  const swipeMutation = useMutation({
    mutationFn: ({
      swipedPetId,
      direction,
    }: {
      swipedPetId: string;
      direction: "left" | "right";
    }) => createSwipe(currentPetId!, swipedPetId, direction),
    onSuccess: (result, variables) => {
      if (result.match) {
        const matched = (candidates ?? [])[currentIndex];
        setMatchedPet(matched);
        setMatchModalVisible(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setCurrentIndex((i) => i + 1);
      queryClient.invalidateQueries({ queryKey: ["matching"] });
    },
  });

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      const candidate = (candidates ?? [])[currentIndex];
      if (!candidate) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      swipeMutation.mutate({ swipedPetId: candidate.id, direction });
    },
    [candidates, currentIndex]
  );

  const remainingCandidates = (candidates ?? []).slice(currentIndex);

  if (isLoading) {
    return (
      <View className="flex-1 bg-dark-900 items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="text-gray-400 mt-4">寻找附近的宠物...</Text>
      </View>
    );
  }

  if (!currentPet) {
    return (
      <View className="flex-1 bg-dark-900 items-center justify-center px-8">
        <Ionicons name="paw" size={64} color={COLORS.textMuted} />
        <Text className="text-gray-400 text-lg mt-4 text-center">
          请先创建一个宠物档案
        </Text>
        <TouchableOpacity
          className="mt-4 px-6 py-3 rounded-full"
          style={{ backgroundColor: COLORS.primary }}
          onPress={() => router.push("/(auth)/onboarding")}
        >
          <Text className="text-white font-bold">创建宠物</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-16 pb-3 px-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">宠物匹配</Text>
        <TouchableOpacity>
          <Ionicons name="options" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Pet Selector */}
      {pets && pets.length > 1 && (
        <View className="flex-row justify-center mb-2" style={{ gap: 12 }}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              className="px-4 py-1.5 rounded-full"
              style={{
                backgroundColor:
                  currentPetId === pet.id ? COLORS.primary : COLORS.surface,
              }}
              onPress={() => {
                setActivePet(pet.id);
                setCurrentIndex(0);
              }}
            >
              <Text
                className="text-sm"
                style={{
                  color: currentPetId === pet.id ? "white" : COLORS.textSecondary,
                }}
              >
                {pet.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Swipe Area */}
      <View className="flex-1 items-center justify-center">
        {remainingCandidates.length === 0 ? (
          <View className="items-center px-8">
            <Ionicons name="search" size={64} color={COLORS.textMuted} />
            <Text className="text-gray-400 text-lg mt-4 text-center">
              附近没有更多宠物了
            </Text>
            <Text className="text-gray-500 text-sm mt-2 text-center">
              试试扩大搜索范围或稍后再来
            </Text>
          </View>
        ) : (
          remainingCandidates
            .slice(0, 3)
            .reverse()
            .map((candidate: any, i: number, arr: any[]) => (
              <SwipeCard
                key={candidate.id}
                pet={candidate}
                onSwipe={handleSwipe}
                isTop={i === arr.length - 1}
                index={arr.length - 1 - i}
              />
            ))
        )}
      </View>

      {/* Action Buttons */}
      {remainingCandidates.length > 0 && (
        <View className="flex-row justify-center pb-8" style={{ gap: 24 }}>
          <TouchableOpacity
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: COLORS.surface, borderWidth: 2, borderColor: "#FF453A" }}
            onPress={() => handleSwipe("left")}
          >
            <Ionicons name="close" size={32} color="#FF453A" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: COLORS.primary }}
            onPress={() => handleSwipe("right")}
          >
            <Ionicons name="heart" size={32} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Match Modal */}
      <MatchModal
        visible={matchModalVisible}
        pet1AvatarUrl={currentPet?.avatar_url}
        pet2AvatarUrl={matchedPet?.avatar_url}
        pet1Name={currentPet?.name ?? ""}
        pet2Name={matchedPet?.name ?? ""}
        onSendMessage={() => {
          setMatchModalVisible(false);
          // Navigate to chat - need to find the match/conversation
          router.push("/(tabs)/messages");
        }}
        onKeepSwiping={() => setMatchModalVisible(false)}
      />
    </View>
  );
}
