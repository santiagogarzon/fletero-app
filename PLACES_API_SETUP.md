# Places API Setup Guide - @appandflow/react-native-google-autocomplete

Para que la librería `@appandflow/react-native-google-autocomplete` funcione correctamente, necesitas habilitar la **Places API** (no la nueva) en Google Cloud Console.

## 🚨 Problema Actual

```
No aparece autocompletado ni resultados de búsqueda
```

## ✅ Solución Paso a Paso

### 1. Ir a Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto: **281475340315**

### 2. Habilitar Places API (NO la nueva)

1. Ve a **"APIs y servicios"** > **"Biblioteca"**
2. Busca **"Places API"** (NO "Places API (New)")
3. Haz clic en **"Places API"**
4. Haz clic en **"HABILITAR"** (botón azul)

### 3. Enlace Directo

**Haz clic aquí para habilitar directamente:**
https://console.developers.google.com/apis/api/places-backend.googleapis.com/overview?project=281475340315

### 4. Verificar API Key

1. Ve a **"APIs y servicios"** > **"Credenciales"**
2. Verifica que tu API key tenga acceso a **Places API**
3. Si no tiene acceso, edita la API key y agrega **Places API**

### 5. Configurar Restricciones (Opcional)

Para mayor seguridad, configura restricciones en tu API key:

#### Restricciones de API:

- ✅ Places API ⭐ **IMPORTANTE**
- ✅ Geocoding API
- ✅ Maps JavaScript API

#### Restricciones de aplicación:

- **Android**: Agregar SHA-1 de tu app
- **iOS**: Agregar Bundle ID de tu app
- **Web**: Agregar dominio de tu app

## ⏱️ Tiempo de Espera

Después de habilitar la API, espera **2-3 minutos** para que los cambios se propaguen.

## 🧪 Prueba la API

Una vez habilitada, prueba con estas búsquedas:

- "Av. 9 de Julio"
- "Plaza de Mayo"
- "Palermo, Buenos Aires"

## 🔧 Configuración en el Código

El código ya está configurado para usar:

- ✅ **Librería**: `@appandflow/react-native-google-autocomplete`
- ✅ **API Key**: Configurada automáticamente
- ✅ **Debounce**: 3 segundos
- ✅ **Idioma**: Español
- ✅ **País**: Argentina
- ✅ **Mínimo**: 3 caracteres

## 📊 Diferencias de APIs

| Característica | Places API (Legacy)                          | Places API (New)                              |
| -------------- | -------------------------------------------- | --------------------------------------------- |
| Usada por      | @appandflow/react-native-google-autocomplete | Implementación manual                         |
| Endpoint       | `/maps/api/place/autocomplete`               | `/places.googleapis.com/v1/places:searchText` |
| Método         | GET                                          | POST                                          |
| Compatibilidad | Amplia                                       | Limitada                                      |
| Librerías      | Muchas                                       | Pocas                                         |

## 🆘 Troubleshooting

### No aparecen resultados

- **Solución**: Habilita Places API (NO la nueva)
- **Verifica**: Que la API key tenga acceso a Places API
- **Verifica**: Que hayas esperado 2-3 minutos

### Error: "This API project is not authorized"

- **Solución**: Habilita Places API en Google Cloud Console
- **Verifica**: Que la API key sea correcta

### Error: "REQUEST_DENIED"

- **Solución**: Verifica que la API esté habilitada
- **Verifica**: Que la API key tenga acceso

## 💰 Costos

- **Places API**: $17 por 1000 requests
- **Geocoding API**: $5 por 1000 requests
- **Maps JavaScript API**: Gratis hasta 25,000 cargas por mes

## 🔍 Debug

El código incluye logging para debug:

- API Key
- Search Error
- Is Searching
- Location Results
- Term

Revisa la consola para ver estos logs y diagnosticar problemas.

¡Una vez habilitada la Places API (legacy), la búsqueda de direcciones funcionará perfectamente! 🎉

**Nota**: La librería usa la Places API legacy, NO la nueva Places API (New).
