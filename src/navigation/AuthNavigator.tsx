import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import RoleSelectionScreen from "../screens/auth/RoleSelectionScreen";
import DriverSetupScreen from "../screens/auth/DriverSetupScreen";
import FirebaseTestScreen from "../screens/FirebaseTestScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="DriverSetup" component={DriverSetupScreen} />
      <Stack.Screen
        name="FirebaseTest"
        component={FirebaseTestScreen}
        options={{ headerShown: true, title: "Firebase Test" }}
      />
    </Stack.Navigator>
  );
}
