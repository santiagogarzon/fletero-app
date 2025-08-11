import * as React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { useFreightStore } from "../../store/freightStore";
import Card from "../../components/Card";
import { formatDate } from "../../utils/dateUtils";

export default function FleteHomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { getJobsForUser } = useFreightStore();

  const userJobs = user ? getJobsForUser(user.id) : [];
  const recentJobs = userJobs.slice(0, 3);

  const quickActions = [
    {
      title: "Buscar Fletes",
      description: "Ver solicitudes disponibles",
      icon: "search-outline" as keyof typeof Ionicons.glyphMap,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      onPress: () => (navigation as any).navigate("AvailableRequests"),
    },
    {
      title: "Proponer Viaje",
      description: "Crear una propuesta",
      icon: "add-circle-outline" as keyof typeof Ionicons.glyphMap,
      color: "bg-green-100",
      iconColor: "text-green-600",
      onPress: () => (navigation as any).navigate("FreightRequest"),
    },
    {
      title: "Mis Trabajos",
      description: "Ver tus trabajos",
      icon: "briefcase-outline" as keyof typeof Ionicons.glyphMap,
      color: "bg-gray-100",
      iconColor: "text-gray-600",
      onPress: () => (navigation as any).navigate("MyJobs"),
    },
    {
      title: "Ganancias",
      description: "Revisar tus ingresos",
      icon: "wallet-outline" as keyof typeof Ionicons.glyphMap,
      color: "bg-yellow-100",
      iconColor: "text-yellow-600",
      onPress: () => (navigation as any).navigate("Earnings"),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">
            Hola, {user?.name?.split(" ")[0] || "Fletero"}
          </Text>
          <Text className="text-gray-600 mt-1">¿Listo para tu próximo viaje?</Text>
        </View>

        <View className="px-6 py-4">
          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </Text>
            <View className="space-y-3">
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={action.onPress}
                  className="bg-white rounded-lg p-4 border border-gray-200"
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-12 h-12 rounded-full ${action.color} items-center justify-center mr-4`}
                    >
                      <Ionicons
                        name={action.icon}
                        size={24}
                        className={action.iconColor}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {action.title}
                      </Text>
                      <Text className="text-gray-600">
                        {action.description}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#9ca3af"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Actividad Reciente
            </Text>
            {recentJobs.length > 0 ? (
              <View className="space-y-3">
                {recentJobs.map((job) => (
                  <Card key={job.id} variant="outlined" padding="small">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1">
                        <Text className="font-semibold text-gray-900">
                          Trabajo #{job.id.slice(-6)}
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          {formatDate(job.createdAt)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          (navigation as any).navigate("JobDetails", {
                            jobId: job.id,
                          })
                        }
                      >
                        <Text className="text-green-600 text-sm font-medium">
                          Ver Detalles
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                ))}
              </View>
            ) : (
              <Card variant="outlined" padding="medium">
                <View className="items-center py-4">
                  <Ionicons name="car-outline" size={48} color="#9ca3af" />
                  <Text className="text-gray-600 text-center mt-2">
                    No tienes trabajos recientes
                  </Text>
                  <Text className="text-gray-500 text-sm text-center mt-1">
                    Comienza proponiendo un viaje
                  </Text>
                </View>
              </Card>
            )}
          </View>

          {/* Stats */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Estadísticas
            </Text>
            <View className="flex-row space-x-3">
              <Card variant="outlined" padding="small" className="flex-1">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-600">
                    {
                      userJobs.filter((job) => job.status === "completed").length
                    }
                  </Text>
                  <Text className="text-gray-600 text-sm text-center">
                    Trabajos Completados
                  </Text>
                </View>
              </Card>
              <Card variant="outlined" padding="small" className="flex-1">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-yellow-600">
                    {
                      userJobs.filter((job) => job.status === "in_progress").length
                    }
                  </Text>
                  <Text className="text-gray-600 text-sm text-center">
                    En Progreso
                  </Text>
                </View>
              </Card>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

