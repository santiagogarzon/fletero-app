import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/authStore";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import FreightRequestScreen from "../screens/consumer/FreightRequestScreen";
import RequestDetailsScreen from "../screens/RequestDetailsScreen";
import OfferDetailsScreen from "../screens/OfferDetailsScreen";
import JobDetailsScreen from "../screens/JobDetailsScreen";
import LocationPickerScreen from "../screens/LocationPickerScreen";
import LoadingScreen from "../screens/LoadingScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, isInitialized, isLoading } = useAuthStore();

  // Show loading screen while auth is being initialized
  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  console.log("RootNavigator - Auth state:", {
    isAuthenticated,
    isInitialized,
    isLoading,
  });

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen
            name="FreightRequest"
            component={FreightRequestScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RequestDetails"
            component={RequestDetailsScreen}
            options={{ headerShown: true, title: "Detalles de Solicitud" }}
          />
          <Stack.Screen
            name="OfferDetails"
            component={OfferDetailsScreen}
            options={{ headerShown: true, title: "Detalles de Oferta" }}
          />
          <Stack.Screen
            name="JobDetails"
            component={JobDetailsScreen}
            options={{ headerShown: true, title: "Detalles de Trabajo" }}
          />
          <Stack.Screen
            name="LocationPicker"
            component={LocationPickerScreen}
            options={{ headerShown: true, title: "Seleccionar Ubicación" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
