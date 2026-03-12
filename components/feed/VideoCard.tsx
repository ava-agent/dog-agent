import { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "@/lib/api/videos";
import { useAuthStore } from "@/stores/authStore";
import { useFeedStore } from "@/stores/feedStore";
import { formatNumber } from "@/lib/utils/formatNumber";
import type { Video as VideoType } from "@/types/database";
import * as Haptics from "expo-haptics";

interface VideoCardProps {
  video: VideoType;
  isActive: boolean;
  height: number;
}

export function VideoCard({ video, isActive, height }: VideoCardProps) {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const user = useAuthStore((s) => s.user);
  const isMuted = useFeedStore((s) => s.isMuted);
  const toggleMute = useFeedStore((s) => s.toggleMute);
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(video.is_liked ?? false);
  const [likeCount, setLikeCount] = useState(video.like_count);
  const [lastTap, setLastTap] = useState(0);
  const [showHeart, setShowHeart] = useState(false);

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(video.id, user!.id, isLiked),
    onMutate: () => {
      setIsLiked(!isLiked);
      setLikeCount((c) => (isLiked ? c - 1 : c + 1));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onError: () => {
      setIsLiked(isLiked);
      setLikeCount(video.like_count);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (!isLiked) {
        likeMutation.mutate();
      }
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    setLastTap(now);
  };

  return (
    <View style={{ height, width: "100%" }} className="bg-black relative">
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleDoubleTap}
        style={{ flex: 1 }}
      >
        <Video
          ref={videoRef}
          source={{ uri: video.video_url }}
          style={{ width: "100%", height: "100%" }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isActive}
          isLooping
          isMuted={isMuted}
        />
      </TouchableOpacity>

      {/* Double-tap heart animation */}
      {showHeart && (
        <View className="absolute inset-0 items-center justify-center">
          <Ionicons name="heart" size={100} color="#FF2D55" style={{ opacity: 0.9 }} />
        </View>
      )}

      {/* Mute toggle */}
      <TouchableOpacity
        className="absolute top-16 right-4"
        onPress={toggleMute}
      >
        <Ionicons
          name={isMuted ? "volume-mute" : "volume-high"}
          size={22}
          color="white"
          style={{ opacity: 0.7 }}
        />
      </TouchableOpacity>

      {/* Right side actions */}
      <View className="absolute right-3 bottom-28 items-center" style={{ gap: 20 }}>
        {/* User Avatar */}
        <TouchableOpacity
          onPress={() => video.user && router.push(`/pet/${video.pet_id}`)}
        >
          <View className="w-12 h-12 rounded-full bg-dark-700 overflow-hidden border-2 border-white">
            {video.user?.avatar_url ? (
              <Image
                source={{ uri: video.user.avatar_url }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Ionicons name="person" size={20} color="#666" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Like */}
        <TouchableOpacity className="items-center" onPress={() => likeMutation.mutate()}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={32}
            color={isLiked ? "#FF2D55" : "white"}
          />
          <Text className="text-white text-xs mt-1">{formatNumber(likeCount)}</Text>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push(`/video/${video.id}`)}
        >
          <Ionicons name="chatbubble-ellipses" size={30} color="white" />
          <Text className="text-white text-xs mt-1">{formatNumber(video.comment_count)}</Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity className="items-center">
          <Ionicons name="share-social" size={30} color="white" />
          <Text className="text-white text-xs mt-1">{formatNumber(video.share_count)}</Text>
        </TouchableOpacity>

        {/* Pet */}
        {video.pet && (
          <TouchableOpacity
            className="items-center"
            onPress={() => router.push(`/pet/${video.pet_id}`)}
          >
            <Ionicons name="paw" size={28} color="#FFD93D" />
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom info */}
      <View className="absolute bottom-6 left-4 right-20">
        <Text className="text-white text-base font-bold mb-1">
          @{video.user?.username ?? "用户"}
        </Text>
        {video.description && (
          <Text className="text-white text-sm mb-1" numberOfLines={2}>
            {video.description}
          </Text>
        )}
        {video.pet && (
          <View className="flex-row items-center mt-1">
            <Ionicons name="paw" size={14} color="#FFD93D" />
            <Text className="text-yellow-300 text-sm ml-1">
              {video.pet.name}
              {video.pet.breed ? ` · ${video.pet.breed}` : ""}
            </Text>
          </View>
        )}
        {video.hashtags && video.hashtags.length > 0 && (
          <Text className="text-gray-300 text-sm mt-1">
            {video.hashtags.map((t) => `#${t}`).join(" ")}
          </Text>
        )}
      </View>
    </View>
  );
}
