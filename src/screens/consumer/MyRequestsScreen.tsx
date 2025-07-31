import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useFreightStore } from "../../store/freightStore";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { formatDate } from "../../utils/dateUtils";
import { formatVolume } from "../../utils/volumeCalculator";

export default function MyRequestsScreen() {
  const navigation = useNavigation();
  const { requests, loadUserRequests, isLoading } = useFreightStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      loadUserRequests(user.id);
    }
  }, [user]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (user) {
      await loadUserRequests(user.id);
    }
    setRefreshing(false);
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "in_progress":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "in_progress":
        return "En Progreso";
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const renderRequestCard = (request: any) => (
    <Card key={request.id} className="mb-4">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            {request.title}
          </Text>
          <Text className="text-gray-600 text-sm">
            {request.origin?.city} → {request.destination?.city}
          </Text>
        </View>
        <View
          className={`px-2 py-1 rounded-full ${getStatusColor(request.status)}`}
        >
          <Text
            className={`text-xs font-medium ${
              getStatusColor(request.status).split(" ")[0]
            }`}
          >
            {getStatusText(request.status)}
          </Text>
        </View>
      </View>

      <View className="space-y-2 mb-3">
        <View className="flex-row items-center">
          <Ionicons name="cube-outline" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-2">
            Volumen: {formatVolume(request.totalVolume)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-2">
            Fecha: {formatDate(request.preferredDate)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-2">
            {request.propertyType === "house" ? "Casa" : "Departamento"}
            {request.needsHelp && " • Necesita ayuda"}
          </Text>
        </View>
      </View>

      <View className="flex-row space-x-2">
        <TouchableOpacity
          className="flex-1 bg-blue-50 p-2 rounded-lg"
          onPress={() =>
            (navigation as any).navigate("RequestDetails", {
              requestId: request.id,
            })
          }
        >
          <Text className="text-blue-600 text-center text-sm font-medium">
            Ver Detalles
          </Text>
        </TouchableOpacity>

        {request.status === "pending" && (
          <TouchableOpacity
            className="flex-1 bg-red-50 p-2 rounded-lg"
            onPress={() => {
              // Handle cancel request
            }}
          >
            <Text className="text-red-600 text-center text-sm font-medium">
              Cancelar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-white">
        <Text className="text-xl font-bold text-gray-900">Mis Solicitudes</Text>
        <TouchableOpacity
          onPress={() => (navigation as any).navigate("FreightRequest")}
          className="bg-blue-500 p-2 rounded-lg"
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && requests.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Ionicons name="hourglass-outline" size={48} color="#6b7280" />
            <Text className="text-gray-600 mt-4">Cargando solicitudes...</Text>
          </View>
        ) : requests.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Ionicons name="document-outline" size={48} color="#6b7280" />
            <Text className="text-gray-600 mt-4 text-center">
              No tienes solicitudes de flete{"\n"}creadas aún
            </Text>
            <Button
              title="Crear Primera Solicitud"
              onPress={() => (navigation as any).navigate("FreightRequest")}
              fullWidth
              className="mt-4"
            />
          </View>
        ) : (
          <View>
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Solicitudes ({requests.length})
              </Text>
              <Text className="text-gray-600 text-sm">
                Gestiona tus solicitudes de transporte
              </Text>
            </View>

            {requests.map(renderRequestCard)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
