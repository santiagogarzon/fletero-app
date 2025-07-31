# Fletero App 🚛

Una plataforma móvil para conectar consumidores con fleteros (conductores de carga) en Argentina, similar a Uber pero para servicios de transporte de mercancías.

## 🚀 Características Principales

### 👤 **Flujo del Consumidor**

- **Crear solicitudes de flete** con detalles completos
- **Seleccionar ubicaciones** de origen y destino
- **Especificar tipo de propiedad** (casa/apartamento)
- **Indicar necesidad de ayuda** y dificultad de escaleras
- **Calcular volumen automático** de los artículos
- **Recibir ofertas** de fleteros
- **Pagar con MercadoPago** de forma segura
- **Seguimiento en tiempo real** del fletero
- **Calificar el servicio** y ver historial

### 🚛 **Flujo del Fletero**

- **Configurar perfil** con tipo de vehículo y capacidad
- **Ver solicitudes cercanas** disponibles
- **Enviar ofertas** con precios y tiempos estimados
- **Gestionar trabajos asignados**
- **Compartir ubicación** durante el trabajo
- **Recibir pagos** y calificar consumidores
- **Ver historial** y estadísticas de ganancias

## 🛠 **Stack Tecnológico**

- **React Native** con Expo
- **Firebase** (Auth, Firestore, Storage, Messaging)
- **NativeWind** (Tailwind CSS para React Native)
- **Zustand** para gestión de estado
- **React Navigation** para navegación
- **DayJS** para manejo de fechas
- **TypeScript** para tipado estático
- **AsyncStorage** para persistencia local

## 🔥 **Firebase Integration**

### **Servicios Configurados**

- ✅ **Authentication** - Registro, login y gestión de usuarios
- ✅ **Firestore** - Base de datos en tiempo real
- ✅ **Storage** - Almacenamiento de archivos y documentos
- ✅ **Messaging** - Notificaciones push
- ✅ **Real-time Updates** - Sincronización en tiempo real

### **Estructura de Datos**

```
users/
  ├── {userId}/
  │   ├── profile (User data)
  │   └── driverProfile (Driver specific data)

freightRequests/
  ├── {requestId}/
  │   ├── consumerId
  │   ├── origin/destination
  │   ├── items
  │   └── status

offers/
  ├── {offerId}/
  │   ├── requestId
  │   ├── driverId
  │   ├── price
  │   └── status

jobs/
  ├── {jobId}/
  │   ├── requestId
  │   ├── consumerId/driverId
  │   ├── status
  │   └── tracking
```

## 📱 **Estructura del Proyecto**

```
src/
├── components/          # Componentes reutilizables
│   ├── Button.tsx      # Botón personalizable
│   ├── Input.tsx       # Campo de entrada
│   └── Card.tsx        # Tarjeta contenedora
├── navigation/         # Configuración de navegación
│   ├── RootNavigator.tsx
│   ├── AuthNavigator.tsx
│   ├── MainNavigator.tsx
│   ├── ConsumerNavigator.tsx
│   ├── DriverNavigator.tsx
│   └── types.ts
├── screens/           # Pantallas de la aplicación
│   ├── auth/         # Autenticación
│   ├── consumer/     # Pantallas del consumidor
│   ├── driver/       # Pantallas del fletero
│   └── shared/       # Pantallas compartidas
├── services/         # Servicios Firebase
│   ├── authService.ts
│   ├── freightService.ts
│   ├── storageService.ts
│   └── notificationService.ts
├── store/            # Estado global (Zustand)
│   ├── authStore.ts  # Estado de autenticación
│   └── freightStore.ts # Estado de fletes
├── types/            # Tipos TypeScript
│   └── index.ts
├── utils/            # Utilidades
│   ├── dateUtils.ts  # Manejo de fechas
│   ├── volumeCalculator.ts # Cálculo de volúmenes
│   └── cn.ts         # Utilidad para clases CSS
└── config/           # Configuraciones
    └── firebase.ts   # Configuración Firebase
```

## 🎨 **Diseño y UX**

- **Mobile-first** con diseño responsivo
- **Paleta de colores** profesional y accesible
- **Iconografía** consistente con Ionicons
- **Navegación intuitiva** con tabs y stack navigation
- **Feedback visual** con estados de carga y errores
- **Formularios validados** con mensajes de error claros

## 🔐 **Autenticación Firebase**

- **Registro** con validación de campos
- **Inicio de sesión** con persistencia
- **Selección de rol** (Consumidor/Fletero)
- **Configuración de perfil** para fleteros
- **Sesión persistente** con AsyncStorage
- **Recuperación de contraseña** por email

## 📊 **Estado Global con Firebase**

### AuthStore

- Usuario autenticado (Firebase Auth)
- Perfil del fletero (Firestore)
- Estado de carga
- Manejo de errores

### FreightStore

- Solicitudes de flete (Firestore)
- Ofertas y trabajos (Firestore)
- Filtros y búsquedas
- Historial de actividades
- Actualizaciones en tiempo real

## 🚀 **Instalación y Uso**

### **Prerrequisitos**

- Node.js (v18 o superior)
- Expo CLI
- Firebase project configurado

### **1. Clonar el repositorio**

```bash
git clone <repository-url>
cd fletero-app
```

### **2. Instalar dependencias**

```bash
npm install
```

### **3. Configurar Firebase**

- Crear proyecto en [Firebase Console](https://console.firebase.google.com)
- Descargar `GoogleService-Info.plist` (iOS) y `google-services.json` (Android)
- Colocar archivos en la raíz del proyecto
- Actualizar configuración en `src/config/firebase.ts`

### **4. Configurar variables de entorno**

```bash
# Crear archivo .env
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### **5. Iniciar el servidor de desarrollo**

```bash
npm start
```

### **6. Ejecutar en dispositivo/simulador**

```bash
# iOS
npm run ios

# Android
npm run android
```

## 📋 **Funcionalidades Implementadas**

### ✅ **Completadas**

- [x] Estructura de navegación completa
- [x] Autenticación Firebase completa
- [x] Registro y login con validación
- [x] Selección de roles
- [x] Configuración de perfil de fletero
- [x] Pantalla principal del consumidor
- [x] Componentes reutilizables
- [x] Gestión de estado con Zustand + Firebase
- [x] Utilidades de fecha y volumen
- [x] Tipos TypeScript completos
- [x] Servicios Firebase (Auth, Firestore, Storage)
- [x] Notificaciones push
- [x] Actualizaciones en tiempo real

### 🚧 **En Desarrollo**

- [ ] Creación de solicitudes de flete
- [ ] Integración con Google Maps
- [ ] Sistema de ofertas
- [ ] Pagos con MercadoPago
- [ ] Seguimiento en tiempo real
- [ ] Sistema de calificaciones

### 📝 **Pendientes**

- [ ] Chat entre usuarios
- [ ] Reportes y analytics
- [ ] Configuraciones avanzadas
- [ ] Modo offline mejorado

## 🔥 **Firebase Security Rules**

### **Firestore Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Freight requests
    match /freightRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.consumerId == request.auth.uid;
    }

    // Offers
    match /offers/{offerId} {
      allow read, write: if request.auth != null;
    }

    // Jobs
    match /jobs/{jobId} {
      allow read, write: if request.auth != null &&
        (resource.data.consumerId == request.auth.uid ||
         resource.data.driverId == request.auth.uid);
    }
  }
}
```

### **Storage Rules**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile pictures
    match /profile-pictures/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Driver documents
    match /driver-documents/{userId}/{documentType} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Freight request images
    match /freight-requests/{requestId}/images/{imageIndex} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 🎯 **Próximos Pasos**

1. **Implementar creación de fletes** con formulario completo
2. **Integrar Google Maps** para selección de ubicaciones
3. **Desarrollar sistema de ofertas** para fleteros
4. **Agregar MercadoPago** para pagos
5. **Implementar seguimiento GPS** en tiempo real
6. **Crear sistema de calificaciones** bidireccional

## 🤝 **Contribución**

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 **Soporte**

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

**Fletero App** - Conectando consumidores con fleteros confiables en Argentina 🇦🇷
