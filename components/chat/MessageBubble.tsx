import { View, Text } from "react-native";
import { COLORS } from "@/constants/theme";
import { timeAgo } from "@/lib/utils/formatDate";

interface MessageBubbleProps {
  content: string;
  createdAt: string;
  isMine: boolean;
}

export function MessageBubble({ content, createdAt, isMine }: MessageBubbleProps) {
  return (
    <View style={{ alignItems: isMine ? "flex-end" : "flex-start", marginVertical: 4, paddingHorizontal: 16 }}>
      <View
        style={{
          maxWidth: "75%",
          backgroundColor: isMine ? COLORS.primary : COLORS.surfaceLight,
          borderRadius: 18,
          borderBottomRightRadius: isMine ? 4 : 18,
          borderBottomLeftRadius: isMine ? 18 : 4,
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 15 }}>{content}</Text>
      </View>
      <Text style={{ color: COLORS.textMuted, fontSize: 10, marginTop: 2, marginHorizontal: 4 }}>
        {timeAgo(createdAt)}
      </Text>
    </View>
  );
}
