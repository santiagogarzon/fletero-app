import * as React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/Button";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-6">
          {/* Logo */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4">
              <Ionicons name="car" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 text-center">
              Fletero
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Tu plataforma de transporte confiable
            </Text>
          </View>

          {/* Features */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text className="text-gray-700 ml-3">
                Transporte rápido y seguro
              </Text>
            </View>
            <View className="flex-row items-center mb-4">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text className="text-gray-700 ml-3">Precios transparentes</Text>
            </View>
            <View className="flex-row items-center mb-4">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text className="text-gray-700 ml-3">
                Seguimiento en tiempo real
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text className="text-gray-700 ml-3">
                Pagos seguros con MercadoPago
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-4">
            <Button
              title="Comenzar"
              onPress={() => (navigation as any).navigate("Register")}
              fullWidth
              size="large"
            />

            <Button
              title="Ya tengo cuenta"
              onPress={() => (navigation as any).navigate("Login")}
              variant="outline"
              fullWidth
            />

            {/* Debug button - remove in production */}
            <TouchableOpacity
              className="mt-4 p-2 bg-gray-100 rounded-lg"
              onPress={() => (navigation as any).navigate("FirebaseTest")}
            >
              <Text className="text-center text-gray-600 text-sm">
                🔧 Debug: Firebase Test
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
