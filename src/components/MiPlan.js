import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridBackground } from './GridBackground';
import predefinedRoutines from '../data/predefinedRoutines.json';
import UserMenu from './UserMenu';

// PAGINA MI RUTINA /mi-plan

// Objeto para mapear grupos musculares a colores con bordes fuertes y fondos suaves
const groupColors = {
  Pecho: 'bg-red-500/5 border border-red-500/30 text-red-400',
  Espalda: 'bg-blue-500/5 border border-blue-500/30 text-blue-400',
  Hombros: 'bg-purple-500/5 border border-purple-500/30 text-purple-400',
  Biceps: 'bg-pink-500/5 border border-pink-500/30 text-pink-400',
  Triceps: 'bg-indigo-500/5 border border-indigo-500/30 text-indigo-400',
  Piernas: 'bg-orange-500/5 border border-orange-500/30 text-orange-400',
  Abdominales: 'bg-emerald-500/5 border border-emerald-500/30 text-emerald-400',
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
    <div className="border-2 border-slate-700/50 rounded-xl shadow-lg overflow-hidden bg-[#252525]">
      <ul className="divide-y-2 divide-slate-700/30">
        {daysOfWeek.map(day => {
          const groupsForDay = scheduleByDay[day];
          const isToday = day === todayName;
          // Resaltar el día actual
          return (
            <li 
              key={day} 
              className={`flex flex-col sm:flex-row sm:items-center p-4 sm:p-5 transition-colors ${
                isToday ? 'bg-blue-600/10 border-l-4 border-blue-600' : 'hover:bg-slate-800/20'
              }`}
            >
              <div className="w-full sm:w-40 font-bold text-white text-lg sm:text-xl mb-3 sm:mb-0 flex-shrink-0 flex items-center gap-3">
                <span>{day}</span>
                {isToday && (
                  <span className="text-xs font-bold text-blue-50 bg-blue-600 px-3 py-1 rounded-full shadow-lg">
                    HOY
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {groupsForDay && groupsForDay.length > 0 ? (
                  groupsForDay.map(group => (
                    <span 
                      key={group} 
                      className={`text-sm sm:text-base font-bold px-4 py-2 rounded-full shadow-sm ${
                        groupColors[group] || 'bg-gray-700/50 text-white border border-gray-600/30'
                      }`}
                    >
                      {group}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic text-base sm:text-lg font-medium">
                    Descanso
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const MiPlan = ({ 
  schedule, 
  onOpenPlanner, 
  setSchedule, 
  selectedExercises, 
  setSelectedExercises, 
  customDetails, 
  setCustomDetails,
  currentUser,
  currentRoutine,
  routines,
  onSelectRoutine,
  onCreateRoutine,
  onDeleteRoutine,
  onUpdateRoutine
}) => {
  const navigate = useNavigate();
  const scheduleRef = useRef(null);
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Estados del wizard
  const [isWizardActive, setIsWizardActive] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [daysPerWeek, setDaysPerWeek] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Estados para modales
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [showSuccessCreateModal, setShowSuccessCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newlyCreatedRoutineName, setNewlyCreatedRoutineName] = useState('');
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);
  const [showOverwriteWarningModal, setShowOverwriteWarningModal] = useState(false);
  const [pendingPlanData, setPendingPlanData] = useState(null);

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
    const newCustomDetails = {};
    
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

    // Función auxiliar para aplicar ejercicios predefinidos con sus pesos
    const applyPredefinedExercises = (routineType, section = null) => {
      const routineConfig = predefinedRoutines[routineType];
      if (!routineConfig) return;

      let exercisesSource = section ? routineConfig[section] : routineConfig.exercises;
      const defaultWeights = routineConfig.defaultWeights;
      
      for (const [grupoKey, exercises] of Object.entries(exercisesSource)) {
        const grupoLower = grupoKey.toLowerCase();
        
        if (typeof exercises === 'object' && !Array.isArray(exercises)) {
          // Es piernas con subgrupos
          const allPiernasExercises = [];
          for (const [subgrupo, subExercises] of Object.entries(exercises)) {
            allPiernasExercises.push(...subExercises);
          }
          newSelectedExercises[grupoLower] = allPiernasExercises;
          
          // Aplicar pesos predefinidos para piernas
          if (defaultWeights && defaultWeights[grupoLower]) {
            if (!newCustomDetails[grupoLower]) newCustomDetails[grupoLower] = {};
            allPiernasExercises.forEach(exerciseName => {
              if (defaultWeights[grupoLower][exerciseName]) {
                newCustomDetails[grupoLower][exerciseName] = {
                  ...defaultWeights[grupoLower][exerciseName]
                };
              }
            });
          }
        } else {
          // Es un grupo muscular normal
          newSelectedExercises[grupoLower] = [...exercises];
          
          // Aplicar pesos predefinidos
          if (defaultWeights && defaultWeights[grupoLower]) {
            if (!newCustomDetails[grupoLower]) newCustomDetails[grupoLower] = {};
            exercises.forEach(exerciseName => {
              if (defaultWeights[grupoLower][exerciseName]) {
                newCustomDetails[grupoLower][exerciseName] = {
                  ...defaultWeights[grupoLower][exerciseName]
                };
              }
            });
          }
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

    // Guardar los datos del plan generado
    const planData = {
      schedule: { ...schedule, days: newSchedule },
      selectedExercises: newSelectedExercises,
      customDetails: newCustomDetails
    };

    // Si hay una rutina actual, mostrar advertencia de sobrescritura
    if (currentRoutine) {
      setPendingPlanData(planData);
      setShowOverwriteWarningModal(true);
      return;
    }

    // Si no hay rutina, aplicar directamente
    applyPlan(planData);
  };

  // Función para aplicar el plan
  const applyPlan = (planData) => {
    setSchedule(planData.schedule);
    setSelectedExercises(planData.selectedExercises);
    setCustomDetails(planData.customDetails);
    handleCancel(); // Reset wizard
    setShowSuccessModal(true); // Mostrar modal de éxito
    setTimeout(() => {
      scheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Confirmar sobrescritura del plan
  const confirmOverwritePlan = () => {
    setShowOverwriteWarningModal(false);
    if (pendingPlanData) {
      applyPlan(pendingPlanData);
      setPendingPlanData(null);
    }
  };

  const handleCancel = () => {
    setIsWizardActive(false);
    setWizardStep(1);
    setDaysPerWeek(null);
    setSelectedDays([]);
    setRecommendation(null);
  };

  // Funciones del sistema de rutinas
  // Funciones del sistema de rutinas (usando Firebase)
  const handleCreateRoutine = async () => {
    if (!currentUser) {
      setShowLoginRequiredModal(true);
      return;
    }
    
    const newRoutineNumber = (routines?.length || 0) + 1;
    const routineName = `Rutina Personalizada ${newRoutineNumber}`;
    
    // Crear la nueva rutina con los datos actuales (schedule, selectedExercises, customDetails)
    await onCreateRoutine(routineName, {
      schedule,
      selectedExercises,
      customDetails
    });
    
    setNewlyCreatedRoutineName(routineName);
    setShowSuccessCreateModal(true);
  };

  const handleLoadRoutine = (routineId) => {
    if (!routineId) {
      onSelectRoutine(null);
      return;
    }
    
    const routine = routines.find(r => r.id === routineId);
    if (routine) {
      onSelectRoutine(routine);
    }
  };

  const handleSaveRoutine = async () => {
    if (!currentUser) {
      setShowLoginRequiredModal(true);
      return;
    }

    if (!currentRoutine) {
      // Crear nueva rutina con los datos actuales
      const newRoutineNumber = (routines?.length || 0) + 1;
      const routineName = `Rutina Personalizada ${newRoutineNumber}`;
      
      // Pasar los datos actuales al crear la rutina
      await onCreateRoutine(routineName, {
        schedule,
        selectedExercises,
        customDetails
      });
      
      setNewlyCreatedRoutineName(routineName);
      setShowSuccessCreateModal(true);
      return;
    }
    
    setShowSaveModal(true);
  };

  const confirmSaveRoutine = async () => {
    if (currentRoutine) {
      await onUpdateRoutine(currentRoutine.id, {
        schedule,
        selectedExercises,
        customDetails
      });
    }
    setShowSaveModal(false);
  };

  const handleRenameRoutine = () => {
    if (currentRoutine) {
      setNewRoutineName(currentRoutine.name);
      setShowRenameModal(true);
    }
  };

  const confirmRenameRoutine = async () => {
    if (!newRoutineName.trim() || !currentRoutine) return;
    
    await onUpdateRoutine(currentRoutine.id, {
      name: newRoutineName.trim()
    });
    
    setShowRenameModal(false);
    setNewRoutineName('');
  };

  const handleDeleteRoutine = () => {
    if (!currentRoutine) return;
    setShowDeleteModal(true);
  };

  const confirmDeleteRoutine = async () => {
    if (currentRoutine) {
      await onDeleteRoutine(currentRoutine.id);
    }
    setShowDeleteModal(false);
  };

  const getCurrentRoutineName = () => {
    return currentRoutine ? currentRoutine.name : 'Sin Rutina';
  };
  
  return (
    <div className="relative text-white min-h-screen p-4 sm:p-8 bg-[#191919]">
      <GridBackground />
      <div className="relative z-20 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/')} 
            className="bebas-font text-xl sm:text-2xl text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            VOLVER A INICIO
          </button>
          
          <UserMenu />
        </div>
        <div className="text-center mb-10">
          <h1 className="bebas-font text-5xl sm:text-6xl md:text-7xl text-center my-8 mt-14 tracking-wider">
          PLAN DE ENTRENAMIENTO
          </h1>
          <p className="text-center text-gray-400 text-lg max-w-3xl mx-auto">
          Organiza tus ejercicios por día y crea tu propio horario de entrenamiento.
          </p>
        </div>
        
        {/* RECOMENDACION DE RUTINA */}
        <div className="bg-[#191919] border border-slate-700/80 rounded-xl shadow-2xl p-5 sm:p-6 mb-10">
          <h2 className="bebas-font text-3xl sm:text-4xl text-center mb-5 tracking-wider">
            RECOMENDACIÓN DE RUTINA
          </h2>
          {!isWizardActive ? (
            <div className="text-center">
              <p className="text-gray-300 text-base sm:text-lg mb-6 font-medium">
                ¿No sabes por dónde empezar? Deja que te ayudemos a crear una rutina basada en tu disponibilidad.
              </p>
              <button 
                onClick={handleStartWizard}
                className="bebas-font text-2xl tracking-wider px-8 py-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg"
                style={{ minHeight: '60px' }}
              >
                GENERAR UNA RUTINA
              </button>
            </div>
          ) : (
            <div>
              {wizardStep === 1 && (
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#EAEBED] mb-6">
                    Paso 1: ¿Cuántos días a la semana puedes entrenar?
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                    {[2, 3, 4, 5, 6].map(day => (
                      <button 
                        key={day} 
                        onClick={() => handleSelectDaysPerWeek(day)} 
                        className="bebas-font text-xl tracking-wider py-2 sm:py-4 rounded-lg text-[#EAEBED] bg-[#2B384B] hover:bg-gray-900  transition-all shadow-lg"
                        style={{ minHeight: '60px' }}
                      >
                        {day} {day === 1 ? 'DÍA' : 'DÍAS'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {wizardStep === 2 && (
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                    Paso 2: Selecciona los {daysPerWeek} días que entrenarás
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                    {daysOfWeek.map(day => {
                      const isChecked = selectedDays.includes(day);
                      const isDisabled = !isChecked && selectedDays.length >= daysPerWeek;
                      return (
                        <button
                          key={day} 
                          onClick={() => !isDisabled && handleDayToggle(day)}
                          disabled={isDisabled}
                          className={`flex items-center justify-start gap-3 p-4 rounded-lg transition-all border-2 font-bold text-base sm:text-lg ${
                            isDisabled 
                              ? 'opacity-40 cursor-not-allowed bg-[#141B26] border-slate-700/30' 
                              : isChecked 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                                : 'bg-[#1A2332] border-slate-700/50 text-gray-300 hover:bg-[#1E293B] hover:border-blue-500/30'
                          }`}
                          style={{ minHeight: '60px' }}
                        >
                          <div className={`w-7 h-7 flex justify-center items-center border-2 rounded-md transition-all ${
                            isChecked ? 'border-white bg-white' : 'border-slate-500'
                          }`}>
                            {isChecked && (
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                          <span>{day}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={handleShowRecommendation} 
                      disabled={selectedDays.length !== daysPerWeek} 
                      className="bebas-font text-lg sm:text-xl tracking-wider px-8 py-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 border-2 border-blue-500 disabled:border-slate-600 shadow-lg"
                      style={{ minHeight: '60px' }}
                    >
                      VER RECOMENDACIÓN
                    </button>
                  </div>
                </div>
              )}
              {wizardStep === 3 && (
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Paso 3: ¡Aquí tienes tu plan!
                  </h3>
                  <p className="text-gray-300 text-base sm:text-lg mb-6 font-medium">
                    Basado en los <span className="font-bold text-blue-500">{daysPerWeek} días</span> que seleccionaste, te recomendamos una rutina <span className="font-bold text-emerald-400">{recommendation}</span>.
                  </p>
                  
                  <div className="bg-[#252525] rounded-xl p-5 mb-6">
                    <h4 className="font-bold text-lg sm:text-xl text-white mb-4">
                      Así se verá tu horario:
                    </h4>
                    <ul className="space-y-2">
                      {selectedDays.map(day => (
                        <li key={day} className="text-gray-200 text-base sm:text-lg font-medium flex items-center gap-2">
                          <span className="text-blue-500 text-xl">•</span>
                          <span className="font-bold">{day}:</span> {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                    <button 
                      onClick={handleCancel} 
                      className="bebas-font text-lg sm:text-xl tracking-wider px-6 py-4 rounded-lg text-white bg-gray-800 hover:bg-gray-700 transition-all shadow-lg order-2 sm:order-1"
                      style={{ minHeight: '60px' }}
                    >
                    CANCELAR
                    </button>
                    <button 
                      onClick={handleSavePlan} 
                      className="bebas-font text-lg sm:text-xl tracking-wider px-6 py-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg order-1 sm:order-2"
                      style={{ minHeight: '60px' }}
                    >
                    ACEPTAR PLAN
                    </button>
                  </div>
                </div>
              )}
              {/* Los pasos 2 y 3 se añadirán aquí */}
            </div>
          )}
        </div>

        {/* Horario Semanal y Botón de Entrenar - AHORA AL FINAL */}
        <div ref={scheduleRef} className="bg-[#191919] border border-slate-700/80 rounded-xl shadow-2xl p-5 sm:p-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-center sm:text-left mb-6 gap-4">
            <h2 className="bebas-font text-3xl sm:text-4xl tracking-wider">
               MI HORARIO
            </h2>
            <button 
              onClick={onOpenPlanner}
              className="bebas-font text-xl tracking-wider px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg"
              style={{ minHeight: '56px' }}
            >
              EDITAR HORARIO
            </button>
          </div>
          <ResumenSemanal schedule={schedule} daysOfWeek={daysOfWeek} />
          {/* Botones visibles solo en desktop (≥768px) */}
          <div className="mt-8 hidden md:flex flex-col gap-4">
            <button
              onClick={() => navigate('/seleccionar-ejercicios')}
              className="bebas-font text-xl sm:text-2xl tracking-wider px-6 py-4 rounded-lg text-white bg-black hover:from-gray-900 transition-all duration-300 shadow-lg border-2 border-blue-500 flex items-center justify-center gap-3"
              style={{ minHeight: '70px' }}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              PERSONALIZACIÓN AVANZADA
            </button>
            <button
              onClick={() => navigate('/entrenamiento')}
              className="bebas-font text-xl sm:text-2xl tracking-wider px-6 py-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg transform hover:scale-[1.02]"
              style={{ minHeight: '70px' }}
            >
              EMPEZAR A ENTRENAR
            </button>
          </div>
        </div>
        {/* Sistema de Rutinas Guardadas - AHORA DESPUÉS DE RECOMENDACIÓN */}
        <div className="bg-[#191919] border border-slate-700/80 rounded-xl shadow-2xl p-5 sm:p-6 mb-10">
          <h2 className="bebas-font text-3xl sm:text-4xl text-center mb-5 tracking-wider">
            RUTINAS GUARDADAS
          </h2>
          
          {/* Selector de Rutina - Mejorado para móvil */}
          <div className="mb-4">
            <label className="block text-base sm:text-lg font-bold text-gray-300 mb-3">
              Rutina Actual:
            </label>
            <select
              value={currentRoutine?.id || ''}
              onChange={(e) => handleLoadRoutine(e.target.value)}
              className="w-full bg-[#252525] border border-gray-700 text-white text-base sm:text-lg px-4 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium shadow-lg"
              style={{ minHeight: '56px' }}
            >
              <option value="">Ninguna rutina guardada</option>
              {routines && routines.map(routine => (
                <option key={routine.id} value={routine.id}>
                  {routine.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botones de Acción - Mejorados para móvil */}
          <div className="grid grid-cols-2 sm:flex gap-4 mt-6">
            <button
              onClick={handleSaveRoutine}
              className="bebas-font flex items-center justify-center gap-2 bg-black border-2 border-blue-600 text-white px-4 py-2 sm:py-3 rounded-lg hover:bg-[#1f2937] transition-all shadow-lg tracking-wider text-base sm:text-lg col-span-2 sm:col-span-1"
              style={{ minHeight: '48px' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>GUARDAR</span>
            </button>
            
            <button
              onClick={handleCreateRoutine}
              className="bebas-font flex items-center justify-center gap-2 bg-black border-2 border-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-[#1f2937] transition-all shadow-lg tracking-wider text-base sm:text-lg"
              style={{ minHeight: '48px' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>NUEVA</span>
            </button>
            
            <button
              onClick={handleRenameRoutine}
              disabled={!currentRoutine}
              className="bebas-font flex items-center justify-center gap-2 bg-black border-2 border-amber-500 text-white px-4 py-2 rounded-lg hover:bg-[#1f2937] transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed tracking-wider text-base sm:text-lg"
              style={{ minHeight: '48px' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>RENOMBRAR</span>
            </button>
            
            <button
              onClick={handleDeleteRoutine}
              disabled={!currentRoutine}
              className="bebas-font flex items-center justify-center gap-2 bg-black border-2 border-rose-500 text-white px-4 py-2 rounded-lg hover:bg-[#1f2937] transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed tracking-wider text-base sm:text-lg"
              style={{ minHeight: '48px' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>ELIMINAR</span>
            </button>
          </div>
        </div>

      </div>

      {/* Barra fija inferior - Solo en móvil (<768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#191919] backdrop-blur-md shadow-2xl" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex gap-3 p-3">
          <button
            onClick={() => navigate('/seleccionar-ejercicios')}
            className="flex-1 bebas-font text-lg tracking-wider px-4 py-2 rounded-lg text-white bg-gray-800 hover:bg-gray-900 transition-all shadow-lg border-2 border-blue-600 flex flex-col items-center justify-center gap-1"
            style={{ minHeight: '48px' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">Personalización Avanzada </span>
          </button>
          <button
            onClick={() => navigate('/entrenamiento')}
            className="flex-1 bebas-font text-xl tracking-wider px-4 py-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
            style={{ minHeight: '64px' }}
          >
            <span>EMPEZAR A ENTRENAR</span>
          </button>
        </div>
      </div>

      {/* Espaciador para compensar la barra fija en móvil */}
      <div className="md:hidden h-20"></div>

      {/* Modal de Éxito - Plan Generado */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4" onClick={() => setShowSuccessModal(false)}>
          <div className="bg-[#191919] rounded-lg shadow-xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Plan Generado</h3>
              <p className="text-[#EAEBED] text-sm mb-3">
                Tu rutina incluye ejercicios predefinidos listos para entrenar.
              </p>
            </div>
            
            <div className="bg-[#252525] border border-gray-700 rounded-lg p-4 mb-4 text-left">
              <p className="text-white text-sm mb-2 flex items-start gap-2">
                <span className="text-lg">💡</span>
                <span>
                  Puedes personalizar en{' '}
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate('/seleccionar-ejercicios');
                    }}
                    className=" hover:text-cyan-600 underline font-medium bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"
                  >
                    Seleccionar Ejercicios
                  </button>
                </span>
              </p>
              <ul className="space-y-1 ml-6 text-gray-400 text-xs">
                <li>• Agregar/quitar ejercicios</li>
                <li>• Cambiar series, repeticiones y peso</li>
                <li>• Ver videos instructivos</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/', { state: { scrollToExercises: true } });
                }}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all text-sm"
              >
                Personalización Avanzada
              </button>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Guardar Rutina */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4" onClick={() => setShowSaveModal(false)}>
          <div className="bg-[#191919] rounded-lg shadow-xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Guardar Rutina</h3>
              <p className="text-gray-400 text-sm">
                Se guardará en <span className="text-white font-medium">"{getCurrentRoutineName()}"</span>
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmSaveRoutine}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Renombrar Rutina */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4" onClick={() => setShowRenameModal(false)}>
          <div className="bg-[#191919] rounded-lg shadow-xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Renombrar Rutina</h3>
              
              <input
                type="text"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                placeholder="Nuevo nombre"
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-orange-500 transition-all text-sm"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && confirmRenameRoutine()}
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowRenameModal(false);
                  setNewRoutineName('');
                }}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmRenameRoutine}
                disabled={!newRoutineName.trim()}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Renombrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito al Crear/Guardar Nueva Rutina */}
      {showSuccessCreateModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4" onClick={() => setShowSuccessCreateModal(false)}>
          <div className="bg-[#191919] rounded-lg shadow-xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rutina Creada</h3>
              <p className="text-gray-400 text-sm">
                Se guardó como <span className="text-white font-medium">"{newlyCreatedRoutineName}"</span>
              </p>
            </div>
            
            <button 
              onClick={() => setShowSuccessCreateModal(false)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-[#191919] rounded-lg shadow-xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Eliminar Rutina</h3>
              <p className="text-gray-400 text-sm">
                ¿Eliminar <span className="text-white font-medium">"{getCurrentRoutineName()}"</span>?<br/>
                Esta acción no se puede deshacer.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteRoutine}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Login Requerido */}
      {showLoginRequiredModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4" onClick={() => setShowLoginRequiredModal(false)}>
          <div className="bg-[#191919] rounded-lg shadow-xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Inicia Sesión</h3>
              <p className="text-gray-400 text-sm">
                Para guardar o crear rutinas, primero debes iniciar sesión.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowLoginRequiredModal(false);
                  navigate('/login');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm"
              >
                Ir a Iniciar Sesión
              </button>
              <button 
                onClick={() => setShowLoginRequiredModal(false)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Advertencia de Sobrescritura */}
      {showOverwriteWarningModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4" onClick={() => setShowOverwriteWarningModal(false)}>
          <div className="bg-[#191919] rounded-lg shadow-xl p-6 w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">¿Sobrescribir Rutina Actual?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Esto reemplazará completamente tu rutina <span className="text-white font-medium">"{currentRoutine?.name}"</span> con el plan generado.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-2">
                <p className="text-blue-300 text-xs">
                <strong>Sugerencia:</strong> Si quieres conservar tu rutina actual, cancela y crea una nueva rutina desde el botón "Crear Nueva Rutina". Así podrás guardar el plan generado sin perder tu configuración previa.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowOverwriteWarningModal(false);
                  setPendingPlanData(null);
                }}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmOverwritePlan}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all text-sm"
              >
                Sí, Sobrescribir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiPlan;