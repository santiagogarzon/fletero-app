import * as React from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function DriverSetupScreen() {
  const navigation = useNavigation();
  const { updateDriverProfile } = useAuthStore();

  const [formData, setFormData] = React.useState({
    vehicleType: "pickup",
    capacity: "",
    offersHelp: false,
    licensePlate: "",
    license: "",
    insurance: "",
    vehicleRegistration: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = "La patente es requerida";
    }

    if (!formData.license.trim()) {
      newErrors.license = "La licencia es requerida";
    }

    if (!formData.insurance.trim()) {
      newErrors.insurance = "El seguro es requerido";
    }

    if (!formData.vehicleRegistration.trim()) {
      newErrors.vehicleRegistration = "El registro del vehículo es requerido";
    }

    if (!formData.capacity || parseFloat(formData.capacity) <= 0) {
      newErrors.capacity = "La capacidad debe ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await updateDriverProfile({
        vehicleType: formData.vehicleType as "pickup" | "truck" | "van",
        capacity: parseFloat(formData.capacity),
        offersHelp: formData.offersHelp,
        licensePlate: formData.licensePlate,
        documents: {
          license: formData.license,
          insurance: formData.insurance,
          vehicleRegistration: formData.vehicleRegistration,
        },
      });

      Alert.alert("Éxito", "Perfil de fletero configurado correctamente");
      (navigation as any).navigate("Main");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al configurar el perfil");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 py-8">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            Configuración de Fletero
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            Completa la información de tu vehículo
          </Text>

          <View className="space-y-4">
            <Input
              label="Patente del Vehículo"
              placeholder="ABC 123"
              value={formData.licensePlate}
              onChangeText={(value) => updateFormData("licensePlate", value)}
              leftIcon="car-outline"
              error={errors.licensePlate}
            />

            <Input
              label="Capacidad (m³)"
              placeholder="2.5"
              value={formData.capacity}
              onChangeText={(value) => updateFormData("capacity", value)}
              keyboardType="numeric"
              leftIcon="cube-outline"
              error={errors.capacity}
            />

            <Input
              label="Número de Licencia"
              placeholder="12345678"
              value={formData.license}
              onChangeText={(value) => updateFormData("license", value)}
              leftIcon="card-outline"
              error={errors.license}
            />

            <Input
              label="Número de Seguro"
              placeholder="SEG-123456"
              value={formData.insurance}
              onChangeText={(value) => updateFormData("insurance", value)}
              leftIcon="shield-checkmark-outline"
              error={errors.insurance}
            />

            <Input
              label="Registro del Vehículo"
              placeholder="REG-123456"
              value={formData.vehicleRegistration}
              onChangeText={(value) =>
                updateFormData("vehicleRegistration", value)
              }
              leftIcon="document-text-outline"
              error={errors.vehicleRegistration}
            />
          </View>

          <View className="mt-8">
            <Button
              title="Completar Configuración"
              onPress={handleSubmit}
              fullWidth
              size="large"
            />
          </View>

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
