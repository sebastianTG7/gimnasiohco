import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { GridBackground } from './GridBackground';
import VideoPlayer from './VideoPlayer'; // Importar VideoPlayer

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
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [completedExercises, setCompletedExercises] = useState(new Set());
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

  return (
    <div className="relative text-white min-h-screen p-8 bg-gray-900">
      <GridBackground />
      <div className="relative z-10 max-w-4xl mx-auto">
        <Link to={-1} className="bebas-font text-2xl text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest">&larr; VOLVER</Link>
        
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
      </div>
      <VideoModal 
        videoUrl={selectedVideoUrl} 
        title={selectedVideoTitle} 
        onClose={() => setSelectedVideoUrl(null)} 
      />
    </div>
  );
};

export default WorkoutMode;
