import * as React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { signUp, setLoading, setError, isLoading, error } = useAuthStore();

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.phone) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "El teléfono debe tener 10 dígitos";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        role: "consumer",
      });

      Alert.alert("Éxito", "Cuenta creada exitosamente");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al crear la cuenta");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              Crear Cuenta
            </Text>
            <Text className="text-gray-600 text-center">
              Completa tus datos para registrarte
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
              label="Nombre Completo"
              placeholder="Tu nombre completo"
              value={formData.name}
              onChangeText={(value) => updateFormData("name", value)}
              leftIcon="person-outline"
              error={errors.name}
            />

            <Input
              label="Email"
              placeholder="tu@email.com"
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              error={errors.email}
            />

            <Input
              label="Teléfono"
              placeholder="11 1234 5678"
              value={formData.phone}
              onChangeText={(value) => updateFormData("phone", value)}
              keyboardType="phone-pad"
              leftIcon="call-outline"
              error={errors.phone}
            />

            <Input
              label="Contraseña"
              placeholder="Tu contraseña"
              value={formData.password}
              onChangeText={(value) => updateFormData("password", value)}
              secureTextEntry
              leftIcon="lock-closed-outline"
              error={errors.password}
            />

            <Input
              label="Confirmar Contraseña"
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData("confirmPassword", value)}
              secureTextEntry
              leftIcon="lock-closed-outline"
              error={errors.confirmPassword}
            />
          </View>

          {/* Register Button */}
          <Button
            title="Crear Cuenta"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
          />

          {/* Terms */}
          <View className="mt-4">
            <Text className="text-center text-gray-500 text-sm">
              Al registrarte, aceptas nuestros{" "}
              <Text className="text-blue-600">Términos y Condiciones</Text>
            </Text>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">o</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Login Link */}
          <View className="items-center">
            <Text className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Text
                className="text-blue-600 font-semibold"
                onPress={() => (navigation as any).navigate("Login")}
              >
                Inicia sesión aquí
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
