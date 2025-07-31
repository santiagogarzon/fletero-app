# Google Maps API Setup (Updated)

Para que la búsqueda de direcciones funcione correctamente, necesitas habilitar la **Places API (New)** en Google Cloud Console:

## 1. Habilitar APIs en Google Cloud Console

### Paso 1: Ir a Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto o crea uno nuevo

### Paso 2: Habilitar las APIs necesarias

En la sección "APIs y servicios" > "Biblioteca", busca y habilita:

1. **Places API (New)** - Para autocompletado de direcciones ⭐ **IMPORTANTE**
2. **Geocoding API** - Para convertir direcciones a coordenadas
3. **Maps JavaScript API** - Para mostrar mapas (si usas MapView)

### ⚠️ IMPORTANTE: Places API (New) vs Legacy

- **NO uses** la API legacy "Places API"
- **SÍ usa** la nueva "Places API (New)"
- La nueva API tiene mejor rendimiento y más funcionalidades

### Paso 3: Verificar la API Key

1. Ve a "APIs y servicios" > "Credenciales"
2. Verifica que tu API key tenga acceso a las APIs habilitadas
3. Asegúrate de que las restricciones permitan el uso desde tu app

## 2. Configuración de Restricciones (Recomendado)

### Restricciones de API

- ✅ Places API (New) ⭐
- ✅ Geocoding API
- ✅ Maps JavaScript API

### Restricciones de aplicación

- **Android**: Agregar el SHA-1 de tu app
- **iOS**: Agregar el Bundle ID de tu app
- **Web**: Agregar el dominio de tu app

## 3. Verificar Funcionamiento

Una vez configurado, la búsqueda de direcciones debería funcionar así:

1. **Escribir** en el campo de búsqueda
2. **Esperar 3 segundos** (delay para ahorrar requests)
3. **Ver resultados** de direcciones en Argentina
4. **Seleccionar** una dirección
5. **Guardar** las coordenadas automáticamente

## 4. Troubleshooting

### Error: "You're calling a legacy API"

- **Solución**: Habilita "Places API (New)" en lugar de "Places API"
- Ve a Google Cloud Console > APIs y servicios > Biblioteca
- Busca "Places API (New)" y habilítala

### Error: "REQUEST_DENIED"

- Verificar que la API key sea correcta
- Verificar que las APIs estén habilitadas
- Verificar las restricciones de la API key

### Error: "OVER_QUERY_LIMIT"

- Verificar el límite de requests en Google Cloud Console
- Considerar habilitar facturación si es necesario

### No aparecen resultados

- Verificar que la API Places (New) esté habilitada
- Verificar que la búsqueda tenga al menos 3 caracteres
- Verificar la conexión a internet

## 5. Costos

- **Places API (New)**: $17 por 1000 requests
- **Geocoding API**: $5 por 1000 requests
- **Maps JavaScript API**: Gratis hasta 25,000 cargas de mapa por mes

El delay de 3 segundos ayuda a reducir significativamente los costos al evitar requests innecesarios.

## 6. Configuración en el Código

El código ya está configurado para usar:

- ✅ **Places API (New)** con POST requests
- ✅ Delay de 3 segundos
- ✅ Búsqueda solo con 3+ caracteres
- ✅ Restricción a Argentina
- ✅ Manejo de errores mejorado
- ✅ Límite de 5 resultados

## 7. Diferencias con la API Legacy

| Característica  | API Legacy                     | API (New)                                       |
| --------------- | ------------------------------ | ----------------------------------------------- |
| Endpoint        | `/maps/api/place/autocomplete` | `/places.googleapis.com/v1/places:autocomplete` |
| Método          | GET                            | POST                                            |
| Headers         | Standard                       | `X-Goog-Api-Key`, `X-Goog-FieldMask`            |
| Body            | Query params                   | JSON                                            |
| Rendimiento     | Básico                         | Mejorado                                        |
| Funcionalidades | Limitadas                      | Extendidas                                      |

¡Con esta configuración, la búsqueda de direcciones debería funcionar perfectamente! 🎉

**Nota**: Si sigues teniendo problemas, asegúrate de haber habilitado específicamente "Places API (New)" y no la versión legacy.
