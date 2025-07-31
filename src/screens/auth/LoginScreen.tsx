import * as React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn, setLoading, setError, isLoading, error } = useAuthStore();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El email no es válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al iniciar sesión");
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert("Error", "Ingresa tu email para restablecer la contraseña");
      return;
    }

    // TODO: Implement password reset
    Alert.alert(
      "Info",
      "Función de restablecimiento de contraseña próximamente"
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              Iniciar Sesión
            </Text>
            <Text className="text-gray-600 text-center">
              Ingresa tus credenciales para continuar
            </Text>
          </View>

          {/* Error Display */}
          {error && (
            <View className="mb-4 p-3 bg-red-100 rounded-lg border border-red-300">
              <Text className="text-red-700 text-sm">{error}</Text>
            </View>
          )}

          {/* Form */}
          <View className="mb-6">
            <Input
              label="Email"
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              error={errors.email}
            />

            <Input
              label="Contraseña"
              placeholder="Tu contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
              error={errors.password}
            />
          </View>

          {/* Login Button */}
          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
          />

          {/* Forgot Password */}
          <View className="mt-4">
            <Text
              className="text-center text-blue-600 text-sm"
              onPress={handleForgotPassword}
            >
              ¿Olvidaste tu contraseña?
            </Text>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">o</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Register Link */}
          <View className="items-center">
            <Text className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <Text
                className="text-blue-600 font-semibold"
                onPress={() => (navigation as any).navigate("Register")}
              >
                Regístrate aquí
              </Text>
            </Text>
          </View>

          {/* Back Button */}
          <View className="mt-8">
            <Button
              title="Volver"
              onPress={() => navigation.goBack()}
              variant="outline"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
