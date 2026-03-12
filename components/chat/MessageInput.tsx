import { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import * as Haptics from "expo-haptics";

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderTopWidth: 0.5,
      borderTopColor: COLORS.border,
      backgroundColor: COLORS.background,
    }}>
      <TextInput
        style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          color: "white",
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 10,
          fontSize: 15,
          maxHeight: 100,
        }}
        placeholder="发消息..."
        placeholderTextColor={COLORS.textMuted}
        value={text}
        onChangeText={setText}
        multiline
        returnKeyType="send"
        onSubmitEditing={handleSend}
        editable={!disabled}
      />
      <TouchableOpacity
        onPress={handleSend}
        disabled={!text.trim() || disabled}
        style={{ marginLeft: 8, padding: 4 }}
      >
        <Ionicons
          name="send"
          size={26}
          color={text.trim() ? COLORS.primary : COLORS.textMuted}
        />
      </TouchableOpacity>
    </View>
  );
}
