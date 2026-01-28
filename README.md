# PWA Offline Form - Aplicación React + TypeScript con Soporte Offline

Una aplicación Progressive Web App (PWA) desarrollada en **React con TypeScript** que permite trabajar en modo offline/online, almacenando datos de formularios en IndexedDB y sincronizándolos con una API cuando hay conexión.

## 🚀 Características

- ✅ **TypeScript**: Tipado estático para mayor seguridad y mantenibilidad
- ✅ **Soporte Offline/Online**: Funciona sin conexión a internet
- ✅ **IndexedDB**: Almacenamiento local persistente de datos con tipos
- ✅ **Sincronización Automática**: Envía datos a la API cuando hay conexión
- ✅ **Service Worker**: Cache de recursos para funcionamiento offline
- ✅ **Detección de Estado**: Indicador visual del estado de conexión
- ✅ **Actualizaciones PWA**: Notificación automática de nuevas versiones
- ✅ **UI Moderna**: Interfaz responsive con CSS3 y Lucide Icons

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- TypeScript se instala automáticamente con las dependencias

## 🔧 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Copia el archivo de configuración de ejemplo:
```bash
copy .env.example .env
```

3. (Opcional) Configura tu URL de API en el archivo `.env`:
```
REACT_APP_API_URL=https://jsonplaceholder.typicode.com/posts
```
Por defecto usa JSONPlaceholder. Cambia esta URL para usar tu propia API.

## 🏃‍♂️ Ejecución

### Modo Desarrollo
```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

### Modo Producción
```bash
npm run build
npm install -g serve
serve -s build
```

## 📱 Funcionalidades

### Formulario
- Campos: Nombre, Email, Categoría, Mensaje
- Validación de campos requeridos
- Guardado automático en IndexedDB cuando está offline
- Envío directo a API cuando está online

### Gestión de Datos
- Visualización de todos los datos almacenados
- Indicador de estado de sincronización (Sincronizado/Pendiente)
- Botón de sincronización manual para datos pendientes
- Eliminación individual de registros

### Estado de Conexión
- Barra de estado en tiempo real
- Indicador visual (verde=online, rojo=offline)
- Detección automática de cambios de conexión

## 🗄️ Estructura de Datos

Los datos se almacenan en IndexedDB con la siguiente estructura:

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "categoria": "general",
  "mensaje": "Mensaje de prueba",
  "synced": false,
  "timestamp": "2026-01-27T12:00:00.000Z",
  "syncedAt": null
}
```

## 🔌 API

Por defecto, la aplicación usa JSONPlaceholder como API de prueba. Para usar tu propia API:

1. Configura `REACT_APP_API_URL` en `.env`
2. La API debe aceptar peticiones POST con JSON
3. Formato esperado de respuesta: cualquier JSON válido

Ejemplo de petición:
```javascript
POST /api/endpoint
Content-Type: application/json

{
  "nombre": "Juan",
  "email": "juan@example.com",
  "categoria": "general",
  "mensaje": "Hola"
}
```

## 🛠️ Tecnologías Utilizadas

- **React 18**: Framework principal
- **TypeScript 4.9**: Tipado estático y type safety
- **IndexedDB (idb)**: Base de datos local con tipos
- **Service Worker**: Cache y funcionalidad offline
- **Lucide React**: Iconos modernos
- **CSS3**: Estilos personalizados

### Dependencias TypeScript
- `typescript`: ^4.9.5
- `@types/react`: ^18.2.0
- `@types/react-dom`: ^18.2.0
- `@types/node`: ^20.0.0

## � Beneficios de TypeScript

La migración a TypeScript proporciona:

- **Type Safety**: Detección de errores en tiempo de desarrollo
- **IntelliSense Mejorado**: Autocompletado inteligente en el IDE
- **Refactoring Seguro**: Cambios con mayor confianza
- **Documentación Implícita**: Los tipos documentan el código
- **Mejor Mantenibilidad**: Código más fácil de entender y mantener
- **Interfaces Claras**: Contratos explícitos entre componentes

### Ejemplos de Tipado

**Tipos de Datos del Formulario**:
```typescript
interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  mensaje: string;
  categoria: 'general' | 'soporte' | 'ventas' | 'feedback';
}
```

**Props de Componentes**:
```typescript
interface FormComponentProps {
  isOnline: boolean;
  onFormSaved?: () => void;
}
```

## �� Estructura del Proyecto

```
PWA/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── service-worker.js
├── src/
│   ├── components/
│   │   ├── FormComponent.tsx       # Componente de formulario tipado
│   │   ├── DataList.tsx            # Lista de datos con tipos
│   │   ├── StatusBar.tsx           # Barra de estado tipada
│   │   └── UpdateNotification.tsx  # Notificación de actualizaciones
│   ├── hooks/
│   │   ├── useOnlineStatus.ts      # Hook de estado online
│   │   └── useServiceWorkerUpdate.ts # Hook de actualizaciones PWA
│   ├── services/
│   │   ├── indexedDB.ts            # Servicio IndexedDB tipado
│   │   └── apiService.ts           # Servicio API tipado
│   ├── styles/
│   │   ├── App.css
│   │   ├── FormComponent.css
│   │   ├── DataList.css
│   │   ├── StatusBar.css
│   │   └── index.css
│   ├── types/
│   │   └── index.ts                # Definiciones de tipos e interfaces
│   ├── App.tsx                     # Componente principal
│   ├── index.tsx                   # Punto de entrada
│   └── react-app-env.d.ts          # Tipos de React
├── tsconfig.json                    # Configuración TypeScript
├── package.json
├── MIGRATION.md                     # Documentación de migración
└── README.md
```

## 🧪 Pruebas de Funcionalidad Offline

1. Abre la aplicación en el navegador
2. Abre DevTools (F12) → Application → Service Workers
3. Marca "Offline" para simular pérdida de conexión
4. Completa y envía el formulario
5. Verifica que los datos se guardan localmente
6. Desmarca "Offline" para volver online
7. Haz clic en "Sincronizar" para enviar los datos pendientes

## 📝 Notas

- El Service Worker solo funciona en producción o con HTTPS
- En desarrollo, usa `localhost` para probar funcionalidades PWA
- Los datos en IndexedDB persisten incluso después de cerrar el navegador
- La sincronización es manual mediante el botón "Sincronizar"
- **TypeScript**: El proyecto usa tipado estricto para mayor seguridad
- Ver `MIGRATION.md` para detalles sobre la migración a TypeScript
