import React from "react";
import { useAuthStore } from "../store/authStore";
import ConsumerNavigator from "./ConsumerNavigator";
import DriverNavigator from "./DriverNavigator";

export default function MainNavigator() {
  const { user } = useAuthStore();

  // Show consumer navigation by default, or based on user role
  const isDriver = user?.role === "driver";

  return isDriver ? <DriverNavigator /> : <ConsumerNavigator />;
}
