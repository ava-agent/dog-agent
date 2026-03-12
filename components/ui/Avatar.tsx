import { View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

interface AvatarProps {
  uri?: string | null;
  size?: number;
  borderColor?: string;
}

export function Avatar({ uri, size = 40, borderColor }: AvatarProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: COLORS.surfaceLight,
        overflow: "hidden",
        borderWidth: borderColor ? 2 : 0,
        borderColor,
      }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      ) : (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="paw" size={size * 0.45} color={COLORS.textMuted} />
        </View>
      )}
    </View>
  );
}
