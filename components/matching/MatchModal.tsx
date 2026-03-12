import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

interface MatchModalProps {
  visible: boolean;
  pet1AvatarUrl?: string | null;
  pet2AvatarUrl?: string | null;
  pet1Name: string;
  pet2Name: string;
  onSendMessage: () => void;
  onKeepSwiping: () => void;
}

export function MatchModal({
  visible,
  pet1AvatarUrl,
  pet2AvatarUrl,
  pet1Name,
  pet2Name,
  onSendMessage,
  onKeepSwiping,
}: MatchModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.85)", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <Ionicons name="heart" size={48} color={COLORS.primary} />
        <Text style={{ color: "white", fontSize: 32, fontWeight: "bold", marginTop: 16 }}>
          配对成功!
        </Text>
        <Text style={{ color: COLORS.textSecondary, fontSize: 16, marginTop: 8, textAlign: "center" }}>
          {pet1Name} 和 {pet2Name} 互相喜欢
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 32, gap: 20 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.surfaceLight, overflow: "hidden", borderWidth: 3, borderColor: COLORS.primary }}>
            {pet1AvatarUrl ? (
              <Image source={{ uri: pet1AvatarUrl }} style={{ width: "100%", height: "100%" }} />
            ) : (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="paw" size={32} color={COLORS.textMuted} />
              </View>
            )}
          </View>
          <Ionicons name="heart" size={32} color={COLORS.primary} />
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.surfaceLight, overflow: "hidden", borderWidth: 3, borderColor: COLORS.primary }}>
            {pet2AvatarUrl ? (
              <Image source={{ uri: pet2AvatarUrl }} style={{ width: "100%", height: "100%" }} />
            ) : (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="paw" size={32} color={COLORS.textMuted} />
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={onSendMessage}
          style={{ marginTop: 40, width: "100%", height: 52, borderRadius: 26, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>发送消息</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onKeepSwiping} style={{ marginTop: 16 }}>
          <Text style={{ color: COLORS.textSecondary, fontSize: 16 }}>继续匹配</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
