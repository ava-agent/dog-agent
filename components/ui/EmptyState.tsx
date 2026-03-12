import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
      <Ionicons name={icon} size={64} color={COLORS.textMuted} />
      <Text style={{ color: COLORS.textSecondary, fontSize: 18, marginTop: 16, textAlign: "center" }}>
        {title}
      </Text>
      {subtitle && (
        <Text style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 8, textAlign: "center" }}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={{
            marginTop: 20,
            paddingHorizontal: 24,
            paddingVertical: 10,
            borderRadius: 20,
            backgroundColor: COLORS.primary,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
