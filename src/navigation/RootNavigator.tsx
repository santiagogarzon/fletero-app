import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/authStore";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import FreightRequestScreen from "../screens/FreightRequestScreen";
import RequestDetailsScreen from "../screens/RequestDetailsScreen";
import OfferDetailsScreen from "../screens/OfferDetailsScreen";
import JobDetailsScreen from "../screens/JobDetailsScreen";
import LocationPickerScreen from "../screens/LocationPickerScreen";
import LoadingScreen from "../screens/LoadingScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
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
            options={{ headerShown: true, title: "Nuevo Flete" }}
          />
          <Stack.Screen
            name="RequestDetails"
            component={RequestDetailsScreen}
            options={{ headerShown: true, title: "Detalles del Flete" }}
          />
          <Stack.Screen
            name="OfferDetails"
            component={OfferDetailsScreen}
            options={{ headerShown: true, title: "Detalles de la Oferta" }}
          />
          <Stack.Screen
            name="JobDetails"
            component={JobDetailsScreen}
            options={{ headerShown: true, title: "Detalles del Trabajo" }}
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
