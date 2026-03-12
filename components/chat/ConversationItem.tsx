import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { COLORS } from "@/constants/theme";
import { timeAgo } from "@/lib/utils/formatDate";

interface ConversationItemProps {
  avatarUrl?: string | null;
  name: string;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCount?: number;
  onPress: () => void;
}

export function ConversationItem({
  avatarUrl,
  name,
  lastMessage,
  lastMessageAt,
  unreadCount,
  onPress,
}: ConversationItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}
      activeOpacity={0.7}
    >
      <Avatar uri={avatarUrl} size={52} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: "600" }}>
          {name}
        </Text>
        <Text
          style={{ color: COLORS.textSecondary, fontSize: 14, marginTop: 2 }}
          numberOfLines={1}
        >
          {lastMessage ?? "开始聊天吧~"}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        {lastMessageAt && (
          <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
            {timeAgo(lastMessageAt)}
          </Text>
        )}
        {unreadCount != null && unreadCount > 0 && (
          <View style={{
            backgroundColor: COLORS.primary,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 4,
            paddingHorizontal: 6,
          }}>
            <Text style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
