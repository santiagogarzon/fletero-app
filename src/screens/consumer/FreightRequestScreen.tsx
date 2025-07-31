import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { useFreightStore } from "../../store/freightStore";
import { useAuthStore } from "../../store/authStore";
import {
  calculateTotalVolume,
  formatVolume,
} from "../../utils/volumeCalculator";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { cn } from "../../utils/cn";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { ENV } from "../../config/env";
import { DEFAULT_LOCATION } from "../../config/locations";
import type {
  Location as LocationType,
  FreightRequest,
  FreightItem,
} from "../../types";

interface FormData {
  propertyType: "house" | "apartment";
  needsHelp: boolean;
  elevator: "none" | "small" | "large";
  stairs: "easy" | "narrow" | "difficult";
  items: {
    boxes: {
      small: number;
      medium: number;
      large: number;
    };
    fridge: number;
    bed: number;
    mattress: number;
    table: number;
    chairs: number;
    washingMachine: number;
    sofa: number;
    tv: number;
    desk: number;
    wardrobe: number;
    other: string;
    otherItems: Array<{
      name: string;
      quantity: number;
      dimensions: string;
    }>;
  };
  origin: LocationType | null;
  destination: LocationType | null;
  preferredDate: Date;
  preferredTime: Date;
  notes: string;
}

interface SearchResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export default function FreightRequestScreen() {
  const navigation = useNavigation();
  const { createRequest } = useFreightStore();
  const { user } = useAuthStore();

  // Search states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchTimeoutRef, setSearchTimeoutRef] =
    React.useState<NodeJS.Timeout | null>(null);

  // Current location state
  const [currentLocation, setCurrentLocation] =
    React.useState<LocationType | null>(null);
  const [isGettingLocation, setIsGettingLocation] = React.useState(false);

  // Modal states
  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const [searchType, setSearchType] = React.useState<"origin" | "destination">(
    "origin"
  );
  const [showOtherItemModal, setShowOtherItemModal] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  // Temporary states for date/time pickers
  const [tempDate, setTempDate] = React.useState<Date>(new Date());
  const [tempTime, setTempTime] = React.useState<Date>(new Date());

  // Other item modal states
  const [newOtherItem, setNewOtherItem] = React.useState({
    name: "",
    quantity: 1,
    dimensions: "",
  });

  const [formData, setFormData] = React.useState<FormData>({
    propertyType: "house",
    needsHelp: false,
    elevator: "none",
    stairs: "easy",
    items: {
      boxes: { small: 0, medium: 0, large: 0 },
      fridge: 0,
      bed: 0,
      mattress: 0,
      table: 0,
      chairs: 0,
      washingMachine: 0,
      sofa: 0,
      tv: 0,
      desk: 0,
      wardrobe: 0,
      other: "",
      otherItems: [],
    },
    origin: null,
    destination: null,
    preferredDate: new Date(),
    preferredTime: new Date(),
    notes: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [mapType, setMapType] = React.useState<"origin" | "destination">(
    "origin"
  );

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef) {
        clearTimeout(searchTimeoutRef);
      }
    };
  }, [searchTimeoutRef]);

  // Get current location on component mount
  React.useEffect(() => {
    getCurrentLocationOnMount();
  }, []);

  // Get current location on mount
  const getCurrentLocationOnMount = async () => {
    try {
      console.log("📍 Getting current location on mount...");
      setIsGettingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("❌ Location permission denied");
        setIsGettingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      console.log("📍 Current location obtained:", location.coords);

      // Reverse geocode to get address
      const geocodeResult = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocodeResult.length > 0) {
        const address = geocodeResult[0];
        const currentLoc: LocationType = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${address.street || ""} ${address.streetNumber || ""}, ${
            address.city || ""
          }, ${address.region || ""}`.trim(),
          city: address.city || "Buenos Aires",
          province: address.region || "Buenos Aires",
          postalCode: address.postalCode || "",
        };

        setCurrentLocation(currentLoc);
        console.log("📍 Current location set:", currentLoc);
      } else {
        // Fallback to coordinates only
        const currentLoc: LocationType = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `Ubicación actual (${location.coords.latitude.toFixed(
            4
          )}, ${location.coords.longitude.toFixed(4)})`,
          city: "Buenos Aires",
          province: "Buenos Aires",
          postalCode: "",
        };
        setCurrentLocation(currentLoc);
        console.log("📍 Current location set (fallback):", currentLoc);
      }
    } catch (error) {
      console.error("❌ Error getting current location:", error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Update temp states when form data changes
  React.useEffect(() => {
    if (formData.preferredDate) {
      setTempDate(formData.preferredDate);
    }
    if (formData.preferredTime) {
      setTempTime(formData.preferredTime);
    }
  }, [formData.preferredDate, formData.preferredTime]);

  // Handle date confirmation
  const handleDateConfirm = () => {
    updateFormData("preferredDate", tempDate);
    setShowDatePicker(false);
  };

  // Handle time confirmation
  const handleTimeConfirm = () => {
    updateFormData("preferredTime", tempTime);
    setShowTimePicker(false);
  };

  // Handle date picker open
  const handleDatePickerOpen = () => {
    setTempDate(formData.preferredDate || new Date());
    setShowDatePicker(true);
  };

  // Handle time picker open
  const handleTimePickerOpen = () => {
    setTempTime(formData.preferredTime || new Date());
    setShowTimePicker(true);
  };

  // Calculate total volume
  const totalVolume = React.useMemo(() => {
    const items: FreightItem[] = [];

    // Add boxes by size
    if (formData.items.boxes.small > 0) {
      items.push({
        type: "box",
        quantity: formData.items.boxes.small,
        size: "small",
      });
    }
    if (formData.items.boxes.medium > 0) {
      items.push({
        type: "box",
        quantity: formData.items.boxes.medium,
        size: "medium",
      });
    }
    if (formData.items.boxes.large > 0) {
      items.push({
        type: "box",
        quantity: formData.items.boxes.large,
        size: "large",
      });
    }

    // Add other items
    if (formData.items.fridge > 0)
      items.push({ type: "fridge", quantity: formData.items.fridge });
    if (formData.items.bed > 0)
      items.push({ type: "bed", quantity: formData.items.bed });
    if (formData.items.mattress > 0)
      items.push({ type: "mattress", quantity: formData.items.mattress });
    if (formData.items.table > 0)
      items.push({ type: "table", quantity: formData.items.table });
    if (formData.items.chairs > 0)
      items.push({ type: "chair", quantity: formData.items.chairs });
    if (formData.items.washingMachine > 0)
      items.push({
        type: "appliance",
        quantity: formData.items.washingMachine,
      });
    if (formData.items.sofa > 0)
      items.push({ type: "other", quantity: formData.items.sofa });
    if (formData.items.tv > 0)
      items.push({ type: "other", quantity: formData.items.tv });
    if (formData.items.desk > 0)
      items.push({ type: "other", quantity: formData.items.desk });
    if (formData.items.wardrobe > 0)
      items.push({ type: "other", quantity: formData.items.wardrobe });

    // Add custom other items
    formData.items.otherItems.forEach((item) => {
      items.push({
        type: "other",
        quantity: item.quantity,
        description: `${item.name} (${item.dimensions})`,
      });
    });

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

  const updateBoxes = (size: "small" | "medium" | "large", value: number) => {
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        boxes: { ...prev.items.boxes, [size]: value },
      },
    }));
  };

  const addOtherItem = () => {
    if (newOtherItem.name.trim() && newOtherItem.quantity > 0) {
      setFormData((prev) => ({
        ...prev,
        items: {
          ...prev.items,
          otherItems: [...prev.items.otherItems, { ...newOtherItem }],
        },
      }));
      setNewOtherItem({ name: "", quantity: 1, dimensions: "" });
      setShowOtherItemModal(false);
    }
  };

  const removeOtherItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        otherItems: prev.items.otherItems.filter((_, i) => i !== index),
      },
    }));
  };

  // Handle location selection
  const handleLocationSelect = async (location: LocationType) => {
    if (searchType === "origin") {
      updateFormData("origin", location);
    } else {
      updateFormData("destination", location);
    }
  };

  // Search places using Places API (New)
  const searchPlaces = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    console.log("🔍 Searching for:", query);
    console.log("🔑 API Key:", ENV.GOOGLE_MAPS_API_KEY);
    console.log("📍 Current location:", currentLocation);

    try {
      // Use current location if available, otherwise use default
      const searchLocation = currentLocation || DEFAULT_LOCATION;

      const requestBody = {
        textQuery: query,
        languageCode: "es",
        regionCode: "AR",
        maxResultCount: 5,
        locationBias: {
          circle: {
            center: {
              latitude: searchLocation.latitude,
              longitude: searchLocation.longitude,
            },
            radius: 50000.0, // 50km radius
          },
        },
      };

      console.log("📤 Request body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(
        `https://places.googleapis.com/v1/places:searchText`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": ENV.GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,places.id,places.location",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("📥 Response status:", response.status);
      console.log(
        "📥 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      const data = await response.json();
      console.log("📥 Response data:", JSON.stringify(data, null, 2));

      if (data.error) {
        console.error("❌ Places API Error:", data.error);
        return;
      }

      if (data.places) {
        console.log("✅ Found places:", data.places.length);
        const results: SearchResult[] = data.places.map((place: any) => ({
          place_id: place.id,
          description: place.formattedAddress || place.displayName?.text || "",
          structured_formatting: {
            main_text: place.displayName?.text || "",
            secondary_text: place.formattedAddress || "",
          },
        }));
        console.log("🎯 Processed results:", results);
        setSearchResults(results);
        console.log(
          "📱 Updated searchResults state with",
          results.length,
          "items"
        );
      } else {
        console.log("⚠️ No places found in response");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("❌ Error searching places:", error);
      setSearchResults([]);
    }
  };

  // Debug: Log when searchResults changes
  React.useEffect(() => {
    console.log("🔄 searchResults changed:", searchResults.length, "items");
    console.log("🔄 searchResults content:", searchResults);
  }, [searchResults]);

  // Debug: Log render
  React.useEffect(() => {
    console.log("🎨 Rendering search results:", searchResults.length, "items");
    console.log("🔍 Modal state - showSearchModal:", showSearchModal);
    console.log("🔍 Modal state - searchType:", searchType);
    console.log("🔍 Modal state - isSearching:", isSearching);
  });

  // Debug: Log when modal state changes
  React.useEffect(() => {
    console.log("🚪 Modal state changed - showSearchModal:", showSearchModal);
  }, [showSearchModal]);

  // Handle search input with debounce
  const handleSearchInput = (text: string) => {
    console.log("📝 Input changed:", text);
    setSearchQuery(text);
    setIsSearching(true);

    // Clear previous timeout
    if (searchTimeoutRef) {
      console.log("⏰ Clearing previous timeout");
      clearTimeout(searchTimeoutRef);
    }

    // Set new timeout for 3 seconds
    const timeout = setTimeout(() => {
      console.log("⏰ Timeout triggered, searching for:", text);
      searchPlaces(text);
      setIsSearching(false);
    }, 3000);

    console.log("⏰ Set new timeout for 3 seconds");
    setSearchTimeoutRef(timeout);
  };

  // Get place details
  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=location,formattedAddress`,
        {
          headers: {
            "X-Goog-Api-Key": ENV.GOOGLE_MAPS_API_KEY,
          },
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error("Place Details Error:", data.error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error getting place details:", error);
      return null;
    }
  };

  // Handle place selection
  const handlePlaceSelect = async (place: SearchResult) => {
    try {
      const details = await getPlaceDetails(place.place_id);

      if (details && details.location) {
        const location: LocationType = {
          latitude: details.location.latitude,
          longitude: details.location.longitude,
          address: details.formattedAddress || place.description,
          city: "Buenos Aires", // Default, could be extracted from address
          province: "Buenos Aires",
          postalCode: "",
        };

        handleLocationSelect(location);
        setShowSearchModal(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error getting place details:", error);
      Alert.alert("Error", "No se pudo obtener los detalles de la ubicación");
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos requeridos",
          "Necesitamos acceso a tu ubicación para obtener tu dirección actual."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const currentLocation: LocationType = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${address[0].street}, ${address[0].city}, ${address[0].region}`,
          city: address[0].city || "Buenos Aires",
          province: address[0].region || "Buenos Aires",
          postalCode: address[0].postalCode || "",
        };
        handleLocationSelect(currentLocation);
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert(
        "Error",
        "No se pudo obtener tu ubicación actual. Por favor, selecciona manualmente."
      );
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.origin) {
      newErrors.origin = "Selecciona el origen";
    }

    if (!formData.destination) {
      newErrors.destination = "Selecciona el destino";
    }

    const totalItems =
      formData.items.boxes.small +
      formData.items.boxes.medium +
      formData.items.boxes.large +
      formData.items.fridge +
      formData.items.bed +
      formData.items.mattress +
      formData.items.table +
      formData.items.chairs +
      formData.items.washingMachine +
      formData.items.sofa +
      formData.items.tv +
      formData.items.desk +
      formData.items.wardrobe +
      formData.items.otherItems.length;

    if (totalItems === 0) {
      newErrors.items = "Selecciona al menos un item para transportar";
    }

    if (formData.preferredDate < new Date()) {
      newErrors.preferredDate = "La fecha debe ser futura";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!user) {
      Alert.alert("Error", "Debes estar autenticado para crear una solicitud");
      return;
    }

    // setIsLoading(true); // This line was removed as per the edit hint
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
          ...(formData.items.boxes.small > 0
            ? [
                {
                  type: "box",
                  quantity: formData.items.boxes.small,
                  size: "small",
                },
              ]
            : []),
          ...(formData.items.boxes.medium > 0
            ? [
                {
                  type: "box",
                  quantity: formData.items.boxes.medium,
                  size: "medium",
                },
              ]
            : []),
          ...(formData.items.boxes.large > 0
            ? [
                {
                  type: "box",
                  quantity: formData.items.boxes.large,
                  size: "large",
                },
              ]
            : []),
          ...(formData.items.fridge > 0
            ? [{ type: "fridge", quantity: formData.items.fridge }]
            : []),
          ...(formData.items.bed > 0
            ? [{ type: "bed", quantity: formData.items.bed }]
            : []),
          ...(formData.items.mattress > 0
            ? [{ type: "mattress", quantity: formData.items.mattress }]
            : []),
          ...(formData.items.table > 0
            ? [{ type: "table", quantity: formData.items.table }]
            : []),
          ...(formData.items.chairs > 0
            ? [{ type: "chair", quantity: formData.items.chairs }]
            : []),
          ...(formData.items.washingMachine > 0
            ? [{ type: "appliance", quantity: formData.items.washingMachine }]
            : []),
          ...(formData.items.sofa > 0
            ? [{ type: "other", quantity: formData.items.sofa }]
            : []),
          ...(formData.items.tv > 0
            ? [{ type: "other", quantity: formData.items.tv }]
            : []),
          ...(formData.items.desk > 0
            ? [{ type: "other", quantity: formData.items.desk }]
            : []),
          ...(formData.items.wardrobe > 0
            ? [{ type: "other", quantity: formData.items.wardrobe }]
            : []),
          ...formData.items.otherItems.map((item) => ({
            type: "other" as const,
            quantity: item.quantity,
            description: `${item.name} (${item.dimensions})`,
          })),
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
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la solicitud");
    } finally {
      // setIsLoading(false); // This line was removed as per the edit hint
    }
  };

  const renderPropertyTypeSection = () => (
    <Card className="mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Tipo de Propiedad
      </Text>
      <View className="space-y-3">
        <TouchableOpacity
          className="flex-row items-center p-3 bg-gray-50 rounded-lg"
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
          className="flex-row items-center p-3 bg-gray-50 rounded-lg"
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

        {formData.propertyType === "apartment" && (
          <View className="mt-4 space-y-3">
            <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Text className="text-gray-700 font-medium flex-1 mr-3">
                ¿Necesitas ayuda para cargar?
              </Text>
              <Switch
                trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
                thumbColor={formData.needsHelp ? "#ffffff" : "#ffffff"}
                ios_backgroundColor="#e5e7eb"
                onValueChange={() =>
                  updateFormData("needsHelp", !formData.needsHelp)
                }
                value={formData.needsHelp}
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Ascensor:</Text>
              <View className="flex-row space-x-2">
                {["none", "small", "large"].map((elevator) => (
                  <TouchableOpacity
                    key={elevator}
                    className={`flex-1 p-2 rounded border ${
                      formData.elevator === elevator
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onPress={() => updateFormData("elevator", elevator)}
                  >
                    <Text
                      className={`text-center text-sm ${
                        formData.elevator === elevator
                          ? "text-blue-700"
                          : "text-gray-600"
                      }`}
                    >
                      {elevator === "none"
                        ? "Ninguno"
                        : elevator === "small"
                        ? "Pequeño"
                        : "Grande"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Escaleras:</Text>
              <View className="flex-row space-x-2">
                {["easy", "narrow", "difficult"].map((stairs) => (
                  <TouchableOpacity
                    key={stairs}
                    className={`flex-1 p-2 rounded border ${
                      formData.stairs === stairs
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onPress={() => updateFormData("stairs", stairs)}
                  >
                    <Text
                      className={`text-center text-sm ${
                        formData.stairs === stairs
                          ? "text-blue-700"
                          : "text-gray-600"
                      }`}
                    >
                      {stairs === "easy"
                        ? "Fácil"
                        : stairs === "narrow"
                        ? "Angosta"
                        : "Difícil"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    </Card>
  );

  const renderItemsSection = () => (
    <Card className="mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Items a Transportar
      </Text>

      <View className="space-y-4">
        {/* Boxes Section */}
        <View>
          <Text className="text-md font-medium text-gray-700 mb-3">Cajas</Text>
          <View className="space-y-3">
            {[
              { key: "small", label: "Cajas Pequeñas", icon: "cube-outline" },
              { key: "medium", label: "Cajas Medianas", icon: "cube" },
              { key: "large", label: "Cajas Grandes", icon: "cube" },
            ].map((box) => (
              <View
                key={box.key}
                className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <View className="flex-row items-center">
                  <Ionicons name={box.icon as any} size={20} color="#6b7280" />
                  <Text className="ml-3 text-gray-900">{box.label}</Text>
                </View>
                <View className="flex-row items-center space-x-2">
                  <TouchableOpacity
                    onPress={() =>
                      updateBoxes(
                        box.key as any,
                        Math.max(0, formData.items.boxes[box.key as any] - 1)
                      )
                    }
                    className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                  >
                    <Ionicons name="remove" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <Text className="w-8 text-center font-semibold">
                    {formData.items.boxes[box.key as any]}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      updateBoxes(
                        box.key as any,
                        formData.items.boxes[box.key as any] + 1
                      )
                    }
                    className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
                  >
                    <Ionicons name="add" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Furniture and Appliances */}
        <View>
          <Text className="text-md font-medium text-gray-700 mb-3">
            Muebles y Electrodomésticos
          </Text>
          <View className="space-y-2">
            {[
              { key: "fridge", label: "Heladera", icon: "snow-outline" },
              { key: "bed", label: "Cama", icon: "bed-outline" },
              { key: "mattress", label: "Colchón", icon: "bed-outline" },
              { key: "table", label: "Mesa", icon: "grid-outline" },
              { key: "chairs", label: "Sillas", icon: "person-outline" },
              {
                key: "washingMachine",
                label: "Lavarropas",
                icon: "water-outline",
              },
              { key: "sofa", label: "Sofá", icon: "home-outline" },
              { key: "tv", label: "TV", icon: "tv-outline" },
              { key: "desk", label: "Escritorio", icon: "desktop-outline" },
              { key: "wardrobe", label: "Ropero", icon: "shirt-outline" },
            ].map((item) => (
              <View
                key={item.key}
                className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <View className="flex-row items-center">
                  <Ionicons name={item.icon as any} size={20} color="#6b7280" />
                  <Text className="ml-3 text-gray-900">{item.label}</Text>
                </View>
                <View className="flex-row items-center space-x-2">
                  <TouchableOpacity
                    onPress={() =>
                      updateItems(
                        item.key,
                        Math.max(
                          0,
                          (formData.items[
                            item.key as keyof typeof formData.items
                          ] as number) - 1
                        )
                      )
                    }
                    className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                  >
                    <Ionicons name="remove" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <Text className="w-8 text-center font-semibold">
                    {
                      formData.items[
                        item.key as keyof typeof formData.items
                      ] as number
                    }
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      updateItems(
                        item.key,
                        (formData.items[
                          item.key as keyof typeof formData.items
                        ] as number) + 1
                      )
                    }
                    className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
                  >
                    <Ionicons name="add" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Other Items */}
        <View>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-md font-medium text-gray-700">
              Otros Items
            </Text>
            <TouchableOpacity
              onPress={() => setShowOtherItemModal(true)}
              className="flex-row items-center bg-blue-500 px-3 py-1 rounded-full"
            >
              <Ionicons name="add" size={16} color="white" />
              <Text className="text-white text-sm ml-1">Agregar</Text>
            </TouchableOpacity>
          </View>

          {formData.items.otherItems.length > 0 && (
            <View className="space-y-2">
              {formData.items.otherItems.map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900">
                      {item.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Cantidad: {item.quantity} | Dimensiones: {item.dimensions}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeOtherItem(index)}
                    className="ml-2 p-1"
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

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
        Ubicación
      </Text>

      <View className="space-y-4">
        <TouchableOpacity
          className="p-4 border border-gray-300 rounded-lg"
          onPress={() => {
            setSearchType("origin");
            setShowSearchModal(true);
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="location" size={20} color="#3b82f6" />
              <Text className="ml-2 text-gray-900">Origen</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
          <Text className="mt-1 text-gray-600">
            {formData.origin ? formData.origin.address : "Seleccionar origen"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="p-4 border border-gray-300 rounded-lg"
          onPress={() => {
            setSearchType("destination");
            setShowSearchModal(true);
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="location" size={20} color="#ef4444" />
              <Text className="ml-2 text-gray-900">Destino</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
          <Text className="mt-1 text-gray-600">
            {formData.destination
              ? formData.destination.address
              : "Seleccionar destino"}
          </Text>
        </TouchableOpacity>

        {errors.origin && (
          <Text className="text-red-600 text-sm">{errors.origin}</Text>
        )}
        {errors.destination && (
          <Text className="text-red-600 text-sm">{errors.destination}</Text>
        )}
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
          className="p-4 border border-gray-300 rounded-lg"
          onPress={handleDatePickerOpen}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={20} color="#3b82f6" />
              <Text className="ml-2 text-gray-900">Fecha</Text>
            </View>
            <Text className="text-gray-600">
              {formatDate(formData.preferredDate)}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="p-4 border border-gray-300 rounded-lg"
          onPress={handleTimePickerOpen}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="time" size={20} color="#3b82f6" />
              <Text className="ml-2 text-gray-900">Hora</Text>
            </View>
            <Text className="text-gray-600">
              {formatTime(formData.preferredTime)}
            </Text>
          </View>
        </TouchableOpacity>

        {errors.preferredDate && (
          <Text className="text-red-600 text-sm">{errors.preferredDate}</Text>
        )}
      </View>
    </Card>
  );

  const renderSearchModal = () => (
    <Modal
      visible={showSearchModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => setShowSearchModal(false)}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            {searchType === "origin" ? "Buscar Origen" : "Buscar Destino"}
          </Text>
          <TouchableOpacity onPress={getCurrentLocation}>
            <Ionicons name="locate" size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 p-4" style={{ backgroundColor: "#f9f9f9" }}>
          <TextInput
            className="p-3 border border-gray-300 rounded-lg mb-4 bg-white"
            placeholder="Buscar dirección..."
            value={searchQuery}
            onChangeText={handleSearchInput}
            autoFocus
          />

          {/* Debug indicator */}
          <View className="bg-yellow-100 p-2 rounded mb-2">
            <Text className="text-xs text-yellow-800">
              🔍 Debug: Modal abierto | Resultados: {searchResults.length} |
              Buscando: {isSearching ? "Sí" : "No"}
            </Text>
            <Text className="text-xs text-yellow-800 mt-1">
              📍 Centro de búsqueda:{" "}
              {currentLocation ? "Tu ubicación" : "Buenos Aires"}
            </Text>
          </View>

          {/* Current location indicator */}
          {currentLocation && (
            <View className="bg-green-100 p-3 rounded mb-2">
              <Text className="text-green-800 font-semibold mb-1">
                📍 Tu ubicación actual:
              </Text>
              <Text className="text-green-700 text-sm mb-2">
                {currentLocation.address}
              </Text>
              <TouchableOpacity
                className="bg-green-600 p-2 rounded"
                onPress={() => {
                  // Add current location to search input
                  setSearchQuery(currentLocation.address);
                  // Trigger search with current location
                  handleSearchInput(currentLocation.address);
                  console.log(
                    "📍 Using current location in search:",
                    currentLocation.address
                  );
                }}
              >
                <Text className="text-white text-center font-semibold">
                  Usar mi ubicación actual
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blue-600 p-2 rounded mt-2"
                onPress={() => {
                  // Use current location directly without search
                  handleLocationSelect(currentLocation);
                  setShowSearchModal(false);
                  console.log(
                    "📍 Using current location directly:",
                    currentLocation
                  );
                }}
              >
                <Text className="text-white text-center font-semibold">
                  Seleccionar directamente
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isGettingLocation && (
            <View className="bg-blue-100 p-3 rounded mb-2">
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text className="ml-2 text-blue-800">
                  Obteniendo tu ubicación...
                </Text>
              </View>
            </View>
          )}

          {!currentLocation && !isGettingLocation && (
            <View className="bg-gray-100 p-3 rounded mb-2">
              <Text className="text-gray-700 text-sm">
                💡 La búsqueda se centrará en Buenos Aires. Permite acceso a
                ubicación para resultados más precisos.
              </Text>
            </View>
          )}

          {isSearching && (
            <View className="flex-row items-center justify-center p-4 bg-white rounded mb-2">
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text className="ml-2 text-gray-600">Buscando...</Text>
            </View>
          )}

          <ScrollView
            className="flex-1"
            style={{ minHeight: 200, backgroundColor: "#f0f0f0" }}
          >
            {/* Debug: Show results count */}
            <View className="bg-blue-100 p-2 mb-2">
              <Text className="text-blue-800 font-bold">
                🔍 RESULTADOS ENCONTRADOS: {searchResults.length}
              </Text>
            </View>

            {searchResults.map((result, index) => (
              <TouchableOpacity
                key={result.place_id}
                className="p-3 border-b border-gray-200 bg-white m-2 rounded"
                onPress={() => handlePlaceSelect(result)}
              >
                <Text className="font-medium text-gray-900 text-lg">
                  {result.structured_formatting.main_text}
                </Text>
                <Text className="text-sm text-gray-600">
                  {result.structured_formatting.secondary_text}
                </Text>
                <Text className="text-xs text-blue-500 mt-1">
                  Toca para seleccionar
                </Text>
              </TouchableOpacity>
            ))}
            {searchResults.length === 0 &&
              searchQuery.length >= 3 &&
              !isSearching && (
                <View className="p-4 bg-red-100 rounded m-2">
                  <Text className="text-red-800 text-center font-bold">
                    ❌ No se encontraron resultados
                  </Text>
                </View>
              )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderOtherItemModal = () => (
    <Modal
      visible={showOtherItemModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => setShowOtherItemModal(false)}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            Agregar Item
          </Text>
          <TouchableOpacity onPress={addOtherItem}>
            <Text className="text-blue-500 font-semibold">Guardar</Text>
          </TouchableOpacity>
        </View>

        <View className="p-4 space-y-4">
          <View>
            <Text className="text-gray-700 mb-2">Nombre del Item</Text>
            <TextInput
              className="p-3 border border-gray-300 rounded-lg"
              placeholder="Ej: Piano, Escultura, etc."
              value={newOtherItem.name}
              onChangeText={(text) =>
                setNewOtherItem((prev) => ({ ...prev, name: text }))
              }
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Cantidad</Text>
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity
                onPress={() =>
                  setNewOtherItem((prev) => ({
                    ...prev,
                    quantity: Math.max(1, prev.quantity - 1),
                  }))
                }
                className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center"
              >
                <Ionicons name="remove" size={20} color="#6b7280" />
              </TouchableOpacity>
              <Text className="text-xl font-semibold w-12 text-center">
                {newOtherItem.quantity}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setNewOtherItem((prev) => ({
                    ...prev,
                    quantity: prev.quantity + 1,
                  }))
                }
                className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center"
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Dimensiones (opcional)</Text>
            <TextInput
              className="p-3 border border-gray-300 rounded-lg"
              placeholder="Ej: 1.5m x 0.8m x 0.6m"
              value={newOtherItem.dimensions}
              onChangeText={(text) =>
                setNewOtherItem((prev) => ({ ...prev, dimensions: text }))
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const openSearchModal = (type: "origin" | "destination") => {
    console.log("🚪 Opening search modal for:", type);
    setSearchType(type);
    setShowSearchModal(true);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View
        className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-white"
        style={{ paddingTop: 10 }}
      >
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
          loading={false} // isLoading was removed
          fullWidth
          size="large"
        />
      </ScrollView>

      {renderSearchModal()}
      {renderOtherItemModal()}

      {/* Date Picker - Centered */}
      {showDatePicker && (
        <Modal visible={showDatePicker} transparent={true} animationType="fade">
          <View className="flex-1 bg-black bg-opacity-50 items-center justify-center">
            <View className="bg-white rounded-lg p-6 mx-4 w-80">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-semibold text-gray-900">
                  Seleccionar Fecha
                </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setTempDate(selectedDate);
                  }
                }}
                minimumDate={new Date()}
              />
              <View className="flex-row space-x-3 mt-4">
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  className="flex-1 p-3 bg-gray-200 rounded-lg"
                >
                  <Text className="text-center font-medium text-gray-700">
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDateConfirm}
                  className="flex-1 p-3 bg-blue-500 rounded-lg"
                >
                  <Text className="text-center font-medium text-white">
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Time Picker - Centered */}
      {showTimePicker && (
        <Modal visible={showTimePicker} transparent={true} animationType="fade">
          <View className="flex-1 bg-black bg-opacity-50 items-center justify-center">
            <View className="bg-white rounded-lg p-6 mx-4 w-80">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-semibold text-gray-900">
                  Seleccionar Hora
                </Text>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempTime}
                mode="time"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setTempTime(selectedDate);
                  }
                }}
              />
              <View className="flex-row space-x-3 mt-4">
                <TouchableOpacity
                  onPress={() => setShowTimePicker(false)}
                  className="flex-1 p-3 bg-gray-200 rounded-lg"
                >
                  <Text className="text-center font-medium text-gray-700">
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleTimeConfirm}
                  className="flex-1 p-3 bg-blue-500 rounded-lg"
                >
                  <Text className="text-center font-medium text-white">
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
