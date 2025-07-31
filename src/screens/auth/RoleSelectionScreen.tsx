import * as React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";

export default function RoleSelectionScreen() {
  const navigation = useNavigation();
  const { updateUser } = useAuthStore();

  const handleRoleSelection = async (role: "consumer" | "driver") => {
    try {
      await updateUser({ role });

      if (role === "driver") {
        (navigation as any).navigate("DriverSetup");
      } else {
        (navigation as any).navigate("Main");
      }
    } catch (error: any) {
      Alert.alert("Error", "Error al actualizar el rol. Intenta nuevamente.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
          Selecciona tu rol
        </Text>
        <Text className="text-gray-600 text-center mb-12">
          ¿Cómo quieres usar la aplicación?
        </Text>

        <View className="space-y-6">
          <TouchableOpacity
            className="bg-white rounded-xl p-6 border-2 border-gray-200 items-center"
            onPress={() => handleRoleSelection("consumer")}
          >
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="person" size={32} color="#3b82f6" />
            </View>
            <Text className="text-xl font-semibold text-gray-900 mb-2">
              Consumidor
            </Text>
            <Text className="text-gray-600 text-center">
              Necesito transportar mis cosas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-xl p-6 border-2 border-gray-200 items-center"
            onPress={() => handleRoleSelection("driver")}
          >
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="car" size={32} color="#22c55e" />
            </View>
            <Text className="text-xl font-semibold text-gray-900 mb-2">
              Fletero
            </Text>
            <Text className="text-gray-600 text-center">
              Quiero ofrecer servicios de transporte
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="mt-8" onPress={() => navigation.goBack()}>
          <Text className="text-center text-blue-600 font-medium">Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
