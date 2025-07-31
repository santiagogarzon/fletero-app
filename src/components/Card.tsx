import React from "react";
import { View, ViewProps } from "react-native";
import { cn } from "../utils/cn";

interface CardProps extends ViewProps {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "small" | "medium" | "large";
  children: React.ReactNode;
}

export default function Card({
  variant = "default",
  padding = "medium",
  className,
  children,
  ...props
}: CardProps) {
  const baseClasses = "rounded-lg";

  const variantClasses = {
    default: "bg-white",
    elevated: "bg-white shadow-lg",
    outlined: "bg-white border border-gray-200",
  };

  const paddingClasses = {
    none: "",
    small: "p-3",
    medium: "p-4",
    large: "p-6",
  };

  return (
    <View
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
