import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "../utils/cn";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}: InputProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-medium mb-2 text-sm">{label}</Text>
      )}

      <View className="relative">
        {leftIcon && (
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            <Ionicons name={leftIcon} size={20} color="#6b7280" />
          </View>
        )}

        <TextInput
          className={cn(
            "border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white",
            leftIcon && "pl-12",
            rightIcon && "pr-12",
            error && "border-red-500",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          )}
          placeholderTextColor="#9ca3af"
          style={style}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            className="absolute right-3 top-0 bottom-0 justify-center z-10"
          >
            <Ionicons name={rightIcon} size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
