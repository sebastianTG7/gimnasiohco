# Configuración de Firebase

## Pasos para obtener tu configuración de Firebase:

### 1. Ve a Firebase Console
https://console.firebase.google.com

### 2. Selecciona tu proyecto "gym-energyhco"

### 3. Ve a Configuración del Proyecto
- Click en el ícono de engranaje (⚙️) junto a "Descripción general del proyecto"
- Selecciona "Configuración del proyecto"

### 4. En la sección "Tus aplicaciones"
- Si no has registrado una app web, haz click en el ícono `</>`
- Dale un nombre (ej: "Energy Gym Web")
- **NO** marques "Configura también Firebase Hosting" (ya lo tienes)
- Click en "Registrar app"

### 5. Copia la configuración
Verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "gym-energyhco.firebaseapp.com",
  projectId: "gym-energyhco",
  storageBucket: "gym-energyhco.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

### 6. Reemplaza la configuración en `src/firebase.js`
Copia esos valores y reemplázalos en el archivo `src/firebase.js`

### 7. Habilita Authentication
- En el menú lateral, ve a "Authentication"
- Click en "Comenzar" (Get Started)
- Habilita "Correo electrónico/contraseña"
- Guarda

### 8. Habilita Firestore Database
- En el menú lateral, ve a "Firestore Database"
- Click en "Crear base de datos"
- Selecciona "Comenzar en modo de prueba" (luego configuraremos las reglas)
- Elige la ubicación más cercana (ej: us-central)
- Click en "Habilitar"

### 9. Configurar Reglas de Seguridad (IMPORTANTE)
En Firestore, ve a "Reglas" y reemplaza con esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regla para usuarios
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Reglas para rutinas del usuario
      match /routines/{routineId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Publica las reglas.

---

## ¿Ya tienes la configuración?
Una vez que completes estos pasos, avísame y continuamos con la integración en el código.
