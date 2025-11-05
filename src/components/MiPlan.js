import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridBackground } from './GridBackground';
import predefinedRoutines from '../data/predefinedRoutines.json';

// Objeto para mapear grupos musculares a colores de Tailwind CSS
const groupColors = {
  Pecho: 'bg-red-500/20 border border-red-500/30 text-red-300',
  Espalda: 'bg-blue-500/20 border border-blue-500/30 text-blue-300',
  Hombros: 'bg-purple-500/20 border border-purple-500/30 text-purple-300',
  Biceps: 'bg-pink-500/20 border border-pink-500/30 text-pink-300',
  Triceps: 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300',
  Piernas: 'bg-orange-500/20 border border-orange-500/30 text-orange-300',
  Abdominales: 'bg-green-500/20 border border-green-500/30 text-green-300',
};

const ResumenSemanal = ({ schedule, daysOfWeek }) => {
  const scheduleByDay = useMemo(() => {
    const byDay = {};
    const scheduleDays = schedule.days || {};
    for (const group in scheduleDays) {
      if (scheduleDays[group] && Array.isArray(scheduleDays[group])) {
        scheduleDays[group].forEach(day => {
          if (!byDay[day]) {
            byDay[day] = [];
          }
          byDay[day].push(group.charAt(0).toUpperCase() + group.slice(1));
        });
      }
    }
    return byDay;
  }, [schedule]);

  const todayName = useMemo(() => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[new Date().getDay()];
  }, []);

  return (
    <div className="border border-slate-700/80 rounded-xl shadow-lg">
      <ul className="divide-y divide-slate-700/80">
        {daysOfWeek.map(day => {
          const groupsForDay = scheduleByDay[day];
          const isToday = day === todayName;

          return (
            <li key={day} className={`flex flex-col sm:flex-row sm:items-center text-lg p-4 transition-colors ${isToday ? 'bg-slate-700/50' : 'hover:bg-slate-800/50'}`}>
              <div className="w-full sm:w-36 font-bold text-slate-300 mb-2 sm:mb-0 flex-shrink-0 flex items-center gap-3">
                <span>{day}:</span>
                {isToday && <span className="text-xs font-medium text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full">Hoy</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {groupsForDay && groupsForDay.length > 0 ? (
                  groupsForDay.map(group => (
                    <span key={group} className={`text-sm font-semibold px-3 py-1 rounded-full shadow-md ${groupColors[group] || 'bg-gray-700 text-white'}`}>
                      {group}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic text-sm">Descanso</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const MiPlan = ({ schedule, onOpenPlanner, setSchedule, setSelectedExercises }) => {
  const navigate = useNavigate();
  const scheduleRef = useRef(null);
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const [isWizardActive, setIsWizardActive] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [daysPerWeek, setDaysPerWeek] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleStartWizard = () => {
    setIsWizardActive(true);
    setWizardStep(1);
  };

  const handleSelectDaysPerWeek = (days) => {
    setDaysPerWeek(days);
    setSelectedDays([]); // Limpiar selección anterior
    setWizardStep(2);
  };

  const handleDayToggle = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleShowRecommendation = () => {
    // Lógica de recomendación
    if (daysPerWeek <= 2) {
      setRecommendation('Full Body');
    } else if (daysPerWeek === 3) {
      setRecommendation('Torso-Pierna');
    } else {
      setRecommendation('Push-Pull-Legs');
    }
    setWizardStep(3);
  };

  const handleSavePlan = () => {
    const newSchedule = {};
    const newSelectedExercises = {};
    
    const muscleGroups = {
      'Full Body': ['Pecho', 'Espalda', 'Hombros', 'Biceps', 'Triceps', 'Piernas'],
      'Torso-Pierna': {
        Torso: ['Pecho', 'Espalda', 'Hombros', 'Biceps', 'Triceps'],
        Pierna: ['Piernas', 'Abdominales'],
      },
      'Push-Pull-Legs': {
        Push: ['Pecho', 'Hombros', 'Triceps'],
        Pull: ['Espalda', 'Biceps'],
        Legs: ['Piernas', 'Abdominales'],
      },
    };

    // Función auxiliar para aplicar ejercicios predefinidos
    const applyPredefinedExercises = (routineType, section = null) => {
      const routineConfig = predefinedRoutines[routineType];
      if (!routineConfig) return;

      let exercisesSource = section ? routineConfig[section] : routineConfig.exercises;
      
      for (const [grupoKey, exercises] of Object.entries(exercisesSource)) {
        const grupoLower = grupoKey.toLowerCase();
        
        if (typeof exercises === 'object' && !Array.isArray(exercises)) {
          // Es piernas con subgrupos
          const allPiernasExercises = [];
          for (const [subgrupo, subExercises] of Object.entries(exercises)) {
            allPiernasExercises.push(...subExercises);
          }
          newSelectedExercises[grupoLower] = allPiernasExercises;
        } else {
          // Es un grupo muscular normal
          newSelectedExercises[grupoLower] = [...exercises];
        }
      }
    };

    if (recommendation === 'Full Body') {
      selectedDays.forEach(day => {
        muscleGroups['Full Body'].forEach(group => {
          if (!newSchedule[group.toLowerCase()]) newSchedule[group.toLowerCase()] = [];
          newSchedule[group.toLowerCase()].push(day);
        });
      });
      // Aplicar ejercicios predefinidos de Full Body
      applyPredefinedExercises('Full Body');
      
    } else if (recommendation === 'Torso-Pierna') {
      selectedDays.forEach((day, index) => {
        const type = index % 2 === 0 ? 'Torso' : 'Pierna';
        muscleGroups['Torso-Pierna'][type].forEach(group => {
          if (!newSchedule[group.toLowerCase()]) newSchedule[group.toLowerCase()] = [];
          newSchedule[group.toLowerCase()].push(day);
        });
      });
      // Aplicar ejercicios predefinidos de Torso-Pierna
      applyPredefinedExercises('Torso-Pierna', 'torso');
      applyPredefinedExercises('Torso-Pierna', 'pierna');
      
    } else if (recommendation === 'Push-Pull-Legs') {
      const pplOrder = ['Push', 'Pull', 'Legs'];
      selectedDays.forEach((day, index) => {
        const type = pplOrder[index % 3];
        muscleGroups['Push-Pull-Legs'][type].forEach(group => {
          if (!newSchedule[group.toLowerCase()]) newSchedule[group.toLowerCase()] = [];
          newSchedule[group.toLowerCase()].push(day);
        });
      });
      // Aplicar ejercicios predefinidos de Push-Pull-Legs
      applyPredefinedExercises('Push-Pull-Legs', 'push');
      applyPredefinedExercises('Push-Pull-Legs', 'pull');
      applyPredefinedExercises('Push-Pull-Legs', 'legs');
    }

    setSchedule(prev => ({ ...prev, days: newSchedule }));
    setSelectedExercises(newSelectedExercises); // Aplicar ejercicios predefinidos
    handleCancel(); // Reset wizard
    setShowSuccessModal(true); // Mostrar modal de éxito
    setTimeout(() => {
      scheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleCancel = () => {
    setIsWizardActive(false);
    setWizardStep(1);
    setDaysPerWeek(null);
    setSelectedDays([]);
    setRecommendation(null);
  };

  return (
    <div className="relative text-white min-h-screen p-4 sm:p-8 bg-gray-900">
      <GridBackground />
      <div className="relative z-20 max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="bebas-font text-2xl text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest">
          &larr; VOLVER
        </button>
        
        <h1 className="bebas-font text-5xl md:text-7xl text-center my-8 tracking-wider text-green-500">
          Mi Plan Semanal
        </h1>

        {/* Asistente de Planificación */}
        <div className="bg-gradient-to-b from-slate-800 to-gray-900/50 border border-slate-700/80 rounded-xl shadow-2xl p-4 sm:p-6 mb-10">
          <h2 className="bebas-font text-3xl text-white mb-4">RECOMENDACION DE PLAN:</h2>
          {!isWizardActive ? (
            <div className="text-center">
              <p className="text-slate-400 mb-4">¿No sabes por dónde empezar? Deja que te ayudemos a crear un plan basado en tu disponibilidad.</p>
              <button 
                onClick={handleStartWizard}
                className="bebas-font text-lg tracking-wider px-8 py-3 rounded-lg text-gray-900 bg-green-500 hover:bg-green-600 transition-colors shadow-lg"
              >
                Generar Plan Recomendado
              </button>
            </div>
          ) : (
            <div>
              {wizardStep === 1 && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-4">Paso 1: ¿Cuántos días a la semana puedes entrenar?</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[2, 3, 4, 5, 6].map(day => (
                      <button key={day} onClick={() => handleSelectDaysPerWeek(day)} className="bebas-font text-lg tracking-wider w-24 py-2 rounded-lg text-white bg-slate-700 hover:bg-slate-600 transition-colors">
                        {day} {day === 1 ? 'día' : 'días'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {wizardStep === 2 && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-4">Paso 2: Selecciona los {daysPerWeek} días que entrenarás.</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mb-6">
                    {daysOfWeek.map(day => {
                      const isChecked = selectedDays.includes(day);
                      const isDisabled = !isChecked && selectedDays.length >= daysPerWeek;
                      return (
                        <div 
                          key={day} 
                          onClick={() => !isDisabled && handleDayToggle(day)}
                          className={`cursor-pointer flex items-center p-3 rounded-lg transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'} ${isChecked ? 'bg-slate-600' : 'bg-slate-900/50'}`}>
                          <div className={`w-5 h-5 flex justify-center items-center border-2 ${isChecked ? 'border-cyan-500 bg-cyan-500' : 'border-gray-500'} rounded-md mr-3 transition-all`}>
                            {isChecked && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>}
                          </div>
                          <span className={`font-semibold ${isChecked ? 'text-white' : 'text-slate-300'}`}>{day}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleShowRecommendation} disabled={selectedDays.length !== daysPerWeek} className="bebas-font text-lg tracking-wider px-6 py-2 rounded-lg text-white bg-[#379AA5] hover:bg-[#2A7A87] transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                      Ver Recomendación
                    </button>
                  </div>
                </div>
              )}
              {wizardStep === 3 && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">Paso 3: ¡Aquí tienes tu plan!</h3>
                  <p className="text-slate-400 mb-4">Basado en los <span className="font-bold text-white">{daysPerWeek} días</span> que seleccionaste, te recomendamos una rutina <span className="font-bold text-cyan-400">{recommendation}</span>.</p>
                  
                  <div className="border border-slate-700/80 rounded-xl p-4 mb-6">
                    <h4 className="font-bold text-lg text-slate-300 mb-2">Así se verá tu horario:</h4>
                    <ul className="list-disc list-inside text-slate-400">
                      {selectedDays.map(day => <li key={day}>{day}: {recommendation}</li>)}
                    </ul>
                  </div>

                  <div className="flex justify-end gap-4">
                     <button onClick={handleCancel} className="bebas-font text-lg tracking-wider px-6 py-2 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors">
                      Cancelar
                    </button>
                    <button onClick={handleSavePlan} className="bebas-font text-lg tracking-wider px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors">
                      Aceptar y Guardar Plan
                    </button>
                  </div>
                </div>
              )}
              {/* Los pasos 2 y 3 se añadirán aquí */}
            </div>
          )}
        </div>

        {/* Horario Semanal */}
        <div ref={scheduleRef} className="bg-gradient-to-b from-slate-800 to-gray-900/50 border border-slate-700/80 rounded-xl shadow-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-center sm:text-left mb-6 gap-4 sm:gap-0">
            <h2 className="bebas-font text-3xl text-white">Mi Horario</h2>
            <button 
              onClick={onOpenPlanner}
              className="bebas-font text-base sm:text-lg tracking-wider px-4 sm:px-6 py-2 rounded-lg text-white bg-[#379AA5] hover:bg-[#2A7A87] transition-colors shadow-lg"
            >
              Editar Horario
            </button>
          </div>
          <ResumenSemanal schedule={schedule} daysOfWeek={daysOfWeek} />
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/', { state: { scrollToExercises: true } })}
              className="bebas-font text-xl tracking-wider px-6 py-3 rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 transition-all duration-300 shadow-lg transform hover:scale-105 w-full sm:w-auto"
            >
              Personalizar Ejercicios
            </button>
            <button
              onClick={() => navigate('/entrenamiento')}
              className="bebas-font text-xl tracking-wider px-6 py-3 rounded-lg text-gray-900 bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-lg transform hover:scale-105 w-full sm:w-auto"
            >
              Empezar Entrenamiento
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex justify-center items-center p-4" onClick={() => setShowSuccessModal(false)}>
          <div className="bg-gray-900 border-2 border-green-500 rounded-xl shadow-2xl p-8 w-full max-w-lg text-center relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
            
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="bebas-font text-4xl text-green-500 tracking-wider mb-2">¡PLAN GENERADO!</h2>
              <p className="text-gray-300 text-lg">Tu rutina incluye ejercicios predefinidos listos para entrenar.</p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6 text-left">
              <p className="text-white mb-3 flex items-start gap-2">
                <span className="text-2xl">💡</span>
                <span>
                  Puedes personalizar en{' '}
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate('/', { state: { scrollToExercises: true } });
                    }}
                    className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
                  >
                    Lista de Ejercicios
                  </button>
                  :
                </span>
              </p>
              <ul className="space-y-2 ml-8 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Agregar/quitar ejercicios</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Cambiar series y repeticiones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Ver videos instructivos</span>
                </li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/', { state: { scrollToExercises: true } });
                }}
                className="bebas-font flex-1 bg-cyan-600 text-white px-5 py-2 rounded-lg hover:bg-cyan-700 transition-all shadow-lg text-lg tracking-wider"
              >
                Personalizar Ahora
              </button>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="bebas-font flex-1 bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition-all shadow-lg text-lg tracking-wider"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiPlan;