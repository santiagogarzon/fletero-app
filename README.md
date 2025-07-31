# Fletero App - Plataforma de Transporte

Una aplicación móvil completa para conectar consumidores con conductores de transporte de carga (fletes) en Argentina.

## 🚀 Características Principales

### Para Consumidores

- **Solicitudes de Flete**: Formulario completo para crear solicitudes de transporte
- **Selección de Ubicaciones**: Integración con Google Maps para origen y destino
- **Cálculo Automático de Volumen**: Estimación automática basada en items seleccionados
- **Gestión de Solicitudes**: Ver, editar y cancelar solicitudes
- **Seguimiento en Tiempo Real**: Monitoreo de la ubicación del conductor
- **Sistema de Pagos**: Integración con MercadoPago
- **Calificaciones**: Evaluar servicios recibidos

### Para Conductores (Fleteros)

- **Perfil Completo**: Configuración de vehículo y capacidades
- **Ofertas de Trabajo**: Ver solicitudes cercanas y enviar ofertas
- **Gestión de Trabajos**: Aceptar, iniciar y completar trabajos
- **Navegación**: Integración con mapas para rutas
- **Ganancias**: Seguimiento de ingresos y estadísticas
- **Calificaciones**: Evaluar clientes

## 🛠 Tecnologías Utilizadas

- **React Native** con Expo
- **TypeScript** para type safety
- **Tailwind CSS** (NativeWind) para estilos
- **Zustand** para gestión de estado
- **Firebase** (Auth, Firestore, Storage)
- **React Navigation** para navegación
- **Expo Location** para geolocalización
- **React Native Maps** para mapas
- **DayJS** para manejo de fechas

## 📱 Pantallas Principales

### Autenticación

- **WelcomeScreen**: Pantalla de bienvenida con opción de acceso anónimo
- **LoginScreen**: Inicio de sesión con email/contraseña
- **RegisterScreen**: Registro de nuevos usuarios
- **RoleSelectionScreen**: Selección de rol (Consumidor/Conductor)
- **ConvertAnonymousScreen**: Conversión de cuenta anónima a permanente

### Consumidor

- **ConsumerHomeScreen**: Pantalla principal del consumidor
- **FreightRequestScreen**: **NUEVA** - Formulario completo para crear solicitudes de flete
- **MyRequestsScreen**: Lista de solicitudes creadas
- **HistoryScreen**: Historial de servicios

### Conductor

- **AvailableRequestsScreen**: Solicitudes disponibles para ofertar
- **MyJobsScreen**: Trabajos asignados
- **EarningsScreen**: Ganancias y estadísticas

### Navegación

- **RootNavigator**: Navegación principal con autenticación
- **AuthNavigator**: Navegación de autenticación
- **MainNavigator**: Navegación principal de la app
- **ConsumerNavigator**: Tabs para consumidores
- **DriverNavigator**: Tabs para conductores

## 🗺 FreightRequestScreen - Nueva Funcionalidad

### Características del Formulario de Solicitud

#### 1. Tipo de Propiedad

- **Casa o Departamento**: Selección con radio buttons
- **Opciones para Departamentos**:
  - ¿Necesita ayuda para cargar? (Toggle)
  - Tipo de Ascensor: Ninguno / Pequeño / Grande
  - Dificultad de Escaleras: Fácil / Angosta / Difícil

#### 2. Items a Transportar

- **Número de Cajas**: Input numérico
- **Muebles y Electrodomésticos**: Checkboxes para:
  - Heladera, Cama, Colchón, Mesa, Sillas
  - Lavarropas, Sofá, TV, Escritorio, Ropero
- **Otros Items**: Campo de texto libre
- **Cálculo Automático**: Volumen estimado en m³

#### 3. Ubicaciones

- **Integración con Google Maps**: Selección visual de origen y destino
- **Geocodificación**: Conversión automática de coordenadas a direcciones
- **Ubicación Actual**: Botón para usar ubicación actual
- **Marcadores**: Origen (verde) y Destino (rojo)

#### 4. Fecha y Hora

- **DatePicker**: Selección de fecha preferida
- **TimePicker**: Selección de hora preferida
- **Validación**: Fecha debe ser futura

#### 5. Validación y Envío

- **Validación Completa**: Todos los campos requeridos
- **Mensajes de Error**: Feedback claro al usuario
- **Integración con Zustand**: Almacenamiento en estado global
- **Navegación**: Redirección a lista de solicitudes

### Componentes Utilizados

- **Input**: Campos de texto con validación
- **Button**: Botones con estados de carga
- **Card**: Contenedores con estilo consistente
- **MapView**: Integración con react-native-maps
- **DateTimePicker**: Selectores de fecha y hora

## 🔧 Configuración

### Prerrequisitos

- Node.js >= 18.17
- npm o yarn
- Expo CLI
- Cuenta de Firebase
- Google Maps API Key

### Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd fletero-app
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con tus credenciales
nano .env
```

#### Variables de Entorno Requeridas

```bash
# Google Maps API Key (REQUERIDO)
GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps

# Firebase Configuration (opcional, si usas variables de entorno)
# FIREBASE_API_KEY=tu_firebase_api_key
# FIREBASE_AUTH_DOMAIN=tu_firebase_auth_domain
# FIREBASE_PROJECT_ID=tu_firebase_project_id
# FIREBASE_STORAGE_BUCKET=tu_firebase_storage_bucket
# FIREBASE_MESSAGING_SENDER_ID=tu_firebase_messaging_sender_id
# FIREBASE_APP_ID=tu_firebase_app_id

# App Configuration
APP_NAME=Fletero App
APP_VERSION=1.0.0
```

4. **Configurar Firebase**

- Crear proyecto en Firebase Console
- Habilitar Authentication (Email/Password + Anonymous)
- Crear Firestore Database
- Configurar reglas de seguridad
- Actualizar `src/config/firebase.ts`

5. **Configurar Google Maps**

- Obtener API Key de Google Cloud Console
- Habilitar Maps SDK para Android e iOS
- Configurar restricciones de API key
- Actualizar `app.json` con la API Key

6. **Ejecutar la aplicación**

```bash
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── config/             # Configuración (Firebase, env, etc.)
│   ├── firebase.ts     # Configuración de Firebase
│   └── env.ts          # Variables de entorno
├── navigation/         # Navegación y tipos
├── screens/           # Pantallas de la aplicación
│   ├── auth/         # Pantallas de autenticación
│   ├── consumer/     # Pantallas para consumidores
│   └── driver/       # Pantallas para conductores
├── services/         # Servicios (Firebase, etc.)
├── store/           # Zustand stores
├── types/           # TypeScript types
└── utils/           # Utilidades (fechas, cálculos, etc.)
```

## 🎨 Diseño y UX

### Principios de Diseño

- **Mobile-First**: Optimizado para dispositivos móviles
- **Consistencia**: Componentes reutilizables con estilos uniformes
- **Accesibilidad**: Contraste adecuado y tamaños de texto legibles
- **Feedback Visual**: Estados de carga, errores y éxito claros

### Tailwind CSS (NativeWind)

- **Utility-First**: Clases utilitarias para estilos rápidos
- **Responsive**: Diseño adaptativo para diferentes pantallas
- **Custom Components**: Componentes base con estilos consistentes

## 🔐 Seguridad

### Variables de Entorno

- **Archivo .env**: Contiene credenciales sensibles
- **Archivo .env.example**: Documenta las variables requeridas
- **Validación**: Verificación automática de variables requeridas
- **Gitignore**: El archivo .env está excluido del control de versiones

### Firebase Security Rules

- **Autenticación**: Usuarios solo pueden acceder a sus propios datos
- **Validación**: Reglas de Firestore para validar datos
- **Permisos**: Control granular de acceso a recursos

### Datos Sensibles

- **API Keys**: Configuradas en variables de entorno
- **Información Personal**: Encriptada en tránsito
- **Permisos**: Mínimos necesarios para funcionalidad

## 🚀 Despliegue

### Expo Build

```bash
# Para iOS
expo build:ios

# Para Android
expo build:android
```

### EAS Build (Recomendado)

```bash
# Configurar EAS
eas build:configure

# Construir para producción
eas build --platform all
```

## 📊 Estado del Proyecto

### ✅ Completado

- [x] Estructura base del proyecto
- [x] Autenticación con Firebase
- [x] Navegación completa
- [x] **FreightRequestScreen** - Formulario completo de solicitudes
- [x] Integración con Google Maps
- [x] Cálculo automático de volumen
- [x] Gestión de estado con Zustand
- [x] Autenticación anónima
- [x] Conversión de cuentas anónimas
- [x] **Variables de entorno** configuradas

### 🚧 En Desarrollo

- [ ] Sistema de ofertas para conductores
- [ ] Integración con MercadoPago
- [ ] Seguimiento en tiempo real
- [ ] Sistema de calificaciones
- [ ] Notificaciones push
- [ ] Modo offline

### 📋 Pendiente

- [ ] Chat entre usuarios
- [ ] Reportes y analytics
- [ ] Configuraciones avanzadas
- [ ] Tests automatizados
- [ ] Documentación completa

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o preguntas:

- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación de Firebase y Expo

---

**Fletero App** - Conectando Argentina, un flete a la vez 🚛
