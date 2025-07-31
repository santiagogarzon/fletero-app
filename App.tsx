import * as React from "react";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import RootNavigator from "./src/navigation/RootNavigator";
import { useAuthStore } from "./src/store/authStore";

export default function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      try {
        unsubscribe = await initializeAuth();
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        Toast.show({
          type: "error",
          text1: "Error de Autenticación",
          text2: "Error al inicializar la autenticación. Reinicia la app.",
        });
      }
    };

    initAuth();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

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
