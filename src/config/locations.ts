// Default locations for Argentina
export const ARGENTINA_LOCATIONS = {
  // Buenos Aires (Capital)
  BUENOS_AIRES: {
    latitude: -34.6118,
    longitude: -58.3960,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: "Buenos Aires",
    province: "Buenos Aires",
  },
  
  // Córdoba
  CORDOBA: {
    latitude: -31.4201,
    longitude: -64.1888,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: "Córdoba",
    province: "Córdoba",
  },
  
  // Rosario
  ROSARIO: {
    latitude: -32.9468,
    longitude: -60.6393,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: "Rosario",
    province: "Santa Fe",
  },
  
  // Mendoza
  MENDOZA: {
    latitude: -32.8908,
    longitude: -68.8272,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: "Mendoza",
    province: "Mendoza",
  },
  
  // La Plata
  LA_PLATA: {
    latitude: -34.9205,
    longitude: -57.9536,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: "La Plata",
    province: "Buenos Aires",
  },
  
  // Tucumán
  TUCUMAN: {
    latitude: -26.8083,
    longitude: -65.2176,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: "San Miguel de Tucumán",
    province: "Tucumán",
  },
  
  // Mar del Plata
  MAR_DEL_PLATA: {
    latitude: -38.0004,
    longitude: -57.5562,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: "Mar del Plata",
    province: "Buenos Aires",
  },
  
  // Salta
  SALTA: {
    latitude: -24.7859,
    longitude: -65.4117,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: "Salta",
    province: "Salta",
  },
  
  // Santa Fe
  SANTA_FE: {
    latitude: -31.6488,
    longitude: -60.7087,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: "Santa Fe",
    province: "Santa Fe",
  },
  
  // San Juan
  SAN_JUAN: {
    latitude: -31.5375,
    longitude: -68.5364,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    name: "San Juan",
    province: "San Juan",
  },
};

// Default location (Buenos Aires)
export const DEFAULT_LOCATION = ARGENTINA_LOCATIONS.BUENOS_AIRES;

// Get location by name
export const getLocationByName = (name: string) => {
  const locationKey = Object.keys(ARGENTINA_LOCATIONS).find(
    key => ARGENTINA_LOCATIONS[key as keyof typeof ARGENTINA_LOCATIONS].name.toLowerCase() === name.toLowerCase()
  );
  
  return locationKey ? ARGENTINA_LOCATIONS[locationKey as keyof typeof ARGENTINA_LOCATIONS] : DEFAULT_LOCATION;
};

// Get all location names
export const getLocationNames = () => {
  return Object.values(ARGENTINA_LOCATIONS).map(location => location.name);
};

// Get locations by province
export const getLocationsByProvince = (province: string) => {
  return Object.values(ARGENTINA_LOCATIONS).filter(
    location => location.province.toLowerCase() === province.toLowerCase()
  );
}; 