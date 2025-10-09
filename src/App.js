import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import DetalleEjercicio from './components/rutinas/DetalleEjercicio';
import ScrollToTop from './components/ScrollToTop';
import PlanificadorModal from './components/PlanificadorModal';
import ScrollToTopButton from './components/ScrollToTopButton';
import HomePage from './components/HomePage';

// Lee el estado desde la URL o devuelve un estado por defecto
const getInitialState = () => {
  const defaultState = { 
    schedule: { days: {}, types: [] }, 
    selectedExercises: {} 
  };

  try {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');

    if (configParam) {
      const decodedJson = decodeURIComponent(configParam);
      const parsedState = JSON.parse(decodedJson);
      
      // Valida y fusiona el estado para asegurar que no falten llaves
      if (parsedState.schedule && parsedState.selectedExercises) {
        return {
          schedule: { ...defaultState.schedule, ...parsedState.schedule },
          selectedExercises: { ...defaultState.selectedExercises, ...parsedState.selectedExercises }
        };
      }
    }
  } catch (error) {
    console.error("Fallo al leer el estado de la URL, usando valores por defecto.", error);
    return defaultState;
  }

  return defaultState;
};

import { useTypewriter } from './hooks/useTypewriter';

function App() {
  // Estado inicializado desde la URL o por defecto
  const initialState = useMemo(() => getInitialState(), []);
  const [selectedExercises, setSelectedExercises] = useState(initialState.selectedExercises);
  const [schedule, setSchedule] = useState(initialState.schedule);

  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  const handleRoutineTypeChange = (type) => {
    setSchedule(prev => {
      const currentTypes = prev.types || [];
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter(t => t !== type)
        : [...currentTypes, type];
      return { ...prev, types: newTypes };
    });
  };

  const handleSaveSchedule = (newDaySchedule) => {
    setSchedule(prev => ({
      ...prev,
      days: newDaySchedule
    }));
    setIsPlannerOpen(false);
  };

  const handleExerciseSelection = (group, exerciseName) => {
    setSelectedExercises(prev => {
      const groupSelections = prev[group] || [];
      const newGroupSelections = groupSelections.includes(exerciseName)
        ? groupSelections.filter(name => name !== exerciseName)
        : [...groupSelections, exerciseName];
      
      return {
        ...prev,
        [group]: newGroupSelections
      };
    });
  };

  const handleClearGroupSelection = (groupToClear) => {
    setSelectedExercises(prev => ({
      ...prev,
      [groupToClear]: []
    }));
  };

  const handleShare = async () => {
    try {
      const stateToShare = {
        schedule,
        selectedExercises,
      };
      const jsonString = JSON.stringify(stateToShare);
      const encodedConfig = encodeURIComponent(jsonString);
      
      const cleanUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${cleanUrl}?config=${encodedConfig}`;

      if (navigator.share) {
        await navigator.share({
          title: 'Mi Plan de Gimnasio',
          text: '¡Mira el plan de entrenamiento que preparé!',
          url: shareUrl,
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        alert('¡Enlace de tu plan copiado al portapapeles!');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      alert('Hubo un error al intentar compartir tu plan.');
    }
  };

  const toRotate = useMemo(() => ["TU NUEVA DISCIPLINA", "DONDE SE ENTRENA DE VERDAD."], []);
  const period = 3500;
  const { text, loopNum } = useTypewriter(toRotate, period);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage typewriterText={text} loopNum={loopNum} toRotate={toRotate} />} />
        <Route 
          path="/:grupo" 
          element={<DetalleEjercicio 
            selectedExercises={selectedExercises} 
            onSelectExercise={handleExerciseSelection} 
            onClearGroup={handleClearGroupSelection} 
            schedule={schedule} 
            routineTypes={schedule.types} // Pasar el array de tipos global
            onRoutineTypeChange={handleRoutineTypeChange} // Pasar el nuevo manejador
            onOpenPlanner={() => setIsPlannerOpen(true)}
            onShare={handleShare} // Pasar la función de compartir
          />} 
        />
      </Routes>
      <PlanificadorModal 
        isOpen={isPlannerOpen} 
        onClose={() => setIsPlannerOpen(false)} 
        schedule={schedule} 
        onSave={handleSaveSchedule} 
      />
      <ScrollToTopButton />
    </>
  );
}

export default App;
