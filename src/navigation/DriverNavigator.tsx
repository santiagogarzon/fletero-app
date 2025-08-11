import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import FleteHomeScreen from "../screens/driver/FleteHomeScreen";
import AvailableRequestsScreen from "../screens/driver/AvailableRequestsScreen";
import MyJobsScreen from "../screens/driver/MyJobsScreen";
import EarningsScreen from "../screens/driver/EarningsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { DriverTabParamList } from "./types";

const Tab = createBottomTabNavigator<DriverTabParamList>();

export default function DriverNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "AvailableRequests") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "MyJobs") {
            iconName = focused ? "car" : "car-outline";
          } else if (route.name === "Earnings") {
            iconName = focused ? "wallet" : "wallet-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={FleteHomeScreen}
        options={{ title: "Inicio" }}
      />
      <Tab.Screen
        name="AvailableRequests"
        component={AvailableRequestsScreen}
        options={{ title: "Fletes" }}
      />
      <Tab.Screen
        name="MyJobs"
        component={MyJobsScreen}
        options={{ title: "Mis Trabajos" }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{ title: "Ganancias" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}
