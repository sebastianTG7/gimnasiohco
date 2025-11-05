# Rutinas Predefinidas - Guía de Configuración

Este archivo (`predefinedRoutines.json`) contiene las rutinas predefinidas que se aplican automáticamente cuando un usuario genera un plan recomendado en "Mi Plan".

## Estructura del Archivo

El archivo JSON tiene 3 tipos de rutinas principales:

### 1. Full Body
Rutina completa que trabaja todos los grupos musculares en cada sesión.

```json
"Full Body": {
  "exercises": {
    "pecho": ["Press Banca (barra)", "Press Inclinado (barra)"],
    "espalda": ["Remo Parado (barra)", "Dominadas"],
    ...
  }
}
```

### 2. Torso-Pierna
Rutina dividida en días de torso (tren superior) y pierna (tren inferior).

```json
"Torso-Pierna": {
  "torso": {
    "pecho": [...],
    "espalda": [...],
    ...
  },
  "pierna": {
    "piernas": {
      "Cuádriceps": [...],
      "Isquiotibiales o Femorales": [...],
      "Glúteos": [...]
    },
    "abdominales": [...]
  }
}
```

### 3. Push-Pull-Legs
Rutina dividida en empuje, jalón y piernas.

```json
"Push-Pull-Legs": {
  "push": {
    "pecho": [...],
    "hombros": [...],
    "triceps": [...]
  },
  "pull": {
    "espalda": [...],
    "biceps": [...]
  },
  "legs": {
    "piernas": {...},
    "abdominales": [...]
  }
}
```

## Cómo Modificar las Rutinas

### Reglas Importantes:

1. **Los nombres de los ejercicios deben coincidir EXACTAMENTE** con los nombres que aparecen en `App.js` en el objeto `datosEjercicios`.

2. **Grupos musculares disponibles:**
   - `pecho`
   - `espalda`
   - `hombros`
   - `biceps`
   - `triceps`
   - `piernas` (con subgrupos: Cuádriceps, Isquiotibiales o Femorales, Glúteos)
   - `abdominales`

3. **Para piernas**, usa la estructura con subgrupos:
   ```json
   "piernas": {
     "Cuádriceps": ["Ejercicio 1", "Ejercicio 2"],
     "Isquiotibiales o Femorales": ["Ejercicio 1"],
     "Glúteos": ["Ejercicio 1", "Ejercicio 2"]
   }
   ```

### Ejemplos de Modificación:

#### Agregar un ejercicio a Pecho en Full Body:
```json
"pecho": ["Press Banca (barra)", "Press Inclinado (barra)", "Aperturas (Cable)"]
```

#### Cambiar ejercicios de Bíceps en Push-Pull-Legs:
```json
"pull": {
  "biceps": ["Curl Banco Inclinado", "Curl Concentrado a 1 brazo"]
}
```

#### Modificar ejercicios de Glúteos:
```json
"Glúteos": ["Hip Thrust", "Peso Muerto Sumo", "Patadas en Máquina"]
```

## Nombres Exactos de Ejercicios por Grupo

### Pecho:
- Press Banca (barra)
- Press Inclinado (barra)
- Press Banca (Mancuernas)
- Press Inclinado (Mancuernas)
- Press Máquina
- Aperturas (Mancuernas)
- Aperturas (Cable)
- Aperturas Pec Fly
- Fondos

### Espalda:
- Remo Parado (barra)
- Remo a 1 mano (Mancuerna)
- Remo a 1 mano (Polea)
- Remo Máquina
- Dominadas
- Jalón (Agarre Abierto)
- Jalón (Agarre Cerrado)
- Remo sentado (Polea, Abierto)
- Remo sentado (Polea, Cerrado)

### Hombros:
- Press Militar (barra)
- Press Militar (mancuernas)
- Aperturas Laterales
- Elevaciones Frontales
- Elevaciones Posteriores
- Encogimientos de Hombros (Trapecios)

### Bíceps:
- Curl Parado (Barra)
- Curl Banco Scott
- Curl Banco Inclinado
- Curl Araña
- Curl Concentrado a 1 brazo
- Curl Martillo

### Tríceps:
- Press Frances
- Fondos para Tríceps
- Empujon Parado (Cable)
- Empujon Tras Nuca (Cable)
- Empujon Tras Nuca (Mancuerna)
- Patada de Tríceps
- Extensiones en Polea Alta Cruzada

### Piernas - Cuádriceps:
- Sentadillas Libre
- Sentadilla Hack
- Sentadillas Multipower
- Sentadilla Squat Péndulo
- Prensa 45 grados
- Extensiones de Cuádriceps
- Búlgaras para Cuádriceps
- Zancadas
- Aductores

### Piernas - Isquiotibiales o Femorales:
- Peso Muerto Rumano
- Peso Muerto B-Stand
- Curl Femoral Tumbado
- Curl Femoral Hammer
- Curl Femoral Sentado
- Curl Nórdico

### Piernas - Glúteos:
- Hip Thrust
- Puentes
- Búlgaras para Glúteos
- Peso Muerto Sumo
- Sentadilla Sumo
- Patadas con Cable
- Patadas en Máquina
- Buenos Días
- Step-ups
- Abductores
- Hiper extensión para Glúteos

### Abdominales:
- Crunches
- Palo Press (Cable)
- Elevación de Piernas
- Caminata de Granjero
- Plancha Frontal

## Tips para Diseñar Rutinas Efectivas:

1. **Full Body**: 1-2 ejercicios por grupo muscular
2. **Torso-Pierna**: 2-3 ejercicios por grupo en días de torso, 2-3 por subgrupo en días de pierna
3. **Push-Pull-Legs**: 2-3 ejercicios por grupo muscular

## Errores Comunes:

❌ **Incorrecto:** `"Press de banca"` (nombre diferente)
✅ **Correcto:** `"Press Banca (barra)"`

❌ **Incorrecto:** Piernas como array simple
```json
"piernas": ["Sentadillas Libre"]
```
✅ **Correcto:** Piernas con subgrupos
```json
"piernas": {
  "Cuádriceps": ["Sentadillas Libre"]
}
```

## Aplicación de las Rutinas:

Cuando un usuario:
1. Va a "Mi Plan"
2. Hace clic en "Generar Plan Recomendado"
3. Selecciona días de entrenamiento
4. Ve la recomendación (Full Body, Torso-Pierna o Push-Pull-Legs)
5. Hace clic en "Aceptar y Guardar Plan"

➡️ **Se aplican automáticamente:**
- El horario semanal
- Los ejercicios predefinidos de este archivo JSON

El usuario puede luego ir a cada grupo muscular y modificar/agregar/quitar ejercicios manualmente si lo desea.
