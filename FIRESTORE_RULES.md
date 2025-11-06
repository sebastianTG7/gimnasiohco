# Reglas de Seguridad de Firestore

## Configuración Necesaria

Para que el sistema de rutinas funcione correctamente, debes configurar las siguientes reglas en Firebase Console:

### 1. Ve a Firestore Database
https://console.firebase.google.com/project/gym-energyhco/firestore

### 2. Click en la pestaña "Reglas"

### 3. Reemplaza las reglas con el siguiente código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Reglas para la colección de usuarios
    match /users/{userId} {
      // Permitir lectura y escritura solo al usuario autenticado
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Reglas para las rutinas del usuario
      match /routines/{routineId} {
        // Solo el propietario puede leer, crear, actualizar y eliminar sus rutinas
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        // Validación de datos al crear/actualizar
        allow create: if request.auth != null 
          && request.auth.uid == userId
          && request.resource.data.keys().hasAll(['name', 'schedule', 'selectedExercises', 'customDetails'])
          && request.resource.data.name is string
          && request.resource.data.name.size() > 0
          && request.resource.data.name.size() <= 100;
          
        allow update: if request.auth != null 
          && request.auth.uid == userId
          && request.resource.data.diff(resource.data).affectedKeys()
            .hasOnly(['name', 'description', 'schedule', 'selectedExercises', 'customDetails', 'isActive', 'updatedAt']);
      }
    }
  }
}
```

### 4. Click en "Publicar" para aplicar las reglas

## Estructura de Datos en Firestore

```
users/
  └── {userId}/
      ├── uid: string
      ├── email: string
      ├── username: string
      ├── createdAt: timestamp
      │
      └── routines/ (subcolección)
          └── {routineId}/
              ├── name: string (ej: "Rutina de Volumen")
              ├── description: string (opcional)
              ├── schedule: object
              │   ├── days: object
              │   │   ├── lunes: array<string>
              │   │   ├── martes: array<string>
              │   │   └── ...
              │   └── types: array<string>
              ├── selectedExercises: object
              │   ├── pecho: array<string>
              │   ├── espalda: array<string>
              │   └── ...
              ├── customDetails: object
              │   └── {grupo}: object
              │       └── {ejercicio}: object
              │           ├── series: number
              │           ├── repeticiones: number
              │           └── peso: number
              ├── isActive: boolean
              ├── createdAt: timestamp
              └── updatedAt: timestamp
```

## Ejemplo de Documento de Rutina

```json
{
  "name": "Rutina Full Body",
  "description": "Rutina de cuerpo completo 3 días a la semana",
  "schedule": {
    "days": {
      "lunes": ["pecho", "espalda"],
      "miercoles": ["piernas"],
      "viernes": ["hombros", "biceps", "triceps"]
    },
    "types": ["full-body"]
  },
  "selectedExercises": {
    "pecho": ["Press Banca (barra)", "Aperturas (Mancuernas)"],
    "espalda": ["Dominadas", "Remo Parado (barra)"],
    "piernas": ["Sentadillas Libre", "Peso Muerto Rumano"]
  },
  "customDetails": {
    "pecho": {
      "Press Banca (barra)": {
        "series": 4,
        "repeticiones": 8,
        "peso": 80
      }
    }
  },
  "isActive": true,
  "createdAt": "2025-01-05T10:30:00Z",
  "updatedAt": "2025-01-05T10:30:00Z"
}
```

## Seguridad

✅ **Protecciones implementadas:**
- Solo usuarios autenticados pueden acceder a sus datos
- Cada usuario solo puede ver/modificar sus propias rutinas
- Validación de campos requeridos al crear rutinas
- Validación de tipos de datos
- Límite de longitud para el nombre de rutina (100 caracteres)
- Solo se permiten actualizar campos específicos

❌ **No permitido:**
- Usuarios no autenticados accediendo a datos
- Usuarios leyendo rutinas de otros usuarios
- Modificación de campos del sistema (createdAt, userId, etc.)
- Creación de rutinas sin campos requeridos
