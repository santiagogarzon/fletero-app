import * as React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-6">
          <Ionicons name="car" size={40} color="white" />
        </View>

        <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
          Fletero
        </Text>

        <Text className="text-gray-600 text-center mb-8">Inicializando...</Text>

        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    </SafeAreaView>
  );
}
