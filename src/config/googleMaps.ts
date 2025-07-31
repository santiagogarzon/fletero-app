import { ENV } from './env';

// Google Maps API Configuration
export const GOOGLE_MAPS_CONFIG = {
  API_KEY: ENV.GOOGLE_MAPS_API_KEY,
  BASE_URL: 'https://places.googleapis.com/v1',
  LANGUAGE: 'es',
  COUNTRY: 'ar',
};

// API Endpoints for Places API (New)
export const GOOGLE_MAPS_ENDPOINTS = {
  PLACES_AUTOCOMPLETE: `${GOOGLE_MAPS_CONFIG.BASE_URL}/places:autocomplete`,
  PLACE_DETAILS: `${GOOGLE_MAPS_CONFIG.BASE_URL}/places`,
  GEOCODING: 'https://maps.googleapis.com/maps/api/geocode/json',
};

// Search parameters for Places Autocomplete (New API)
export const getAutocompleteParams = (input: string) => ({
  input: input,
  key: GOOGLE_MAPS_CONFIG.API_KEY,
  languageCode: GOOGLE_MAPS_CONFIG.LANGUAGE,
  regionCode: GOOGLE_MAPS_CONFIG.COUNTRY,
  types: ['geocode'],
  maxResultCount: 5,
});

// Place Details parameters (New API)
export const getPlaceDetailsParams = (placeId: string) => ({
  place_id: placeId,
  key: GOOGLE_MAPS_CONFIG.API_KEY,
  languageCode: GOOGLE_MAPS_CONFIG.LANGUAGE,
  fields: 'geometry,formattedAddress',
});

// Helper function to build URL with parameters for new API
export const buildApiUrl = (endpoint: string, params: Record<string, any>) => {
  if (endpoint.includes('places.googleapis.com')) {
    // For new Places API, we need to send as POST with JSON body
    return endpoint;
  } else {
    // For legacy APIs like geocoding
    const url = new URL(endpoint);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  }
};

// Error handling for Google Maps API
export const handleGoogleMapsError = (error: any, operation: string) => {
  console.error(`Google Maps API Error (${operation}):`, error);
  
  if (error.status === 'REQUEST_DENIED') {
    return 'API key inválida o API no habilitada. Habilita Places API (New) en Google Cloud Console.';
  } else if (error.status === 'OVER_QUERY_LIMIT') {
    return 'Límite de consultas excedido';
  } else if (error.status === 'ZERO_RESULTS') {
    return 'No se encontraron resultados';
  } else if (error.status === 'INVALID_REQUEST') {
    return 'Solicitud inválida';
  } else {
    return 'Error en la búsqueda de ubicaciones';
  }
}; 