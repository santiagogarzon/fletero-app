import * as React from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function ConvertAnonymousScreen() {
  const navigation = useNavigation();
  const { convertAnonymousUser, isLoading, error } = useAuthStore();

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

  const handleConvertAccount = async () => {
    if (!validateForm()) return;

    try {
      await convertAnonymousUser(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        role: "consumer",
      });

      Alert.alert("Éxito", "Tu cuenta ha sido convertida exitosamente");
      (navigation as any).navigate("Main");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al convertir la cuenta");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              Crear Cuenta Completa
            </Text>
            <Text className="text-gray-600 text-center">
              Convierte tu cuenta anónima en una cuenta permanente
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

          {/* Convert Button */}
          <Button
            title="Crear Cuenta Completa"
            onPress={handleConvertAccount}
            loading={isLoading}
            fullWidth
            size="large"
          />

          {/* Skip Button */}
          <View className="mt-4">
            <Button
              title="Continuar como anónimo"
              onPress={() => (navigation as any).navigate("Main")}
              variant="outline"
              fullWidth
            />
          </View>

          {/* Back Button */}
          <TouchableOpacity
            className="mt-4"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-center text-blue-600 font-medium">
              Volver
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
