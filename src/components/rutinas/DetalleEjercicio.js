import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { images, videos } from '../../assets';
import SwipeableMenu from '../SwipeableMenu';
import ImageLoader from '../ImageLoader';
import { GridBackground } from '../GridBackground';

const RestDayModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="bebas-font text-4xl text-cyan-400 tracking-wider mb-4">Día de Descanso</h2>
        <p className="text-gray-300 mb-6">Hoy no tienes una rutina planificada. ¡Aprovecha para recargar energías!</p>
        <button 
          onClick={onClose}
          className="bebas-font text-lg tracking-wider px-8 py-2 rounded-lg text-white bg-[#379AA5] hover:bg-[#2A7A87] transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

const ResumenSemanal = ({ schedule, daysOfWeek }) => {
  const scheduleByDay = useMemo(() => {
    const byDay = {};
    const scheduleDays = schedule.days || {}; // Acceder al objeto de días

    // Llenar el objeto byDay con los grupos musculares por día
    for (const group in scheduleDays) {
      if (scheduleDays[group] && Array.isArray(scheduleDays[group])) {
        scheduleDays[group].forEach(day => {
          if (!byDay[day]) {
            byDay[day] = [];
          }
          // Capitalizar el nombre del grupo antes de añadirlo
          byDay[day].push(group.charAt(0).toUpperCase() + group.slice(1));
        });
      }
    }
    return byDay;
  }, [schedule]); // La dependencia en `schedule` es correcta

  return (
    // Resumen semanal
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg mb-1">
      <ul className="space-y-4">
        {daysOfWeek.map(day => {
          const groupsForDay = scheduleByDay[day];
          // Si no hay grupos para el día, mostrar "Descanso"
          return (
            <li key={day} className="flex flex-col sm:flex-row sm:items-center text-lg p-2 rounded-md transition-colors hover:bg-gray-700">
              <span className="w-full sm:w-32 font-semibold text-[#379AA5] mb-2 sm:mb-0 flex-shrink-0">{day}:</span>
              <div className="flex flex-wrap gap-2">
                {groupsForDay && groupsForDay.length > 0 ? (
                  groupsForDay.map(group => (
                    <span key={group} className="bg-gray-700 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md">
                      {group}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Descanso</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const DetalleEjercicio = ({ selectedExercises, onSelectExercise, onClearGroup, schedule, routineTypes, onRoutineTypeChange, onOpenPlanner, onShare, customDetails, onDetailsChange, datosEjercicios }) => {
  let { grupo } = useParams();
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPlanAccordionOpen, setIsPlanAccordionOpen] = useState(false);
  const [isPersonalizeAccordionOpen, setIsPersonalizeAccordionOpen] = useState(false);
  const [showRestDayModal, setShowRestDayModal] = useState(false);

  // Logic to get today's workout
  const daysMap = useMemo(() => ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], []);
  const todayName = daysMap[new Date().getDay()];

  const todaysGroups = useMemo(() => {
    const groups = [];
    const scheduleDays = schedule.days || {};
    for (const group in scheduleDays) {
      if (scheduleDays[group] && scheduleDays[group].includes(todayName)) {
        groups.push(group.charAt(0).toUpperCase() + group.slice(1));
      }
    }
    return groups;
  }, [schedule, todayName]);

  const handleStartWorkoutClick = () => {
    if (todaysGroups.length > 0) {
      navigate('/entrenamiento');
    } else {
      setShowRestDayModal(true);
    }
  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const rutinaActual = useMemo(() => {
    const data = datosEjercicios[grupo] || { titulo: "RUTINA DESCONOCIDA", ejercicios: [], imagenes: [] };
    // Si es la rutina de piernas con subgrupos, aplanamos los nombres de los ejercicios para la lógica de selección.
    if (grupo === 'piernas' && data.subgrupos) {
      return {
        ...data,
        ejercicios: data.subgrupos.flatMap(sg => sg.ejercicios.map(e => e.nombre))
      };
    }
    return data;
  }, [datosEjercicios, grupo]);

  const currentSelections = selectedExercises[grupo] || [];

  const filteredGallery = useMemo(() => {
    const hasSelection = currentSelections.length > 0;
    if (grupo === 'piernas' && rutinaActual.subgrupos) {
      if (!hasSelection) return rutinaActual.subgrupos; // Devuelve todos los subgrupos si no hay selección
      // Filtra los ejercicios dentro de cada subgrupo y mantiene la estructura
      return rutinaActual.subgrupos.map(subgrupo => ({
        ...subgrupo,
        ejercicios: subgrupo.ejercicios.filter(ejercicio => currentSelections.includes(ejercicio.nombre))
      })).filter(subgrupo => subgrupo.ejercicios.length > 0); // Elimina subgrupos que quedaron vacíos
    }

    // Lógica original para los demás grupos musculares
    return hasSelection
      ? rutinaActual.imagenes.filter(imagen => currentSelections.includes(imagen.nombre))
      : rutinaActual.imagenes;
  }, [currentSelections, grupo, rutinaActual]);

  const menuItems = ['pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'piernas', 'abdominales'];
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const routineTypeOptions = ['Full Body', 'Torso-Pierna', 'Empuje-Tracción-Pierna'];

  return (
    // Botón para abrir el menú de rutinas
    <>
      <button 
        onClick={() => setIsDrawerOpen(prev => !prev)}
        className="fixed top-5 right-5 z-[60] bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Abrir menú de rutinas"
      >
        
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>

      {/* Menú deslizable */}
      <SwipeableMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <h3 className="bebas-font text-3xl text-[#379AA5] tracking-widest mb-4">RUTINAS</h3>
        <ul className="flex flex-col space-y-8">
          {menuItems.map(item => (
            <li key={item}>
              <Link 
                to={`/${item}`}
                onClick={() => setIsDrawerOpen(false)} 
                className={`text-lg p-2 rounded-md transition-colors ${grupo === item ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón de Compartir */}
        <div className="border-t border-gray-700 mt-4 pt-4">
          <button 
            onClick={onShare}
            className="w-full flex items-center justify-center text-lg p-2 rounded-md text-[#379AA5] hover:bg-gray-700 hover:text-cyan-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.367a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg>
            Compartir Plan
          </button>
        </div>
      </SwipeableMenu>

      <div className="relative text-white min-h-screen p-8 bg-gray-900">
        <GridBackground />
        <div className="relative z-10 max-w-7xl mx-auto">
          <Link to="/" className="bebas-font text-2xl text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest">&larr; VOLVER AL INICIO</Link>
          <h1 className="bebas-font text-5xl md:text-7xl text-center my-8 tracking-wider">
            <span className="text-green-600">{rutinaActual.titulo}</span>
          </h1>

          <div 
            className="bg-gray-800 rounded-lg shadow-lg mb-10 transition-all duration-300"
          >
            <div 
              className="p-4 sm:p-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex-grow cursor-pointer" onClick={() => setIsPlanAccordionOpen(!isPlanAccordionOpen)}>
                    <div className="flex justify-between items-center">
                      <h2 className="bebas-font text-3xl text-white">Mi Rutina Semanal:</h2>
                      <svg className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 cursor-pointer flex-shrink-0 ml-2 ${isPlanAccordionOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                    {!isPlanAccordionOpen ? (
                      <>
                        <p className="text-gray-400 mt-1 text-sm">Toca para ver detalles y opciones de planificación por días.</p>
                        <div className="mt-3 flex flex-col sm:flex-row sm:items-center text-lg">
                          <span className="w-full sm:w-32 font-semibold text-[#379AA5] mb-2 sm:mb-0 flex-shrink-0">{todayName}:</span>
                          <div className="flex flex-wrap gap-2">
                            {todaysGroups.length > 0 ? (
                              todaysGroups.map(group => (
                                <span key={group} className="bg-gray-700 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md">
                                  {group}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400">Descanso</span>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 mt-1">Toca para ocultar detalles y opciones de planificación por días.</p>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleStartWorkoutClick}
                    className="hidden sm:block bebas-font text-base tracking-wider px-4 py-2 rounded-lg text-gray-900 bg-green-500 hover:bg-green-600 transition-colors shadow-lg flex-shrink-0 ml-4"
                  >
                    Empezar Entrenamiento
                  </button>
                </div>
                
                <button 
                  onClick={handleStartWorkoutClick}
                  className="sm:hidden bebas-font text-base tracking-wider px-4 py-2 rounded-lg text-gray-900 bg-green-500 hover:bg-green-600 transition-colors shadow-lg w-full"
                >
                  Empezar Entrenamiento
                </button>
              </div>
            </div>

            {/* Contenido Expandible */}
            {isPlanAccordionOpen && (
              <div className="px-4 sm:px-6 pb-6" onClick={(e) => e.stopPropagation()}>
                {/* Resumen Semanal */}
                <div className="mb-6">
                  <ResumenSemanal schedule={schedule} daysOfWeek={daysOfWeek} />
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                  {/* Herramientas */}
                  <div className="flex justify-end items-center mb-6">
                    <button 
                      onClick={onOpenPlanner}
                      className="bebas-font text-base sm:text-lg tracking-wider px-4 sm:px-6 py-2 rounded-lg text-white bg-[#379AA5] hover:bg-[#2A7A87] transition-colors shadow-lg"
                    >
                      Planificar Semana
                    </button>
                  </div>
                  
                  {/* Tipo de Rutina */}
                  <div>
                    <h3 className="bebas-font text-xl sm:text-2xl text-white mb-4">Tipo de Rutina</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-4">
                        {routineTypeOptions.map(type => {
                            const isChecked = routineTypes.includes(type);
                            return (
                                <div key={type} onClick={() => onRoutineTypeChange(type)} className="cursor-pointer flex items-center">
                                    <div className={`w-6 h-6 flex justify-center items-center border-2 ${isChecked ? 'border-cyan-500 bg-cyan-500' : 'border-gray-500'} rounded-md mr-2 transition-all`}>
                                        {isChecked && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                    </div>
                                    <span className={`text-lg ${isChecked ? 'text-white' : 'text-gray-300'}`}>{type}</span>
                                </div>
                            );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-12">
            <div 
              className="cursor-pointer"
              onClick={() => setIsPersonalizeAccordionOpen(!isPersonalizeAccordionOpen)}
            >
              <div className="flex justify-between items-center">
                <h2 className="bebas-font text-3xl text-white">Lista de ejercicios:</h2>
                <svg className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ml-3 ${isPersonalizeAccordionOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              <p className="text-gray-400 mt-1">Toca para {isPersonalizeAccordionOpen ? 'ocultar y dejar de seleccionar' : 'desplegar y seleccionar unicamente'} los ejercicios que desea ver de la <span className="text-cyan-400">galería de ejercicios</span>.</p>
            </div>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isPersonalizeAccordionOpen ? 'max-h-full mt-4' : 'max-h-0'}`}>
              <ul className="space-y-3">
                {grupo === 'piernas' && rutinaActual.subgrupos ? (
                  rutinaActual.subgrupos.map(subgrupo => (
                    <React.Fragment key={subgrupo.nombre}>
                      <h3 className="bebas-font text-2xl text-[#379AA5] pt-4 pb-2 tracking-wider">{subgrupo.nombre}</h3>
                      {subgrupo.ejercicios.map((ejercicio, index) => {
                        const isChecked = currentSelections.includes(ejercicio.nombre);
                        return (
                          <li key={index} className="p-3 rounded-lg transition-colors hover:bg-gray-700">
                            <div className="flex items-center">
                              <div onClick={() => onSelectExercise(grupo, ejercicio.nombre)} className="flex-grow flex items-center cursor-pointer">
                                <div className={`w-6 h-6 flex justify-center items-center border-2 ${isChecked ? 'border-cyan-500 bg-cyan-500' : 'border-gray-500'} rounded-md mr-4 transition-all`}>
                                    {isChecked && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                </div>
                                <span className={`text-lg ${isChecked ? 'text-white' : 'text-gray-300'}`}>{ejercicio.nombre}</span>
                              </div>
                              {isChecked && (
                                <div className="flex items-center gap-4 ml-4">
                                  <div className="flex flex-col items-center">
                                    <label className="text-xs text-gray-400 mb-1">Series</label>
                                    <input 
                                      type="text" 
                                      value={customDetails[grupo]?.[ejercicio.nombre]?.series || ''}
                                      onChange={(e) => onDetailsChange(grupo, ejercicio.nombre, 'series', e.target.value)}
                                      onClick={(e) => e.stopPropagation()} // Evita que el click en el input deseleccione el ejercicio
                                      className="w-16 bg-gray-700 text-white text-center rounded-md p-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <label className="text-xs text-gray-400 mb-1">Reps</label>
                                    <input 
                                      type="text" 
                                      value={customDetails[grupo]?.[ejercicio.nombre]?.reps || ''}
                                      onChange={(e) => onDetailsChange(grupo, ejercicio.nombre, 'reps', e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-16 bg-gray-700 text-white text-center rounded-md p-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </React.Fragment>
                  ))
                ) : ( 
                  rutinaActual.ejercicios.map((ejercicio, index) => {
                      const isChecked = currentSelections.includes(ejercicio);
                      return (
                        <li key={index} className="p-3 rounded-lg transition-colors hover:bg-gray-700">
                          <div className="flex items-center">
                            <div onClick={() => onSelectExercise(grupo, ejercicio)} className="flex-grow flex items-center cursor-pointer">
                              <div className={`w-6 h-6 flex justify-center items-center border-2 ${isChecked ? 'border-cyan-500 bg-cyan-500' : 'border-gray-500'} rounded-md mr-4 transition-all`}>
                                  {isChecked && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                              </div>
                              <span className={`text-lg ${isChecked ? 'text-white' : 'text-gray-300'}`}>{ejercicio}</span>
                            </div>
                            {isChecked && (
                              <div className="flex items-center gap-4 ml-4">
                                <div className="flex flex-col items-center">
                                  <label className="text-xs text-gray-400 mb-1">Series</label>
                                  <input 
                                    type="text" 
                                    value={customDetails[grupo]?.[ejercicio]?.series || ''}
                                    onChange={(e) => onDetailsChange(grupo, ejercicio, 'series', e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-16 bg-gray-700 text-white text-center rounded-md p-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  />
                                </div>
                                <div className="flex flex-col items-center">
                                  <label className="text-xs text-gray-400 mb-1">Reps</label>
                                  <input 
                                    type="text" 
                                    value={customDetails[grupo]?.[ejercicio]?.reps || ''}
                                    onChange={(e) => onDetailsChange(grupo, ejercicio, 'reps', e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-16 bg-gray-700 text-white text-center rounded-md p-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </li>
                      )
                  })
                )}
              </ul>

              {currentSelections.length > 0 && (
                <div className="text-right mt-4">
                    <button onClick={() => onClearGroup(grupo)} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                        Limpiar selección
                    </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12">
              <h2 className="bebas-font text-4xl text-white mb-6 text-center tracking-wider">Galería de Ejercicios</h2>
              
              {grupo === 'piernas' && Array.isArray(filteredGallery) ? (
                filteredGallery.map(subgrupo => (
                  <div key={subgrupo.nombre} className="mb-12">
                    <h3 className="bebas-font text-3xl text-[#379AA5] mb-6 tracking-wider">{subgrupo.nombre}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {subgrupo.ejercicios.map((imagen, index) => {
                        const isOpen = openIndex === `${subgrupo.nombre}-${index}`;
                        return (
                          <div key={imagen.nombre}>
                            <div onClick={() => handleToggle(`${subgrupo.nombre}-${index}`)} className="relative h-80 rounded-lg overflow-hidden shadow-xl transform transition-transform hover:scale-105 cursor-pointer">
                                <ImageLoader src={imagen.src} alt={imagen.nombre} className="w-full h-full"/>
                                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                                    <h4 className="text-white text-xl font-bold tracking-wide">{imagen.nombre}</h4>
                                    <p className="text-cyan-400 text-sm font-semibold mt-1">Ver Ejecución ▸</p>
                                </div>
                            </div>
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'}`}>
                                <div className="bg-gray-800 p-6 rounded-lg">
                                    <p className="text-gray-300 mb-4">{imagen.descripcion}</p>
                                    <p className="font-bold text-cyan-400 mb-4">
                                      {(() => {
                                        const details = customDetails[grupo]?.[imagen.nombre];
                                        if (details && (details.series || details.reps)) {
                                          return `${details.series || '?'} series de ${details.reps || '?'} repeticiones`;
                                        }
                                        return imagen.detalles;
                                      })()}
                                    </p>
                                    <VideoPlayer videoUrl={isOpen ? imagen.videoUrl : ''} title={imagen.nombre} />
                                </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGallery.map((imagen, index) => {
                      const isOpen = openIndex === index;
                      return (
                          <div key={imagen.nombre}>
                              <div onClick={() => handleToggle(index)} className="relative h-80 rounded-lg overflow-hidden shadow-xl transform transition-transform hover:scale-105 cursor-pointer">
                                  <ImageLoader src={imagen.src} alt={imagen.nombre} className="w-full h-full"/>
                                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                                      <h4 className="text-white text-xl font-bold tracking-wide">{imagen.nombre}</h4>
                                      <p className="text-cyan-400 text-sm font-semibold mt-1">Ver Ejecución ▸</p>
                                  </div>
                              </div>
                                                          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'}`}>
                                                              <div className="bg-gray-800 p-6 rounded-lg">
                                                                  <p className="text-gray-300 mb-4">{imagen.descripcion}</p>
                                                                  <p className="font-bold text-cyan-400 mb-4">
                                                                    {(() => {
                                                                      const details = customDetails[grupo]?.[imagen.nombre];
                                                                      if (details && (details.series || details.reps)) {
                                                                        return `${details.series || '?'} series de ${details.reps || '?'} repeticiones`;
                                                                      }
                                                                      return imagen.detalles;
                                                                    })()}
                                                                  </p>
                                                                  <VideoPlayer videoUrl={isOpen ? imagen.videoUrl : ''} title={imagen.nombre} />
                                                              </div>
                                                          </div>                          </div>
                      )
                  })}
                </div>
              )}
          </div>

        </div>
      </div>
      <RestDayModal isOpen={showRestDayModal} onClose={() => setShowRestDayModal(false)} />
    </>
  );
};

const VideoPlayer = ({ videoUrl, title }) => {
  if (!videoUrl) return null;

  // Check if the URL is a YouTube embed link
  const isYouTube = typeof videoUrl === 'string' && videoUrl.includes('youtube.com/embed');

  return (
    <div className="relative pt-[56.25%] w-full h-full">
      {isYouTube ? (
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={videoUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={videoUrl}
          title={title}
          controls
          autoPlay
          muted // Autoplay on browsers often requires the video to be muted
          loop
        >
          Tu navegador no soporta el elemento de video.
        </video>
      )}
    </div>
  );
};

export default DetalleEjercicio;
