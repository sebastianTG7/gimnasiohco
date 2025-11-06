# Sistema de Rutinas con Firebase - Backend Rutinas

## 🎯 ¿Qué se implementó?

Se ha implementado un **sistema completo de gestión de rutinas** con Firebase Firestore que permite a cada usuario:

- ✅ Guardar rutinas personalizadas en la base de datos
- ✅ Crear múltiples rutinas
- ✅ Editar y actualizar rutinas existentes
- ✅ Eliminar rutinas
- ✅ Cambiar entre rutinas guardadas
- ✅ Sincronización automática con Firebase
- ✅ Persistencia de datos por usuario

## 📁 Archivos Nuevos Creados

### 1. `/src/hooks/useRoutines.js`
Hook personalizado que gestiona todas las operaciones CRUD de rutinas:
- `loadRoutines()` - Cargar todas las rutinas del usuario
- `loadRoutine(id)` - Cargar una rutina específica
- `createRoutine(data)` - Crear nueva rutina
- `updateRoutine(id, updates)` - Actualizar rutina existente
- `deleteRoutine(id)` - Eliminar rutina
- `setActiveRoutine(id)` - Marcar rutina como activa

### 2. `/src/components/RoutineManagerModal.js`
Modal para gestionar todas las rutinas guardadas:
- Listar todas las rutinas del usuario
- Crear nuevas rutinas
- Renombrar rutinas
- Eliminar rutinas
- Cambiar entre rutinas
- Ver cuál rutina está activa

### 3. `/FIRESTORE_RULES.md`
Documentación completa de las reglas de seguridad de Firestore y estructura de datos.

## 🔧 Archivos Modificados

### `/src/App.js`
- Importado el hook `useRoutines`
- Importado `RoutineManagerModal`
- Implementada lógica para sincronizar entre estado local y Firebase
- Funciones para crear, actualizar y eliminar rutinas
- Auto-guardado cada 1 segundo cuando se hacen cambios
- Carga automática de la rutina activa al iniciar sesión

## 🚀 Cómo Usar

### 1. Configurar Reglas de Firebase

**IMPORTANTE**: Debes configurar las reglas de seguridad en Firebase Console.

1. Ve a [Firebase Console](https://console.firebase.google.com/project/gym-energyhco/firestore)
2. Click en la pestaña **"Reglas"**
3. Copia y pega las reglas que están en el archivo `FIRESTORE_RULES.md`
4. Click en **"Publicar"**

### 2. Funcionalidad para Usuarios

#### **Usuario NO logueado:**
- Puede usar la app normalmente
- Los datos se guardan solo en el estado local (se pierden al recargar)
- No puede guardar rutinas permanentemente

#### **Usuario logueado:**
- Todas las rutinas se guardan automáticamente en Firebase
- Puede crear múltiples rutinas
- Puede cambiar entre rutinas guardadas
- Los datos persisten entre sesiones
- Sincronización automática en tiempo real

### 3. Crear una Rutina

```javascript
// El usuario selecciona ejercicios y configura su rutina
// Al hacer cambios, se guarda automáticamente en Firebase (después de 1 segundo)

// También puede crear una nueva rutina manualmente:
// 1. Click en el botón "Gestionar Rutinas" (cuando esté implementado en UI)
// 2. Click en "Crear Nueva Rutina"
// 3. Ingresar nombre
// 4. La rutina se crea vacía y se activa
```

### 4. Cambiar entre Rutinas

```javascript
// En el modal de gestión de rutinas:
// 1. Ver todas las rutinas guardadas
// 2. Click en "Usar" en la rutina deseada
// 3. La rutina se carga automáticamente
```

## 📊 Estructura de Datos en Firestore

```
users/
  └── {userId}/
      └── routines/
          └── {routineId}/
              ├── name: "Rutina Volumen"
              ├── description: "Mi rutina de volumen"
              ├── schedule: {
              │   days: {
              │     lunes: ["pecho", "triceps"],
              │     miercoles: ["espalda", "biceps"]
              │   },
              │   types: ["full-body"]
              │ }
              ├── selectedExercises: {
              │   pecho: ["Press Banca (barra)", "Aperturas (Mancuernas)"],
              │   espalda: ["Dominadas", "Remo Parado (barra)"]
              │ }
              ├── customDetails: {
              │   pecho: {
              │     "Press Banca (barra)": {
              │       series: 4,
              │       repeticiones: 8,
              │       peso: 80
              │     }
              │   }
              │ }
              ├── isActive: true
              ├── createdAt: timestamp
              └── updatedAt: timestamp
```

## 🔐 Seguridad

Las reglas de Firestore garantizan que:
- Solo usuarios autenticados pueden acceder
- Cada usuario solo ve sus propias rutinas
- No se pueden modificar rutinas de otros usuarios
- Validación de tipos de datos al crear/actualizar
- Protección contra campos maliciosos

## 🎨 Próximos Pasos Sugeridos

### Mejorar UI:
1. Agregar botón "Gestionar Rutinas" en la navbar o menú principal
2. Mostrar nombre de rutina activa en alguna parte de la UI
3. Indicador visual cuando se está guardando
4. Notificaciones toast en lugar de alerts

### Funcionalidades Adicionales:
1. Duplicar rutina existente
2. Exportar/Importar rutinas
3. Compartir rutinas entre usuarios
4. Plantillas predefinidas de rutinas
5. Estadísticas de progreso por rutina
6. Historial de entrenamientos

## 🐛 Debug y Testing

### Ver rutinas en Firebase Console:
1. Ve a Firestore Database
2. Navega a: `users/{tu-uid}/routines`
3. Verás todas tus rutinas guardadas

### Logs útiles:
El hook `useRoutines` tiene console.error para todos los errores.
Revisa la consola del navegador para ver cualquier problema.

## 📝 Ejemplo de Uso en Componentes

```javascript
import { useRoutines } from '../hooks/useRoutines';

function MiComponente() {
  const { 
    routines,        // Array de todas las rutinas
    currentRoutine,  // Rutina actualmente seleccionada
    loading,         // Estado de carga
    createRoutine,   // Función para crear
    updateRoutine,   // Función para actualizar
    deleteRoutine    // Función para eliminar
  } = useRoutines();

  // Crear nueva rutina
  const handleCreate = async () => {
    const result = await createRoutine({
      name: 'Mi Nueva Rutina',
      schedule: { days: {}, types: [] },
      selectedExercises: {},
      customDetails: {}
    });
    
    if (result.success) {
      console.log('Rutina creada:', result.id);
    }
  };

  return (
    <div>
      <h2>Mis Rutinas: {routines.length}</h2>
      {routines.map(routine => (
        <div key={routine.id}>{routine.name}</div>
      ))}
    </div>
  );
}
```

## ⚡ Características Avanzadas

### Auto-guardado:
Los cambios se guardan automáticamente después de 1 segundo de inactividad. Esto evita hacer demasiadas escrituras a Firebase.

### Sincronización:
Cuando el usuario inicia sesión, automáticamente se cargan sus rutinas y se activa la última rutina activa.

### Fallback Local:
Si el usuario no está logueado, la app funciona normalmente con estado local (se perderá al recargar).

---

## 🎉 ¡Listo!

El sistema de backend de rutinas está completamente implementado y listo para usar. Solo falta:

1. **Configurar las reglas de Firebase** (FIRESTORE_RULES.md)
2. **Agregar botones en la UI** para abrir el RoutineManagerModal
3. **Probar con usuarios reales**

¿Dudas? Revisa los archivos de documentación o el código comentado.
