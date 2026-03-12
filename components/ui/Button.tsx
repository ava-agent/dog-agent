import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from "react-native";
import { COLORS } from "@/constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const bgColor =
    variant === "primary" ? COLORS.primary :
    variant === "secondary" ? COLORS.surface :
    "transparent";

  const borderColor = variant === "outline" ? COLORS.border : "transparent";
  const textColor = variant === "outline" ? COLORS.text : "white";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        {
          height: 48,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: disabled ? COLORS.surfaceLight : bgColor,
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text
          style={[
            {
              color: disabled ? COLORS.textMuted : textColor,
              fontSize: 16,
              fontWeight: "bold",
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
