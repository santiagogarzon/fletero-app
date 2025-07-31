import * as React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FreightRequestScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Nuevo Flete
        </Text>
        <Text className="text-gray-600 text-center">
          Aquí podrás crear una nueva solicitud de flete
        </Text>
      </View>
    </SafeAreaView>
  );
}
