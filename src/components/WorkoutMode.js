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
      const allExercisesForGroup = datosEjercicios[grupo]?.subgrupos
        ? datosEjercicios[grupo].subgrupos.flatMap(sg => sg.ejercicios.map(e => ({...e, grupo})))
        : datosEjercicios[grupo]?.imagenes.map(e => ({...e, grupo})) || [];

      let exercisesForThisGroup = [];
      if (selections.length > 0) {
        exercisesForThisGroup = allExercisesForGroup.filter(ej => selections.includes(ej.nombre));
      } 

      return {
        groupName: grupo.charAt(0).toUpperCase() + grupo.slice(1),
        exercises: exercisesForThisGroup,
      };
    });
  }, [todaysMuscleGroups, selectedExercises, datosEjercicios]);

  return (
    <div className="relative text-white min-h-screen p-8 bg-gray-900">
      <GridBackground />
      <div className="relative z-10 max-w-4xl mx-auto">
        <Link to={-1} className="bebas-font text-2xl text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest">&larr; VOLVER</Link>
        
        <h1 className="bebas-font text-5xl md:text-7xl text-center my-8 tracking-wider">
          Entrenamiento de Hoy: <span className="text-green-500">{todayName}</span>
        </h1>

        {todaysRoutine.length > 0 ? (
          <div className="space-y-12">
            {todaysRoutine.map(groupData => (
              <div key={groupData.groupName}>
                <h2 className="bebas-font text-4xl text-cyan-400 tracking-wider border-b-2 border-cyan-400/30 pb-2 mb-6">{groupData.groupName}</h2>
                {groupData.exercises.length > 0 ? (
                  <div className="space-y-6">
                    {groupData.exercises.map((ejercicio, index) => {
                      const details = customDetails[groupData.groupName.toLowerCase()]?.[ejercicio.nombre];
                      const displayDetails = (details && (details.series || details.reps))
                        ? `${details.series || '?'} series de ${details.reps || '?'} repeticiones`
                        : ejercicio.detalles;

                      return (
                        <div 
                          key={index} 
                          className="bg-gray-800 p-3 md:p-4 rounded-lg shadow-lg flex items-center gap-3 md:gap-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => {
                            setSelectedVideoUrl(ejercicio.videoUrl);
                            setSelectedVideoTitle(ejercicio.nombre);
                          }}
                        >
                          {/* Contenedor de la Imagen */}
                          <div className="w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
                            <img src={ejercicio.src} alt={ejercicio.nombre} className="w-full h-full object-cover rounded-md" />
                          </div>

                          {/* Contenido del Ejercicio */}
                          <div className="flex-grow">
                            <h3 className="text-base md:text-xl font-bold">{ejercicio.nombre}</h3>
                            <p className="text-cyan-400 mt-1 text-xs md:text-sm">{displayDetails}</p>
                          </div>

                          {/* Checkbox */}
                          <div className="pl-2 md:pl-4" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="w-7 h-7 md:w-8 md:h-8 accent-green-500 rounded-md" />
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
