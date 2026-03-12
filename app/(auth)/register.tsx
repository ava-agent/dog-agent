import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { signUp } from "@/lib/api/auth";
import { COLORS } from "@/constants/theme";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("提示", "请填写所有必填项");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("提示", "两次输入的密码不一致");
      return;
    }
    if (password.length < 6) {
      Alert.alert("提示", "密码至少需要6位");
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password, username.trim());
      router.replace("/(auth)/onboarding");
    } catch (error: any) {
      Alert.alert("注册失败", error.message || "请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark-900"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        className="px-8"
      >
        {/* Header */}
        <View className="items-center mb-10">
          <Text className="text-white text-3xl font-bold">创建账号</Text>
          <Text className="text-gray-400 text-base mt-2">加入宠友圈，开始宠物交友</Text>
        </View>

        {/* Username */}
        <View className="mb-4">
          <View className="flex-row items-center bg-dark-800 rounded-xl px-4 h-14 border border-dark-600">
            <Ionicons name="person-outline" size={20} color={COLORS.textMuted} />
            <TextInput
              className="flex-1 text-white text-base ml-3"
              placeholder="用户名"
              placeholderTextColor={COLORS.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Email */}
        <View className="mb-4">
          <View className="flex-row items-center bg-dark-800 rounded-xl px-4 h-14 border border-dark-600">
            <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
            <TextInput
              className="flex-1 text-white text-base ml-3"
              placeholder="邮箱地址"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Password */}
        <View className="mb-4">
          <View className="flex-row items-center bg-dark-800 rounded-xl px-4 h-14 border border-dark-600">
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
            <TextInput
              className="flex-1 text-white text-base ml-3"
              placeholder="密码 (至少6位)"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Confirm Password */}
        <View className="mb-6">
          <View className="flex-row items-center bg-dark-800 rounded-xl px-4 h-14 border border-dark-600">
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
            <TextInput
              className="flex-1 text-white text-base ml-3"
              placeholder="确认密码"
              placeholderTextColor={COLORS.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          className="h-14 rounded-xl items-center justify-center mb-4"
          style={{ backgroundColor: COLORS.primary }}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">注册</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center mt-4 mb-8">
          <Text className="text-gray-400 text-base">已有账号？</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-base font-bold" style={{ color: COLORS.primary }}>
                去登录
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
