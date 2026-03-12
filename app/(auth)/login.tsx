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
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { signIn } from "@/lib/api/auth";
import { COLORS } from "@/constants/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("提示", "请输入邮箱和密码");
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (error: any) {
      Alert.alert("登录失败", error.message || "请检查邮箱和密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark-900"
    >
      <View className="flex-1 justify-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-4">
            <Ionicons name="paw" size={40} color="white" />
          </View>
          <Text className="text-white text-3xl font-bold">宠友圈</Text>
          <Text className="text-gray-400 text-base mt-2">PawPal - 宠物交友平台</Text>
        </View>

        {/* Email Input */}
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

        {/* Password Input */}
        <View className="mb-6">
          <View className="flex-row items-center bg-dark-800 rounded-xl px-4 h-14 border border-dark-600">
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
            <TextInput
              className="flex-1 text-white text-base ml-3"
              placeholder="密码"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="h-14 rounded-xl items-center justify-center mb-4"
          style={{ backgroundColor: COLORS.primary }}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">登录</Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-400 text-base">还没有账号？</Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-base font-bold" style={{ color: COLORS.primary }}>
                立即注册
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
