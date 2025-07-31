import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { cn } from "../utils/cn";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const baseClasses = "rounded-lg items-center justify-center";

  const variantClasses = {
    primary: "bg-blue-600 active:bg-blue-700",
    secondary: "bg-gray-600 active:bg-gray-700",
    outline: "border border-blue-600 bg-transparent",
    danger: "bg-red-600 active:bg-red-700",
  };

  const sizeClasses = {
    small: "px-3 py-2",
    medium: "px-4 py-3",
    large: "px-6 py-4",
  };

  const textClasses = {
    primary: "text-white font-semibold",
    secondary: "text-white font-semibold",
    outline: "text-blue-600 font-semibold",
    danger: "text-white font-semibold",
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const disabledClasses = disabled || loading ? "opacity-50" : "";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        fullWidth ? "w-full" : "",
        style
      )}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#2563eb" : "#ffffff"}
          size="small"
        />
      ) : (
        <Text
          className={cn(textClasses[variant], textSizeClasses[size], textStyle)}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
