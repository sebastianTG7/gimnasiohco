import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { images, videos } from '../../assets';
import SwipeableMenu from '../SwipeableMenu';
import ImageLoader from '../ImageLoader';
import { GridBackground } from '../GridBackground';
import VideoPlayer from '../VideoPlayer';

const DetalleEjercicio = ({ selectedExercises, onSelectExercise, onClearGroup, schedule, routineTypes, onRoutineTypeChange, onOpenPlanner, onShare, customDetails, onDetailsChange, datosEjercicios }) => {
  let { grupo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPersonalizeAccordionOpen, setIsPersonalizeAccordionOpen] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all' o 'selected'

  // Abrir acordeón automáticamente si viene desde "Personalizar Ejercicios"
  useEffect(() => {
    if (location.state?.openAccordion) {
      setIsPersonalizeAccordionOpen(true);
    }
  }, [location]);

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
  const totalCount = useMemo(() => {
    if (grupo === 'piernas' && rutinaActual.subgrupos) {
      return rutinaActual.subgrupos.reduce((sum, sg) => sum + sg.ejercicios.length, 0);
    }
    return rutinaActual.ejercicios?.length || 0;
  }, [grupo, rutinaActual]);

  const selectedCount = currentSelections.length;

  const filteredGallery = useMemo(() => {
    if (grupo === 'piernas' && rutinaActual.subgrupos) {
      if (filterMode === 'selected') {
        // Solo mostrar ejercicios seleccionados
        return rutinaActual.subgrupos.map(subgrupo => ({
          ...subgrupo,
          ejercicios: subgrupo.ejercicios.filter(ejercicio => currentSelections.includes(ejercicio.nombre))
        })).filter(subgrupo => subgrupo.ejercicios.length > 0);
      }
      // Mostrar todos
      return rutinaActual.subgrupos;
    }

    // Lógica original para los demás grupos musculares
    if (filterMode === 'selected') {
      return rutinaActual.imagenes.filter(imagen => currentSelections.includes(imagen.nombre));
    }
    return rutinaActual.imagenes;
  }, [currentSelections, grupo, rutinaActual, filterMode]);

  const menuItems = ['pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'piernas', 'abdominales'];
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const routineTypeOptions = ['Full Body', 'Torso-Pierna', 'Empuje-Tracción-Pierna'];

  return (
    // Botón para abrir el menú de rutinas
    <>
      <button 
        onClick={() => setIsDrawerOpen(prev => !prev)}
        className={`fixed top-8 right-8 z-[60] bg-cyan-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-cyan-700 transition-all duration-300 flex items-center gap-2 ${isDrawerOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Abrir menú de rutinas"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        <span className="font-semibold text-sm">RUTINAS</span>
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

          {/* Toggle de filtro: Todos vs Mis seleccionados */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-800 rounded-lg p-1 shadow-lg border border-gray-700">
              <button
                onClick={() => setFilterMode('all')}
                className={`bebas-font px-6 py-2.5 rounded-md transition-all tracking-wider text-lg ${
                  filterMode === 'all'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                aria-pressed={filterMode === 'all'}
                aria-label={`Mostrar todos los ${totalCount} ejercicios`}
              >
                TODOS ({totalCount})
              </button>
              <button
                onClick={() => setFilterMode('selected')}
                className={`bebas-font px-6 py-2.5 rounded-md transition-all tracking-wider text-lg ${
                  filterMode === 'selected'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                aria-pressed={filterMode === 'selected'}
                aria-label={`Mostrar solo mis ${selectedCount} ejercicios seleccionados`}
              >
                MIS SELECCIONADOS ({selectedCount})
              </button>
            </div>
          </div>

          {/* Mensaje cuando no hay seleccionados y está en modo filtrado */}
          {filterMode === 'selected' && selectedCount === 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No has seleccionado ejercicios</h3>
              <p className="text-gray-400 mb-4">
                Despliega "Lista de ejercicios" abajo para comenzar a seleccionar.
              </p>
              <button
                onClick={() => setFilterMode('all')}
                className="bebas-font bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-all tracking-wider"
              >
                Ver todos los ejercicios
              </button>
            </div>
          )}

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-12">
            <div 
              className="cursor-pointer"
              onClick={() => setIsPersonalizeAccordionOpen(!isPersonalizeAccordionOpen)}
            >
              <div className="flex justify-between items-center">
                <h2 className="bebas-font text-3xl text-white">Lista de ejercicios:</h2>
                <svg className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ml-3 ${isPersonalizeAccordionOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              <p className="text-gray-400 mt-1">Toca para {isPersonalizeAccordionOpen ? 'ocultar ' : 'desplegar, seleccionar y editar '} los ejercicios  </p>
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
                                <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-4">
                                  <div className="flex flex-col items-center">
                                    <label className="text-[10px] md:text-xs text-gray-400 mb-1">Series</label>
                                    <input 
                                      type="text" 
                                      value={customDetails[grupo]?.[ejercicio.nombre]?.series || ''}
                                      onChange={(e) => onDetailsChange(grupo, ejercicio.nombre, 'series', e.target.value)}
                                      onClick={(e) => e.stopPropagation()} // Evita que el click en el input deseleccione el ejercicio
                                      className="w-14 md:w-16 bg-gray-700 text-white text-center rounded-md p-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <label className="text-[10px] md:text-xs text-gray-400 mb-1">Reps</label>
                                    <input 
                                      type="text" 
                                      value={customDetails[grupo]?.[ejercicio.nombre]?.reps || ''}
                                      onChange={(e) => onDetailsChange(grupo, ejercicio.nombre, 'reps', e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-14 md:w-16 bg-gray-700 text-white text-center rounded-md p-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                              <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-4">
                                <div className="flex flex-col items-center">
                                  <label className="text-[10px] md:text-xs text-gray-400 mb-1">Series</label>
                                  <input 
                                    type="text" 
                                    value={customDetails[grupo]?.[ejercicio]?.series || ''}
                                    onChange={(e) => onDetailsChange(grupo, ejercicio, 'series', e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-14 md:w-16 bg-gray-700 text-white text-center rounded-md p-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  />
                                </div>
                                <div className="flex flex-col items-center">
                                  <label className="text-[10px] md:text-xs text-gray-400 mb-1">Reps</label>
                                  <input 
                                    type="text" 
                                    value={customDetails[grupo]?.[ejercicio]?.reps || ''}
                                    onChange={(e) => onDetailsChange(grupo, ejercicio, 'reps', e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-14 md:w-16 bg-gray-700 text-white text-center rounded-md p-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                        const isSelected = currentSelections.includes(imagen.nombre);
                        return (
                          <div key={imagen.nombre}>
                            <div onClick={() => handleToggle(`${subgrupo.nombre}-${index}`)} className="relative h-80 rounded-lg overflow-hidden shadow-xl transform transition-transform hover:scale-105 cursor-pointer">
                                <ImageLoader src={imagen.src} alt={imagen.nombre} className="w-full h-full"/>
                                
                                {/* Badge de seleccionado */}
                                {isSelected && (
                                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-bold">SELECCIONADO</span>
                                  </div>
                                )}
                                
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
                      const isSelected = currentSelections.includes(imagen.nombre);
                      return (
                          <div key={imagen.nombre}>
                              <div onClick={() => handleToggle(index)} className="relative h-80 rounded-lg overflow-hidden shadow-xl transform transition-transform hover:scale-105 cursor-pointer">
                                  <ImageLoader src={imagen.src} alt={imagen.nombre} className="w-full h-full"/>
                                  
                                  {/* Badge de seleccionado */}
                                  {isSelected && (
                                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span className="text-xs font-bold">SELECCIONADO</span>
                                    </div>
                                  )}
                                  
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
        
        {/* Botón flotante para ir a vista unificada */}
        <button
          onClick={() => navigate('/seleccionar-ejercicios')}
          className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center gap-2 bebas-font text-lg tracking-wider"
          aria-label="Ver todos mis ejercicios en una sola vista"
          title="Ver selección completa"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="hidden sm:inline">SELECCIÓN COMPLETA</span>
          <span className="sm:hidden">VER TODO</span>
        </button>
      </div>
    </>
  );
};



export default DetalleEjercicio;
