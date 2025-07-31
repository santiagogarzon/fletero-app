# Fletero App

Una aplicación móvil para servicios de transporte y mudanzas, similar a Uber pero para "fletes" en Argentina.

## 🚀 Características

### 🔐 Autenticación

- **Login/Registro** con email y contraseña
- **Autenticación anónima** para explorar sin cuenta
- **Persistencia de sesión** - los usuarios permanecen logueados
- **Roles de usuario**: Consumidor y Conductor (Fletero)

### 👤 Flujo del Consumidor

- **Crear solicitudes de flete** con detalles completos
- **Especificar items** (cajas, muebles, electrodomésticos)
- **Cálculo automático de volumen** (m³)
- **Selección de origen/destino** con Google Maps
- **Fecha y hora preferida** con DatePicker
- **Recibir y aceptar ofertas** de conductores
- **Pagos con MercadoPago** (pendiente)
- **Seguimiento en tiempo real** del conductor
- **Calificación y reseñas** del servicio
- **Historial de trabajos**

### 🚛 Flujo del Conductor (Fletero)

- **Configurar perfil** (tipo de vehículo, capacidad, ayuda ofrecida)
- **Explorar solicitudes cercanas** con filtros
- **Enviar ofertas** con precios y mensajes
- **Ver trabajos asignados** y estado
- **Geolocalización** durante el trabajo
- **Recibir pagos** automáticamente
- **Calificar al consumidor**
- **Historial de ganancias**

### 🎨 Diseño

- **Tailwind CSS** (NativeWind) para estilos
- **Mobile-first** y responsive
- **Listas scrolleables** optimizadas
- **Modo oscuro** opcional

### 📊 Gestión de Estado

- **Zustand** para estado global
- **Persistencia local** con AsyncStorage
- **Actualizaciones en tiempo real**
- **Filtros con DayJS** para fechas

## 🛠 Stack Tecnológico

### Frontend

- **React Native** con Expo
- **TypeScript** para type safety
- **Tailwind CSS** (NativeWind) para estilos
- **React Navigation** para navegación
- **Zustand** para gestión de estado

### Backend & Servicios

- **Firebase Authentication** para autenticación
- **Firestore** para base de datos en tiempo real
- **Firebase Storage** para archivos
- **Firebase Messaging** para notificaciones push
- **Google Maps SDK** para mapas y geolocalización
- **MercadoPago** para pagos (pendiente)

### Utilidades

- **DayJS** para manejo de fechas
- **Expo Location** para geolocalización
- **React Native Maps** para mapas
- **AsyncStorage** para persistencia local
- **React Native Reanimated** para animaciones

## 🔧 Configuración del Proyecto

### 📋 Prerrequisitos

- Node.js >= 18.17
- npm o yarn
- Expo CLI
- Cuenta de Firebase
- API Key de Google Maps

### 🚀 Instalación

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
cp .env.example .env
```

4. **Editar `.env` con tus credenciales**

```env
# Google Maps API Key
GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps

# Firebase Configuration (opcional)
FIREBASE_API_KEY=tu_firebase_api_key
FIREBASE_AUTH_DOMAIN=tu_firebase_auth_domain
FIREBASE_PROJECT_ID=tu_firebase_project_id
FIREBASE_STORAGE_BUCKET=tu_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=tu_firebase_messaging_sender_id
FIREBASE_APP_ID=tu_firebase_app_id

# App Configuration
APP_NAME=Fletero App
APP_VERSION=1.0.0
```

### 🔐 Configuración de Firebase

1. **Crear proyecto en Firebase Console**
2. **Habilitar Authentication** (Email/Password, Anonymous)
3. **Crear Firestore Database** en modo test
4. **Configurar Storage** (opcional)
5. **Obtener configuración web** y actualizar `src/config/firebase.ts`

### 🗺 Configuración de Google Maps

1. **Crear proyecto en Google Cloud Console**
2. **Habilitar Maps SDK for Android/iOS**
3. **Crear API Key** con restricciones apropiadas
4. **Agregar API Key** al archivo `.env`

### 🏃‍♂️ Ejecutar la aplicación

```bash
# Desarrollo
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 🔒 Seguridad y Variables de Entorno

### 🛡️ Mejores Prácticas de Seguridad

1. **Nunca committear archivos `.env`** - ya están en `.gitignore`
2. **Usar `.env.example`** como plantilla para otros desarrolladores
3. **API Keys con restricciones** en Google Cloud Console
4. **Reglas de seguridad** en Firestore
5. **Validación de entrada** en todos los formularios

### 🔧 Configuración Automática

El proyecto incluye scripts automáticos para:

- **Actualizar `app.json`** con API keys desde `.env`
- **Validar variables requeridas** al inicio
- **Prevenir builds** sin configuración correcta

### 📁 Estructura de Archivos de Configuración

```
fletero-app/
├── .env                    # Variables de entorno (NO COMMIT)
├── .env.example           # Plantilla para otros desarrolladores
├── app.json               # Configuración Expo (con placeholders)
├── scripts/
│   └── setup-env.js       # Script para actualizar app.json
└── src/
    └── config/
        ├── env.ts         # Configuración de variables de entorno
        └── firebase.ts    # Configuración de Firebase
```

### 🔄 Flujo de Configuración

1. **Desarrollador clona el repo**
2. **Copia `.env.example` a `.env`**
3. **Agrega sus credenciales en `.env`**
4. **Ejecuta `npm start`** - automáticamente actualiza `app.json`
5. **La app usa las variables seguras**

## 📱 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── config/              # Configuraciones
│   ├── firebase.ts
│   └── env.ts
├── navigation/          # Navegación
│   ├── RootNavigator.tsx
│   ├── AuthNavigator.tsx
│   ├── MainNavigator.tsx
│   ├── ConsumerNavigator.tsx
│   └── DriverNavigator.tsx
├── screens/             # Pantallas
│   ├── auth/           # Autenticación
│   ├── consumer/       # Pantallas del consumidor
│   ├── driver/         # Pantallas del conductor
│   └── shared/         # Pantallas compartidas
├── services/           # Servicios externos
│   ├── authService.ts
│   ├── freightService.ts
│   └── notificationService.ts
├── store/              # Estado global (Zustand)
│   ├── authStore.ts
│   └── freightStore.ts
├── types/              # Tipos TypeScript
│   └── index.ts
└── utils/              # Utilidades
    ├── dateUtils.ts
    ├── volumeCalculator.ts
    └── cn.ts
```

## 🎯 Funcionalidades Implementadas

### ✅ Completadas

- [x] **Estructura base** del proyecto
- [x] **Configuración Firebase** con Auth y Firestore
- [x] **Autenticación** (email/password, anónima)
- [x] **Navegación** completa con React Navigation
- [x] **Persistencia de login** entre sesiones
- [x] **Pantallas de autenticación** (login, registro, selección de rol)
- [x] **FreightRequestScreen** - Formulario completo de solicitud de flete
- [x] **Integración Google Maps** para selección de ubicaciones
- [x] **Cálculo automático de volumen** de items
- [x] **Date/Time pickers** para fecha y hora preferida
- [x] **Variables de entorno** seguras con `.env`
- [x] **Validación de formularios** y manejo de errores
- [x] **UI responsive** con Tailwind CSS
- [x] **Gestión de estado** con Zustand
- [x] **Servicios Firebase** (Auth, Firestore)
- [x] **Pantallas de prueba** para debugging

### 🚧 En Desarrollo

- [ ] **Sistema de ofertas** para conductores
- [ ] **Integración MercadoPago** para pagos
- [ ] **Geolocalización compartida** durante trabajos
- [ ] **Sistema de calificaciones** y reseñas
- [ ] **Notificaciones push** completas
- [ ] **Modo offline** con caché de solicitudes
- [ ] **Chat entre usuarios**
- [ ] **Reportes y analytics**

### 📋 Pendientes

- [ ] **Configuración completa del perfil del conductor**
- [ ] **Historial y estadísticas** para ambos roles
- [ ] **Tests automatizados**
- [ ] **Documentación completa**
- [ ] **Configuraciones avanzadas**

## 🐛 Troubleshooting

### Problemas Comunes

#### Firebase "offline" errors

- **Causa**: Firestore Database no existe en el proyecto
- **Solución**: Crear Firestore Database en Firebase Console

#### Google Maps no funciona

- **Causa**: API Key no configurada o con restricciones
- **Solución**: Verificar `.env` y restricciones en Google Cloud Console

#### Variables de entorno no cargan

- **Causa**: Archivo `.env` no existe o formato incorrecto
- **Solución**: Copiar `.env.example` y agregar credenciales

#### Errores de navegación

- **Causa**: Tipos TypeScript no coinciden
- **Solución**: Verificar `src/navigation/types.ts`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.
