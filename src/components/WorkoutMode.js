import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GridBackground } from './GridBackground';
import VideoPlayer from './VideoPlayer';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import UserMenu from './UserMenu';

// Componente para el Modal de Video
const VideoModal = ({ videoUrl, title, onClose }) => {
  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl">&times;</button>
        </div>
        <div className="flex-grow">
          <VideoPlayer videoUrl={videoUrl} title={title} />
        </div>
      </div>
    </div>
  );
};

const WorkoutMode = ({ schedule, selectedExercises, customDetails, datosEjercicios }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlreadySavedModal, setShowAlreadySavedModal] = useState(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const daysMap = useMemo(() => ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], []);
  const todayName = daysMap[new Date().getDay()];

  // Encontrar los grupos musculares de hoy
  const todaysMuscleGroups = useMemo(() => {
    const groups = [];
    const scheduleDays = schedule.days || {};
    for (const group in scheduleDays) {
      if (scheduleDays[group] && scheduleDays[group].includes(todayName)) {
        groups.push(group);
      }
    }
    return groups;
  }, [schedule, todayName]);

  // Generar la rutina de hoy, agrupada por grupo muscular
  const todaysRoutine = useMemo(() => {
    return todaysMuscleGroups.map(grupo => {
      const selections = selectedExercises[grupo] || [];
      const grupoData = datosEjercicios[grupo];
      
      // Verificar si tiene subgrupos (como piernas)
      const hasSubgroups = grupoData?.subgrupos && Array.isArray(grupoData.subgrupos);
      
      if (hasSubgroups) {
        // Para grupos con subgrupos (piernas), mantener la estructura de subgrupos
        const exercisesBySubgroup = grupoData.subgrupos.map(subgrupo => {
          const subgroupExercises = subgrupo.ejercicios
            .filter(ej => selections.includes(ej.nombre))
            .map(ej => ({...ej, grupo}));
          
          return {
            subgroupName: subgrupo.nombre,
            exercises: subgroupExercises
          };
        }).filter(sg => sg.exercises.length > 0); // Solo incluir subgrupos con ejercicios seleccionados

        return {
          groupName: grupo.charAt(0).toUpperCase() + grupo.slice(1),
          hasSubgroups: true,
          subgroups: exercisesBySubgroup
        };
      } else {
        // Para grupos sin subgrupos
        const allExercisesForGroup = grupoData?.imagenes?.map(e => ({...e, grupo})) || [];
        const exercisesForThisGroup = selections.length > 0
          ? allExercisesForGroup.filter(ej => selections.includes(ej.nombre))
          : [];

        return {
          groupName: grupo.charAt(0).toUpperCase() + grupo.slice(1),
          hasSubgroups: false,
          exercises: exercisesForThisGroup
        };
      }
    });
  }, [todaysMuscleGroups, selectedExercises, datosEjercicios]);

  // Calcular total de ejercicios y progreso
  const { totalExercises, progressPercentage } = useMemo(() => {
    let total = 0;
    todaysRoutine.forEach(groupData => {
      if (groupData.hasSubgroups) {
        groupData.subgroups.forEach(sg => {
          total += sg.exercises.length;
        });
      } else {
        total += groupData.exercises.length;
      }
    });
    
    const completed = completedExercises.size;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { totalExercises: total, progressPercentage: percentage };
  }, [todaysRoutine, completedExercises]);

  // Toggle ejercicio completado
  const toggleExerciseComplete = (exerciseId) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  // Función para verificar si ya guardó hoy
  const checkIfSavedToday = async () => {
    if (!currentUser) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
      const workoutRef = collection(db, 'users', currentUser.uid, 'workoutHistory');
      const q = query(
        workoutRef,
        where('date', '>=', Timestamp.fromDate(today)),
        where('date', '<', Timestamp.fromDate(tomorrow))
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error al verificar entrenamientos:', error);
      return false;
    }
  };

  // Función para guardar el progreso
  const handleSaveProgress = async () => {
    if (!currentUser) {
      setShowLoginRequiredModal(true);
      return;
    }

    // Verificar si ya guardó hoy
    const alreadySaved = await checkIfSavedToday();
    if (alreadySaved) {
      setShowAlreadySavedModal(true);
      return;
    }

    setShowSaveModal(true);
  };

  // Confirmar guardado
  const confirmSaveProgress = async () => {
    setShowSaveModal(false);
    setIsSaving(true);

    try {
      const workoutData = {
        date: Timestamp.now(),
        dayName: todayName,
        totalExercises: totalExercises,
        completedCount: completedExercises.size,
        progressPercentage: progressPercentage,
        status: progressPercentage === 100 ? 'completado' : 'incompleto',
        exercises: []
      };

      // Recopilar todos los ejercicios con sus detalles
      todaysRoutine.forEach(groupData => {
        const processExercises = (exercises, groupName) => {
          exercises.forEach(ejercicio => {
            const exerciseId = `${groupName}-${ejercicio.nombre}`;
            const isCompleted = completedExercises.has(exerciseId);
            const details = customDetails[groupName.toLowerCase()]?.[ejercicio.nombre];

            // Obtener valores de customDetails (fuente primaria)
            let series = details?.series || details?.Series || 0;
            let reps = details?.reps || details?.repeticiones || details?.Reps || 0;
            let peso = details?.peso || details?.Peso || 0;

            // Si customDetails no tiene datos, parsear desde ejercicio.detalles como fallback
            if (!series && !reps && !peso && ejercicio.detalles) {
              const detallesStr = ejercicio.detalles;
              const seriesMatch = detallesStr.match(/(\d+)\s*series/i);
              const repsMatch = detallesStr.match(/(\d+)\s*(reps?|repeticiones)/i);
              const pesoMatch = detallesStr.match(/(\d+)\s*kg/i);
              
              if (seriesMatch) series = parseInt(seriesMatch[1]);
              if (repsMatch) reps = parseInt(repsMatch[1]);
              if (pesoMatch) peso = parseInt(pesoMatch[1]);
            }

            workoutData.exercises.push({
              name: ejercicio.nombre,
              group: groupName,
              completed: isCompleted,
              series: series,
              reps: reps,
              peso: peso
            });
          });
        };

        if (groupData.hasSubgroups) {
          groupData.subgroups.forEach(sg => {
            processExercises(sg.exercises, groupData.groupName);
          });
        } else {
          processExercises(groupData.exercises, groupData.groupName);
        }
      });

      // Guardar en Firestore
      await addDoc(collection(db, 'users', currentUser.uid, 'workoutHistory'), workoutData);

      setIsSaving(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error al guardar progreso:', error);
      setIsSaving(false);
      setErrorMessage(error.message || 'Error desconocido al guardar el progreso');
      setShowErrorModal(true);
    }
  };

  // Confirmar guardar otro progreso
  const confirmSaveAnotherProgress = async () => {
    setShowAlreadySavedModal(false);
    setShowSaveModal(true);
  };

  return (
    <div className="relative text-white min-h-screen p-8 bg-gray-900 pb-32">
      <GridBackground />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/mi-plan" className="bebas-font text-2xl text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest">&larr; VOLVER A MI PLAN</Link>
          <UserMenu />
        </div>
        
        <h1 className="bebas-font text-5xl md:text-7xl text-center my-8 tracking-wider">
          Entrenamiento de Hoy: <span className="text-green-500">{todayName}</span>
        </h1>

        {/* Barra de progreso del entrenamiento */}
        {totalExercises > 0 && (
          <div className="bg-gray-800 rounded-xl p-5 sm:p-6 mb-8 border-2 border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Progreso del Entrenamiento</h2>
              <span className="text-3xl sm:text-4xl font-bold text-cyan-400">{progressPercentage}%</span>
            </div>
            <div 
              className="h-4 sm:h-5 bg-gray-700 rounded-full overflow-hidden mb-3 border border-gray-600"
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Progreso de entrenamiento"
            >
              <div 
                className={`h-full transition-all duration-500 ${
                  progressPercentage === 100 
                    ? 'bg-gradient-to-r from-green-500 to-green-400' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm sm:text-base">
              <p className="text-gray-400">
                <span className="font-bold text-white">{completedExercises.size}</span> de <span className="font-bold text-white">{totalExercises}</span> ejercicios completados
              </p>
              {progressPercentage === 100 && (
                <span className="text-green-400 font-bold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ¡Completado!
                </span>
              )}
            </div>
          </div>
        )}

        {todaysRoutine.length > 0 ? (
          <div className="space-y-12">
            {todaysRoutine.map(groupData => (
              <div key={groupData.groupName}>
                <h2 className="bebas-font text-4xl text-cyan-400 tracking-wider border-b-2 border-cyan-400/30 pb-2 mb-6">{groupData.groupName}</h2>
                
                {groupData.hasSubgroups ? (
                  // Renderizar grupos con subgrupos (piernas)
                  <div className="space-y-8">
                    {groupData.subgroups.map(subgroupData => (
                      <div key={subgroupData.subgroupName}>
                        <h3 className="bebas-font text-2xl text-orange-400 tracking-wider mb-4 pl-4 border-l-4 border-orange-400">
                          {subgroupData.subgroupName}
                        </h3>
                        <div className="space-y-6">
                          {subgroupData.exercises.map((ejercicio, index) => {
                            const details = customDetails[groupData.groupName.toLowerCase()]?.[ejercicio.nombre];
                            
                            // Construir el texto de detalles incluyendo peso
                            let displayDetails = ejercicio.detalles;
                            if (details && (details.series || details.reps || details.peso)) {
                              const series = details.series || '?';
                              const reps = details.reps || details.repeticiones || '?';
                              const peso = details.peso;
                              
                              displayDetails = `${series} series × ${reps} reps`;
                              if (peso) {
                                displayDetails += ` • ${peso} kg`;
                              }
                            }
                            
                            const exerciseId = `${groupData.groupName}-${ejercicio.nombre}`;
                            const isCompleted = completedExercises.has(exerciseId);

                            return (
                              <div 
                                key={index} 
                                className={`bg-gray-800 p-3 md:p-4 rounded-lg shadow-lg flex items-center gap-3 md:gap-4 cursor-pointer transition-all duration-200 border-2 ${
                                  isCompleted 
                                    ? 'border-green-500 bg-green-900/20' 
                                    : 'border-transparent hover:bg-gray-700'
                                }`}
                                onClick={() => {
                                  setSelectedVideoUrl(ejercicio.videoUrl);
                                  setSelectedVideoTitle(ejercicio.nombre);
                                }}
                              >
                                {/* Contenedor de la Imagen */}
                                <div className="w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
                                  <img 
                                    src={ejercicio.src} 
                                    alt={ejercicio.nombre} 
                                    className={`w-full h-full object-cover rounded-md ${isCompleted ? 'opacity-60' : ''}`}
                                  />
                                </div>

                                {/* Contenido del Ejercicio */}
                                <div className="flex-grow">
                                  <h3 className={`text-base md:text-xl font-bold ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                                    {ejercicio.nombre}
                                  </h3>
                                  <p className={`mt-1 text-xs md:text-sm font-medium ${isCompleted ? 'text-gray-600' : 'text-cyan-400'}`}>
                                    {displayDetails}
                                  </p>
                                </div>

                                {/* Checkbox */}
                                <div className="pl-2 md:pl-4" onClick={(e) => e.stopPropagation()}>
                                  <input 
                                    type="checkbox" 
                                    checked={isCompleted}
                                    onChange={() => toggleExerciseComplete(exerciseId)}
                                    className="w-6 h-6 md:w-7 md:h-7 cursor-pointer accent-green-500" 
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : groupData.exercises.length > 0 ? (
                  // Renderizar grupos sin subgrupos
                  <div className="space-y-6">
                    {groupData.exercises.map((ejercicio, index) => {
                      const details = customDetails[groupData.groupName.toLowerCase()]?.[ejercicio.nombre];
                      
                      // Construir el texto de detalles incluyendo peso
                      let displayDetails = ejercicio.detalles;
                      if (details && (details.series || details.reps || details.peso)) {
                        const series = details.series || '?';
                        const reps = details.reps || details.repeticiones || '?';
                        const peso = details.peso;
                        
                        displayDetails = `${series} series × ${reps} reps`;
                        if (peso) {
                          displayDetails += ` • ${peso} kg`;
                        }
                      }
                      
                      const exerciseId = `${groupData.groupName}-${ejercicio.nombre}`;
                      const isCompleted = completedExercises.has(exerciseId);

                      return (
                        <div 
                          key={index} 
                          className={`bg-gray-800 p-3 md:p-4 rounded-lg shadow-lg flex items-center gap-3 md:gap-4 cursor-pointer transition-all duration-200 border-2 ${
                            isCompleted 
                              ? 'border-green-500 bg-green-900/20' 
                              : 'border-transparent hover:bg-gray-700'
                          }`}
                          onClick={() => {
                            setSelectedVideoUrl(ejercicio.videoUrl);
                            setSelectedVideoTitle(ejercicio.nombre);
                          }}
                        >
                          {/* Contenedor de la Imagen */}
                          <div className="w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
                            <img 
                              src={ejercicio.src} 
                              alt={ejercicio.nombre} 
                              className={`w-full h-full object-cover rounded-md ${isCompleted ? 'opacity-60' : ''}`}
                            />
                          </div>

                          {/* Contenido del Ejercicio */}
                          <div className="flex-grow">
                            <h3 className={`text-base md:text-xl font-bold ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                              {ejercicio.nombre}
                            </h3>
                            <p className={`mt-1 text-xs md:text-sm font-medium ${isCompleted ? 'text-gray-600' : 'text-cyan-400'}`}>
                              {displayDetails}
                            </p>
                          </div>

                          {/* Checkbox */}
                          <div className="pl-2 md:pl-4" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={isCompleted}
                              onChange={() => toggleExerciseComplete(exerciseId)}
                              className="w-6 h-6 md:w-7 md:h-7 cursor-pointer accent-green-500" 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-lg italic">No se seleccionó ningún ejercicio para este grupo.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-400">No hay nada planificado para hoy.</h2>
            <p className="text-lg text-gray-500 mt-4">Usa el planificador para añadir una rutina.</p>
          </div>
        )}

        {/* Botón Guardar Progreso - Sticky en la parte inferior */}
        {todaysRoutine.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t-2 border-cyan-500 p-4 z-50">
            <div className="max-w-4xl mx-auto flex gap-3">
              <button
                onClick={handleSaveProgress}
                disabled={isSaving}
                className="bebas-font flex-1 text-xl tracking-wider px-6 py-4 rounded-lg text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    GUARDANDO...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    GUARDAR PROGRESO
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Video */}
      <VideoModal
        videoUrl={selectedVideoUrl}
        title={selectedVideoTitle}
        onClose={() => setSelectedVideoUrl(null)}
      />

      {/* Modal de Confirmación de Guardado */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4" onClick={() => setShowSaveModal(false)}>
          <div className="bg-gray-900 border-2 border-cyan-500 rounded-xl shadow-xl p-6 w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Guardar Progreso</h3>
              <p className="text-gray-300 text-base mb-2">
                Se guardará tu entrenamiento de hoy con:
              </p>
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-cyan-400 font-bold text-lg">{completedExercises.size} de {totalExercises} ejercicios completados</p>
                <p className="text-sm text-gray-400 mt-2">
                  Estado: <span className={progressPercentage === 100 ? 'text-green-400 font-bold' : 'text-orange-400 font-bold'}>
                    {progressPercentage === 100 ? 'COMPLETADO' : 'INCOMPLETO'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmSaveProgress}
                className="flex-1 bg-cyan-600 text-white px-4 py-3 rounded-lg hover:bg-cyan-700 transition-all font-bold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4" onClick={() => setShowSuccessModal(false)}>
          <div className="bg-gray-900 border-2 border-green-500 rounded-xl shadow-xl p-6 w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">¡Progreso Guardado!</h3>
              <p className="text-gray-300 text-base">
                Tu entrenamiento se ha guardado exitosamente.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/historial-entrenamiento');
                }}
                className="bg-cyan-600 text-white px-4 py-3 rounded-lg hover:bg-cyan-700 transition-all font-bold"
              >
                Ver Historial
              </button>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ya Guardó Hoy */}
      {showAlreadySavedModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4" onClick={() => setShowAlreadySavedModal(false)}>
          <div className="bg-gray-900 border-2 border-orange-500 rounded-xl shadow-xl p-6 w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Ya Guardaste Hoy</h3>
              <p className="text-gray-300 text-base mb-4">
                Ya tienes un progreso guardado para hoy. ¿Deseas guardar otro entrenamiento adicional?
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAlreadySavedModal(false)}
                className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmSaveAnotherProgress}
                className="flex-1 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-all font-bold"
              >
                Guardar Otro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Login Requerido */}
      {showLoginRequiredModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4" onClick={() => setShowLoginRequiredModal(false)}>
          <div className="bg-gray-900 border-2 border-cyan-500 rounded-xl shadow-xl p-6 w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Inicia Sesión</h3>
              <p className="text-gray-300 text-base mb-4">
                Para guardar tu progreso de entrenamiento, primero debes iniciar sesión.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowLoginRequiredModal(false);
                  navigate('/login');
                }}
                className="bg-cyan-600 text-white px-4 py-3 rounded-lg hover:bg-cyan-700 transition-all font-bold"
              >
                Ir a Iniciar Sesión
              </button>
              <button 
                onClick={() => setShowLoginRequiredModal(false)}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Error */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center p-4" onClick={() => setShowErrorModal(false)}>
          <div className="bg-gray-900 border-2 border-red-500 rounded-xl shadow-xl p-6 w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Error al Guardar</h3>
              <p className="text-gray-300 text-base mb-4">
                No se pudo guardar tu progreso de entrenamiento.
              </p>
              {errorMessage.includes('permission') && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mb-4">
                  <p className="text-orange-300 text-sm">
                    <strong>Problema de permisos:</strong> Contacta al administrador para configurar las reglas de seguridad de Firebase.
                  </p>
                </div>
              )}
              <p className="text-gray-500 text-xs font-mono mt-2">
                {errorMessage}
              </p>
            </div>
            
            <button 
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutMode;
