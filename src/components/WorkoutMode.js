import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { GridBackground } from './GridBackground';

const WorkoutMode = ({ schedule, selectedExercises, customDetails, datosEjercicios }) => {
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
                        <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold">{ejercicio.nombre}</h3>
                            <p className="text-cyan-400 mt-1">{displayDetails}</p>
                          </div>
                          <input type="checkbox" className="w-6 h-6 accent-green-500" />
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
    </div>
  );
};

export default WorkoutMode;
