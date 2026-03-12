import { View, Text, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { COLORS } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;

interface SwipeCardProps {
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    gender: string;
    size: string;
    bio: string | null;
    personality: string[];
    avatar_url: string | null;
    photos: string[];
    owner_username: string;
    distance_km: number | null;
  };
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  index: number;
}

export function SwipeCard({ pet, onSwipe, isTop, index }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .enabled(isTop)
    .onChange((event) => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    })
    .onFinalize((event) => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const direction = translateX.value > 0 ? "right" : "left";
        translateX.value = withTiming(
          direction === "right" ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5,
          { duration: 300 },
          () => runOnJS(onSwipe)(direction)
        );
        translateY.value = withTiming(translateY.value + event.velocityY * 0.1, { duration: 300 });
      } else {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${interpolate(translateX.value, [-SCREEN_WIDTH, 0, SCREEN_WIDTH], [-15, 0, 15])}deg` },
      { scale: isTop ? 1 : interpolate(index, [0, 1, 2], [1, 0.95, 0.9]) },
    ],
  }));

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1]),
  }));

  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0]),
  }));

  const imageUri = pet.avatar_url || (pet.photos?.length > 0 ? pet.photos[0] : null);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            width: SCREEN_WIDTH - 32,
            height: "85%",
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: COLORS.surface,
          },
        ]}
      >
        {/* Photo */}
        <View style={{ flex: 1 }}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
          ) : (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surfaceLight }}>
              <Ionicons name="paw" size={80} color={COLORS.textMuted} />
            </View>
          )}
        </View>

        {/* LIKE label */}
        <Animated.View
          style={[likeOpacity, { position: "absolute", top: 40, left: 20, transform: [{ rotate: "-15deg" }] }]}
        >
          <Text style={{ fontSize: 36, fontWeight: "bold", color: "#30D158", borderWidth: 3, borderColor: "#30D158", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 }}>
            LIKE
          </Text>
        </Animated.View>

        {/* NOPE label */}
        <Animated.View
          style={[nopeOpacity, { position: "absolute", top: 40, right: 20, transform: [{ rotate: "15deg" }] }]}
        >
          <Text style={{ fontSize: 36, fontWeight: "bold", color: "#FF453A", borderWidth: 3, borderColor: "#FF453A", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 }}>
            NOPE
          </Text>
        </Animated.View>

        {/* Bottom info */}
        <View style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          paddingTop: 60,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold", marginRight: 8 }}>
              {pet.name}
            </Text>
            <Ionicons
              name={pet.gender === "male" ? "male" : pet.gender === "female" ? "female" : "help-circle"}
              size={20}
              color={pet.gender === "male" ? "#4FC3F7" : pet.gender === "female" ? "#FF6B6B" : "#888"}
            />
          </View>
          <Text style={{ color: "#ccc", fontSize: 14 }}>
            {pet.breed ?? pet.species}{pet.distance_km != null ? ` · ${pet.distance_km.toFixed(1)}km` : ""}
          </Text>
          {pet.personality && pet.personality.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 6 }}>
              {pet.personality.slice(0, 4).map((trait) => (
                <View key={trait} style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: "white", fontSize: 12 }}>{trait}</Text>
                </View>
              ))}
            </View>
          )}
          {pet.bio && (
            <Text style={{ color: "#aaa", fontSize: 13, marginTop: 6 }} numberOfLines={2}>
              {pet.bio}
            </Text>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
