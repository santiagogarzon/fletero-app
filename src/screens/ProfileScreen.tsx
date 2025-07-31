import * as React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import Button from "../components/Button";
import Card from "../components/Card";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, signOut, isLoading } = useAuthStore();

  const handleSignOut = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert("Error", "Error al cerrar sesión");
            }
          },
        },
      ]
    );
  };

  const handleConvertAccount = () => {
    (navigation as any).navigate("ConvertAnonymous");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4">
              <Ionicons name="person" size={40} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              {user?.name || "Usuario"}
            </Text>
            <Text className="text-gray-600">
              {user?.isAnonymous ? "Usuario Anónimo" : user?.email}
            </Text>
            {user?.isAnonymous && (
              <View className="mt-2 px-3 py-1 bg-yellow-100 rounded-full">
                <Text className="text-yellow-800 text-sm font-medium">
                  Cuenta Anónima
                </Text>
              </View>
            )}
          </View>

          {/* Anonymous User Notice */}
          {user?.isAnonymous && (
            <Card className="mb-6">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={24} color="#f59e0b" />
                <View className="ml-3 flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-2">
                    Cuenta Anónima
                  </Text>
                  <Text className="text-gray-600 mb-4">
                    Estás usando la app como usuario anónimo. Para acceder a
                    todas las funciones, crea una cuenta completa.
                  </Text>
                  <Button
                    title="Crear Cuenta Completa"
                    onPress={handleConvertAccount}
                    fullWidth
                  />
                </View>
              </View>
            </Card>
          )}

          {/* Profile Options */}
          <Card className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Información Personal
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="person-outline" size={20} color="#6b7280" />
                  <Text className="text-gray-700 ml-3">Nombre</Text>
                </View>
                <Text className="text-gray-900">{user?.name}</Text>
              </View>

              {user?.email && (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="mail-outline" size={20} color="#6b7280" />
                    <Text className="text-gray-700 ml-3">Email</Text>
                  </View>
                  <Text className="text-gray-900">{user.email}</Text>
                </View>
              )}

              {user?.phone && (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="call-outline" size={20} color="#6b7280" />
                    <Text className="text-gray-700 ml-3">Teléfono</Text>
                  </View>
                  <Text className="text-gray-900">{user.phone}</Text>
                </View>
              )}

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="shield-outline" size={20} color="#6b7280" />
                  <Text className="text-gray-700 ml-3">Rol</Text>
                </View>
                <Text className="text-gray-900 capitalize">
                  {user?.role === "consumer" ? "Consumidor" : "Fletero"}
                </Text>
              </View>
            </View>
          </Card>

          {/* Account Actions */}
          <Card className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Acciones de Cuenta
            </Text>

            <View className="space-y-3">
              <TouchableOpacity className="flex-row items-center py-3">
                <Ionicons name="settings-outline" size={20} color="#6b7280" />
                <Text className="text-gray-700 ml-3 flex-1">Configuración</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center py-3">
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#6b7280"
                />
                <Text className="text-gray-700 ml-3 flex-1">
                  Notificaciones
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center py-3">
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#6b7280"
                />
                <Text className="text-gray-700 ml-3 flex-1">
                  Ayuda y Soporte
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </Card>

          {/* Sign Out Button */}
          <Button
            title="Cerrar Sesión"
            onPress={handleSignOut}
            variant="danger"
            fullWidth
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
