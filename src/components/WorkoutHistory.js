import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GridBackground } from './GridBackground';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const WorkoutHistory = () => {
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadWorkoutHistory();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadWorkoutHistory = async () => {
    try {
      const workoutRef = collection(db, 'users', currentUser.uid, 'workoutHistory');
      const q = query(workoutRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const workoutList = [];
      querySnapshot.forEach((doc) => {
        workoutList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setWorkouts(workoutList);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  if (!currentUser) {
    return (
      <div className="relative text-white min-h-screen p-8 bg-gray-900">
        <GridBackground />
        <div className="relative z-10 max-w-4xl mx-auto text-center py-16">
          <h1 className="bebas-font text-5xl mb-6">Historial de Entrenamientos</h1>
          <p className="text-gray-400 text-xl mb-8">Debes iniciar sesión para ver tu historial</p>
          <Link 
            to="/login"
            className="bebas-font text-xl tracking-wider px-8 py-4 rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 transition-all shadow-lg inline-block"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative text-white min-h-screen p-4 sm:p-8 bg-gray-900">
      <GridBackground />
      <div className="relative z-10 max-w-6xl mx-auto">
        <Link to="/entrenamiento" className="bebas-font text-2xl text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest inline-block mb-6">
          &larr; VOLVER
        </Link>
        
        <h1 className="bebas-font text-5xl md:text-7xl text-center my-8 tracking-wider">
          HISTORIAL DE <span className="text-cyan-400">ENTRENAMIENTOS</span>
        </h1>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
            <p className="text-gray-400 mt-4 text-xl">Cargando historial...</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl border-2 border-gray-700">
            <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-400 mb-4">Sin Entrenamientos</h2>
            <p className="text-gray-500 text-lg">Aún no has guardado ningún entrenamiento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <div 
                key={workout.id}
                onClick={() => setSelectedWorkout(workout)}
                className="bg-gray-800 border-2 border-gray-700 rounded-xl p-5 hover:border-cyan-500 transition-all cursor-pointer shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{workout.dayName}</h3>
                    <p className="text-sm text-gray-400">
                      {formatDate(workout.date)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    workout.status === 'completado' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {workout.status === 'completado' ? 'COMPLETADO' : 'INCOMPLETO'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Ejercicios:</span>
                    <span className="text-white font-bold">{workout.completedCount} / {workout.totalExercises}</span>
                  </div>
                  
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        workout.progressPercentage === 100 ? 'bg-green-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${workout.progressPercentage}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center">{workout.progressPercentage}% completado</p>
                </div>

                <button className="w-full mt-4 bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-all font-medium text-sm">
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalles del Entrenamiento */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex justify-center items-center p-4 overflow-y-auto" onClick={() => setSelectedWorkout(null)}>
          <div className="bg-gray-900 border-2 border-cyan-500 rounded-xl shadow-2xl w-full max-w-4xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b-2 border-gray-700 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedWorkout.dayName}</h2>
                <p className="text-gray-400">{formatDate(selectedWorkout.date)}</p>
              </div>
              <button 
                onClick={() => setSelectedWorkout(null)}
                className="text-gray-400 hover:text-white text-3xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Progreso:</span>
                  <span className={`font-bold ${selectedWorkout.status === 'completado' ? 'text-green-400' : 'text-orange-400'}`}>
                    {selectedWorkout.completedCount} / {selectedWorkout.totalExercises} ({selectedWorkout.progressPercentage}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${selectedWorkout.progressPercentage === 100 ? 'bg-green-500' : 'bg-cyan-500'}`}
                    style={{ width: `${selectedWorkout.progressPercentage}%` }}
                  />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">Ejercicios</h3>
              <div className="space-y-4">
                {selectedWorkout.exercises?.map((exercise, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      exercise.completed 
                        ? 'bg-green-900/20 border-green-500/30' 
                        : 'bg-red-900/20 border-red-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white">{exercise.name}</h4>
                        <p className="text-sm text-gray-400">{exercise.group}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        exercise.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {exercise.completed ? 'HECHO' : 'PENDIENTE'}
                      </span>
                    </div>
                    
                    {(exercise.series || exercise.reps || exercise.peso) ? (
                      <div className="flex gap-4 mt-2">
                        {exercise.series > 0 && (
                          <div className="text-sm">
                            <span className="text-gray-400">Series:</span>
                            <span className="text-cyan-400 font-bold ml-1">{exercise.series}</span>
                          </div>
                        )}
                        {exercise.reps > 0 && (
                          <div className="text-sm">
                            <span className="text-gray-400">Reps:</span>
                            <span className="text-cyan-400 font-bold ml-1">{exercise.reps}</span>
                          </div>
                        )}
                        {exercise.peso > 0 && (
                          <div className="text-sm">
                            <span className="text-gray-400">Peso:</span>
                            <span className="text-cyan-400 font-bold ml-1">{exercise.peso} kg</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">Sin detalles configurados</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
