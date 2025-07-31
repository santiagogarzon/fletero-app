import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ConsumerHomeScreen from "../screens/consumer/ConsumerHomeScreen";
import MyRequestsScreen from "../screens/consumer/MyRequestsScreen";
import HistoryScreen from "../screens/consumer/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { ConsumerTabParamList } from "./types";

const Tab = createBottomTabNavigator<ConsumerTabParamList>();

export default function ConsumerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "MyRequests") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3b82f6",
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
        component={ConsumerHomeScreen}
        options={{ title: "Inicio" }}
      />
      <Tab.Screen
        name="MyRequests"
        component={MyRequestsScreen}
        options={{ title: "Mis Fletes" }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "Historial" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}
