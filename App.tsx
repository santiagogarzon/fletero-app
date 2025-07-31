import * as React from "react";
import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import RootNavigator from "./src/navigation/RootNavigator";
import { useAuthStore } from "./src/store/authStore";

export default function App() {
  const { initializeAuth, isInitialized, isLoading } = useAuthStore();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      try {
        console.log("Initializing authentication...");
        unsubscribe = await initializeAuth();
        console.log("Authentication initialized successfully");
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        Toast.show({
          type: "error",
          text1: "Error de Autenticación",
          text2: "Error al inicializar la autenticación. Reinicia la app.",
        });
      }
    };

    // Only initialize if not already initialized
    if (!isInitialized) {
      initAuth();
    }

    // Cleanup function
    return () => {
      if (unsubscribe) {
        console.log("Cleaning up auth listener...");
        unsubscribe();
      }
    };
  }, [isInitialized]);

  // Show loading screen while auth is being initialized
  if (!isInitialized || isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#ffffff",
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: "#3b82f6",
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Ionicons name="car" size={40} color="white" />
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Fletero
            </Text>
            <Text
              style={{
                color: "#6b7280",
                marginBottom: 32,
                textAlign: "center",
              }}
            >
              Inicializando...
            </Text>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
