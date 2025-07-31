import * as React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { useFreightStore } from "../../store/freightStore";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { formatDate, formatRelativeTime } from "../../utils/dateUtils";

export default function ConsumerHomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { getJobsForUser, getFilteredRequests } = useFreightStore();

  const userJobs = user ? getJobsForUser(user.id) : [];
  const recentJobs = userJobs.slice(0, 3);

  const quickActions = [
    {
      title: "Nuevo Flete",
      description: "Solicitar un flete",
      icon: "add-circle-outline" as keyof typeof Ionicons.glyphMap,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      onPress: () => navigation.navigate("FreightRequest" as any),
    },
    {
      title: "Mis Fletes",
      description: "Ver mis solicitudes",
      icon: "list-outline" as keyof typeof Ionicons.glyphMap,
      color: "bg-gray-100",
      iconColor: "text-gray-600",
      onPress: () => navigation.navigate("MyRequests" as any),
    },
    {
      title: "Historial",
      description: "Ver trabajos completados",
      icon: "time-outline" as keyof typeof Ionicons.glyphMap,
      color: "bg-green-100",
      iconColor: "text-green-600",
      onPress: () => navigation.navigate("History" as any),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">
            ¡Hola, {user?.name?.split(" ")[0] || "Usuario"}!
          </Text>
          <Text className="text-gray-600 mt-1">
            ¿En qué podemos ayudarte hoy?
          </Text>
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
                          Flete #{job.id.slice(-6)}
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          {formatDate(job.createdAt)}
                        </Text>
                        <View className="flex-row items-center mt-2">
                          <View
                            className={`px-2 py-1 rounded-full ${
                              job.status === "completed"
                                ? "bg-green-100"
                                : job.status === "in_progress"
                                ? "bg-yellow-100"
                                : "bg-blue-100"
                            }`}
                          >
                            <Text
                              className={`text-xs font-medium ${
                                job.status === "completed"
                                  ? "text-green-700"
                                  : job.status === "in_progress"
                                  ? "text-yellow-700"
                                  : "text-blue-700"
                              }`}
                            >
                              {job.status === "completed"
                                ? "Completado"
                                : job.status === "in_progress"
                                ? "En Progreso"
                                : "Asignado"}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(
                            "JobDetails" as any,
                            { jobId: job.id } as never
                          )
                        }
                      >
                        <Text className="text-blue-600 text-sm font-medium">
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
                    No tienes fletes recientes
                  </Text>
                  <Text className="text-gray-500 text-sm text-center mt-1">
                    Crea tu primer flete para comenzar
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
                  <Text className="text-2xl font-bold text-blue-600">
                    {
                      userJobs.filter((job) => job.status === "completed")
                        .length
                    }
                  </Text>
                  <Text className="text-gray-600 text-sm text-center">
                    Fletes Completados
                  </Text>
                </View>
              </Card>
              <Card variant="outlined" padding="small" className="flex-1">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-yellow-600">
                    {
                      userJobs.filter((job) => job.status === "in_progress")
                        .length
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
