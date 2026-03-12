import { View, ActivityIndicator, Text } from "react-native";
import { COLORS } from "@/constants/theme";

interface LoadingSpinnerProps {
  text?: string;
  size?: "small" | "large";
}

export function LoadingSpinner({ text, size = "large" }: LoadingSpinnerProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.background }}>
      <ActivityIndicator size={size} color={COLORS.primary} />
      {text && (
        <Text style={{ color: COLORS.textSecondary, marginTop: 12, fontSize: 14 }}>
          {text}
        </Text>
      )}
    </View>
  );
}
