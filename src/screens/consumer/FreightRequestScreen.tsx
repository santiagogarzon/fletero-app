import * as React from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { useFreightStore } from "../../store/freightStore";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Card from "../../components/Card";
import {
  calculateTotalVolume,
  formatVolume,
} from "../../utils/volumeCalculator";
import { formatDate, formatTime } from "../../utils/dateUtils";
import {
  FreightRequest,
  Location as LocationType,
  FreightItem,
} from "../../types";

interface FormData {
  propertyType: "house" | "apartment";
  needsHelp: boolean;
  elevator: "none" | "small" | "large";
  stairs: "easy" | "narrow" | "difficult";
  items: {
    boxes: number;
    fridge: boolean;
    bed: boolean;
    mattress: boolean;
    table: boolean;
    chairs: boolean;
    washingMachine: boolean;
    sofa: boolean;
    tv: boolean;
    desk: boolean;
    wardrobe: boolean;
    other: string;
  };
  origin: LocationType | null;
  destination: LocationType | null;
  preferredDate: Date;
  preferredTime: Date;
  notes: string;
}

export default function FreightRequestScreen() {
  const navigation = useNavigation();
  const { createRequest } = useFreightStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = React.useState<FormData>({
    propertyType: "house",
    needsHelp: false,
    elevator: "none",
    stairs: "easy",
    items: {
      boxes: 0,
      fridge: false,
      bed: false,
      mattress: false,
      table: false,
      chairs: false,
      washingMachine: false,
      sofa: false,
      tv: false,
      desk: false,
      wardrobe: false,
      other: "",
    },
    origin: null,
    destination: null,
    preferredDate: new Date(),
    preferredTime: new Date(),
    notes: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [showMap, setShowMap] = React.useState(false);
  const [mapType, setMapType] = React.useState<"origin" | "destination">(
    "origin"
  );

  // Calculate total volume
  const totalVolume = React.useMemo(() => {
    const items: FreightItem[] = [];

    if (formData.items.boxes > 0) {
      items.push({ type: "box", quantity: formData.items.boxes });
    }
    if (formData.items.fridge) items.push({ type: "fridge", quantity: 1 });
    if (formData.items.bed) items.push({ type: "bed", quantity: 1 });
    if (formData.items.mattress) items.push({ type: "mattress", quantity: 1 });
    if (formData.items.table) items.push({ type: "table", quantity: 1 });
    if (formData.items.chairs) items.push({ type: "chair", quantity: 1 });
    if (formData.items.washingMachine)
      items.push({ type: "appliance", quantity: 1 });
    if (formData.items.sofa) items.push({ type: "other", quantity: 1 });
    if (formData.items.tv) items.push({ type: "other", quantity: 1 });
    if (formData.items.desk) items.push({ type: "other", quantity: 1 });
    if (formData.items.wardrobe) items.push({ type: "other", quantity: 1 });

    return calculateTotalVolume(items);
  }, [formData.items]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const updateItems = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: { ...prev.items, [field]: value },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.origin) {
      newErrors.origin = "Selecciona el origen";
    }

    if (!formData.destination) {
      newErrors.destination = "Selecciona el destino";
    }

    if (totalVolume === 0) {
      newErrors.items = "Selecciona al menos un item para transportar";
    }

    if (formData.preferredDate < new Date()) {
      newErrors.preferredDate = "La fecha debe ser futura";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocationSelect = async (location: LocationType) => {
    if (mapType === "origin") {
      updateFormData("origin", location);
    } else {
      updateFormData("destination", location);
    }
    setShowMap(false);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permisos", "Se necesitan permisos de ubicación");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        const locationData: LocationType = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${addr.street || ""} ${addr.streetNumber || ""}`.trim(),
          city: addr.city || "",
          province: addr.region || "",
          postalCode: addr.postalCode || "",
        };

        if (mapType === "origin") {
          updateFormData("origin", locationData);
        } else {
          updateFormData("destination", locationData);
        }
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener la ubicación actual");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!user) {
      Alert.alert("Error", "Debes estar autenticado para crear una solicitud");
      return;
    }

    setIsLoading(true);
    try {
      const freightRequest: Partial<FreightRequest> = {
        consumerId: user.id,
        title: `Flete de ${formData.origin?.city} a ${formData.destination?.city}`,
        description: `Transporte de ${formatVolume(totalVolume)} de ${
          formData.origin?.address
        } a ${formData.destination?.address}`,
        origin: formData.origin!,
        destination: formData.destination!,
        items: [
          ...(formData.items.boxes > 0
            ? [{ type: "box", quantity: formData.items.boxes }]
            : []),
          ...(formData.items.fridge ? [{ type: "fridge", quantity: 1 }] : []),
          ...(formData.items.bed ? [{ type: "bed", quantity: 1 }] : []),
          ...(formData.items.mattress
            ? [{ type: "mattress", quantity: 1 }]
            : []),
          ...(formData.items.table ? [{ type: "table", quantity: 1 }] : []),
          ...(formData.items.chairs ? [{ type: "chair", quantity: 1 }] : []),
          ...(formData.items.washingMachine
            ? [{ type: "appliance", quantity: 1 }]
            : []),
          ...(formData.items.sofa ? [{ type: "other", quantity: 1 }] : []),
          ...(formData.items.tv ? [{ type: "other", quantity: 1 }] : []),
          ...(formData.items.desk ? [{ type: "other", quantity: 1 }] : []),
          ...(formData.items.wardrobe ? [{ type: "other", quantity: 1 }] : []),
        ],
        totalVolume,
        propertyType: formData.propertyType,
        needsHelp: formData.needsHelp,
        hasElevator: formData.elevator !== "none",
        preferredDate: formData.preferredDate,
        status: "pending",
        notes: formData.notes,
      };

      await createRequest(freightRequest);
      Alert.alert("Éxito", "Solicitud de flete creada exitosamente");
      (navigation as any).navigate("MyRequests");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al crear la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPropertyTypeSection = () => (
    <Card className="mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Tipo de Propiedad
      </Text>

      <View className="space-y-3">
        <TouchableOpacity
          className={`flex-row items-center p-3 rounded-lg border ${
            formData.propertyType === "house"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
          onPress={() => updateFormData("propertyType", "house")}
        >
          <Ionicons
            name={
              formData.propertyType === "house"
                ? "radio-button-on"
                : "radio-button-off"
            }
            size={20}
            color={formData.propertyType === "house" ? "#3b82f6" : "#6b7280"}
          />
          <Text className="ml-3 text-gray-900">Casa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-row items-center p-3 rounded-lg border ${
            formData.propertyType === "apartment"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
          onPress={() => updateFormData("propertyType", "apartment")}
        >
          <Ionicons
            name={
              formData.propertyType === "apartment"
                ? "radio-button-on"
                : "radio-button-off"
            }
            size={20}
            color={
              formData.propertyType === "apartment" ? "#3b82f6" : "#6b7280"
            }
          />
          <Text className="ml-3 text-gray-900">Departamento</Text>
        </TouchableOpacity>
      </View>

      {formData.propertyType === "apartment" && (
        <View className="mt-4 space-y-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-700">¿Necesitas ayuda para cargar?</Text>
            <TouchableOpacity
              onPress={() => updateFormData("needsHelp", !formData.needsHelp)}
              className={`w-12 h-6 rounded-full ${
                formData.needsHelp ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <View
                className={`w-5 h-5 bg-white rounded-full mt-0.5 ml-0.5 ${
                  formData.needsHelp ? "ml-6" : "ml-0.5"
                }`}
              />
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Ascensor</Text>
            <View className="flex-row space-x-2">
              {["none", "small", "large"].map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`px-3 py-2 rounded-lg border ${
                    formData.elevator === type
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onPress={() => updateFormData("elevator", type)}
                >
                  <Text
                    className={
                      formData.elevator === type
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  >
                    {type === "none"
                      ? "Ninguno"
                      : type === "small"
                      ? "Pequeño"
                      : "Grande"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Escaleras</Text>
            <View className="flex-row space-x-2">
              {["easy", "narrow", "difficult"].map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`px-3 py-2 rounded-lg border ${
                    formData.stairs === type
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onPress={() => updateFormData("stairs", type)}
                >
                  <Text
                    className={
                      formData.stairs === type
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  >
                    {type === "easy"
                      ? "Fácil"
                      : type === "narrow"
                      ? "Angosta"
                      : "Difícil"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </Card>
  );

  const renderItemsSection = () => (
    <Card className="mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Items a Transportar
      </Text>

      <View className="space-y-4">
        <Input
          label="Número de Cajas"
          placeholder="0"
          value={formData.items.boxes.toString()}
          onChangeText={(value) => updateItems("boxes", parseInt(value) || 0)}
          keyboardType="numeric"
          leftIcon="cube-outline"
        />

        <View>
          <Text className="text-gray-700 mb-3">
            Muebles y Electrodomésticos
          </Text>
          <View className="space-y-2">
            {[
              { key: "fridge", label: "Heladera", icon: "snow-outline" },
              { key: "bed", label: "Cama", icon: "bed-outline" },
              { key: "mattress", label: "Colchón", icon: "bed-outline" },
              { key: "table", label: "Mesa", icon: "restaurant-outline" },
              { key: "chairs", label: "Sillas", icon: "chair-outline" },
              {
                key: "washingMachine",
                label: "Lavarropas",
                icon: "water-outline",
              },
              { key: "sofa", label: "Sofá", icon: "couch-outline" },
              { key: "tv", label: "TV", icon: "tv-outline" },
              { key: "desk", label: "Escritorio", icon: "desktop-outline" },
              { key: "wardrobe", label: "Ropero", icon: "shirt-outline" },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
                onPress={() =>
                  updateItems(
                    item.key,
                    !formData.items[item.key as keyof typeof formData.items]
                  )
                }
              >
                <View className="flex-row items-center">
                  <Ionicons name={item.icon as any} size={20} color="#6b7280" />
                  <Text className="ml-3 text-gray-900">{item.label}</Text>
                </View>
                <Ionicons
                  name={
                    formData.items[item.key as keyof typeof formData.items]
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={20}
                  color={
                    formData.items[item.key as keyof typeof formData.items]
                      ? "#22c55e"
                      : "#6b7280"
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input
          label="Otros Items"
          placeholder="Especifica otros items..."
          value={formData.items.other}
          onChangeText={(value) => updateItems("other", value)}
          leftIcon="add-circle-outline"
        />

        <View className="p-4 bg-blue-50 rounded-lg">
          <Text className="text-lg font-semibold text-blue-900">
            Volumen Estimado: {formatVolume(totalVolume)}
          </Text>
          <Text className="text-sm text-blue-700 mt-1">
            Basado en los items seleccionados
          </Text>
        </View>
      </View>
    </Card>
  );

  const renderLocationSection = () => (
    <Card className="mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Ubicaciones
      </Text>

      <View className="space-y-4">
        {/* Origin */}
        <View>
          <Text className="text-gray-700 mb-2">Origen</Text>
          <TouchableOpacity
            className={`p-3 border rounded-lg ${
              errors.origin ? "border-red-500" : "border-gray-300"
            }`}
            onPress={() => {
              setMapType("origin");
              setShowMap(true);
            }}
          >
            {formData.origin ? (
              <View>
                <Text className="text-gray-900 font-medium">
                  {formData.origin.address}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {formData.origin.city}, {formData.origin.province}
                </Text>
              </View>
            ) : (
              <Text className="text-gray-500">Seleccionar origen</Text>
            )}
          </TouchableOpacity>
          {errors.origin && (
            <Text className="text-red-500 text-sm mt-1">{errors.origin}</Text>
          )}
        </View>

        {/* Destination */}
        <View>
          <Text className="text-gray-700 mb-2">Destino</Text>
          <TouchableOpacity
            className={`p-3 border rounded-lg ${
              errors.destination ? "border-red-500" : "border-gray-300"
            }`}
            onPress={() => {
              setMapType("destination");
              setShowMap(true);
            }}
          >
            {formData.destination ? (
              <View>
                <Text className="text-gray-900 font-medium">
                  {formData.destination.address}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {formData.destination.city}, {formData.destination.province}
                </Text>
              </View>
            ) : (
              <Text className="text-gray-500">Seleccionar destino</Text>
            )}
          </TouchableOpacity>
          {errors.destination && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.destination}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );

  const renderDateTimeSection = () => (
    <Card className="mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Fecha y Hora Preferida
      </Text>

      <View className="space-y-4">
        <TouchableOpacity
          className={`p-3 border rounded-lg ${
            errors.preferredDate ? "border-red-500" : "border-gray-300"
          }`}
          onPress={() => setShowDatePicker(true)}
        >
          <Text className="text-gray-700 mb-1">Fecha</Text>
          <Text className="text-gray-900">
            {formatDate(formData.preferredDate)}
          </Text>
        </TouchableOpacity>
        {errors.preferredDate && (
          <Text className="text-red-500 text-sm">{errors.preferredDate}</Text>
        )}

        <TouchableOpacity
          className="p-3 border border-gray-300 rounded-lg"
          onPress={() => setShowTimePicker(true)}
        >
          <Text className="text-gray-700 mb-1">Hora</Text>
          <Text className="text-gray-900">
            {formatTime(formData.preferredTime)}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderMapModal = () => {
    if (!showMap) return null;

    return (
      <View className="absolute inset-0 bg-white z-50">
        <SafeAreaView className="flex-1">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowMap(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">
              Seleccionar {mapType === "origin" ? "Origen" : "Destino"}
            </Text>
            <TouchableOpacity onPress={getCurrentLocation}>
              <Ionicons name="locate" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <MapView
            className="flex-1"
            initialRegion={{
              latitude: -34.6037,
              longitude: -58.3816,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(e) => {
              const location: LocationType = {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
                address: "Dirección seleccionada",
                city: "Ciudad",
                province: "Provincia",
              };
              handleLocationSelect(location);
            }}
          >
            {formData.origin && (
              <Marker
                coordinate={{
                  latitude: formData.origin.latitude,
                  longitude: formData.origin.longitude,
                }}
                title="Origen"
                pinColor="green"
              />
            )}
            {formData.destination && (
              <Marker
                coordinate={{
                  latitude: formData.destination.latitude,
                  longitude: formData.destination.longitude,
                }}
                title="Destino"
                pinColor="red"
              />
            )}
          </MapView>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">
          Nueva Solicitud de Flete
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 p-4">
        {renderPropertyTypeSection()}
        {renderItemsSection()}
        {renderLocationSection()}
        {renderDateTimeSection()}

        <Card className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Notas Adicionales
          </Text>
          <Input
            placeholder="Agrega notas adicionales..."
            value={formData.notes}
            onChangeText={(value) => updateFormData("notes", value)}
            multiline
            numberOfLines={3}
            leftIcon="chatbubble-outline"
          />
        </Card>

        {errors.items && (
          <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <Text className="text-red-700 text-sm">{errors.items}</Text>
          </View>
        )}

        <Button
          title="Crear Solicitud de Flete"
          onPress={handleSubmit}
          loading={isLoading}
          fullWidth
          size="large"
        />
      </ScrollView>

      {renderMapModal()}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.preferredDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              updateFormData("preferredDate", selectedDate);
            }
          }}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={formData.preferredTime}
          mode="time"
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) {
              updateFormData("preferredTime", selectedDate);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
