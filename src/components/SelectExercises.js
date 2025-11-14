import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GridBackground } from './GridBackground';
import ImageLoader from './ImageLoader';
import VideoPlayer from './VideoPlayer';
import UserMenu from './UserMenu';

// Objeto para mapear grupos musculares a colores
const groupColors = {
  pecho: 'bg-red-500/20 border-red-500/30 text-red-300',
  espalda: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
  hombros: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
  biceps: 'bg-pink-500/20 border-pink-500/30 text-pink-300',
  triceps: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
  piernas: 'bg-orange-500/20 border-orange-500/30 text-orange-300',
  abdominales: 'bg-green-500/20 border-green-500/30 text-green-300',
};

// Emojis para cada grupo
const groupEmojis = {
  pecho: '💪',
  espalda: '🏋️',
  hombros: '🦾',
  biceps: '💪',
  triceps: '💪',
  piernas: '🦵',
  abdominales: '🔥',
};

const SelectExercises = ({ 
  datosEjercicios, 
  selectedExercises, 
  onSelectExercise,
  onClearGroup,
  customDetails,
  onDetailsChange,
  currentUser
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [selectedExerciseForDetails, setSelectedExerciseForDetails] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'selected', 'unselected'
  const [announceMessage, setAnnounceMessage] = useState('');
  const bottomBarRef = useRef(null);

  // Grupos musculares disponibles
  const muscleGroups = useMemo(() => ['pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'piernas', 'abdominales'], []);

  // Calcular total de ejercicios seleccionados
  const totalSelected = useMemo(() => {
    return Object.values(selectedExercises).reduce((acc, curr) => acc + (curr?.length || 0), 0);
  }, [selectedExercises]);

  // Función para anunciar cambios a lectores de pantalla
  const announce = useCallback((message) => {
    setAnnounceMessage(message);
    setTimeout(() => setAnnounceMessage(''), 3000);
  }, []);

  // Toggle de acordeón
  const toggleGroup = useCallback((grupo) => {
    setExpandedGroups(prev => ({
      ...prev,
      [grupo]: !prev[grupo]
    }));
  }, []);

  // Expandir/Contraer todos
  const expandAll = useCallback(() => {
    const newState = {};
    muscleGroups.forEach(grupo => {
      newState[grupo] = true;
    });
    setExpandedGroups(newState);
    announce('Todos los grupos expandidos');
  }, [muscleGroups, announce]);

  const collapseAll = useCallback(() => {
    setExpandedGroups({});
    announce('Todos los grupos contraídos');
  }, [announce]);

  // Manejar selección de ejercicio
  const handleExerciseToggle = useCallback((grupo, ejercicioNombre) => {
    onSelectExercise(grupo, ejercicioNombre);
    
    const isCurrentlySelected = selectedExercises[grupo]?.includes(ejercicioNombre);
    announce(isCurrentlySelected ? `${ejercicioNombre} deseleccionado` : `${ejercicioNombre} seleccionado`);
  }, [onSelectExercise, selectedExercises, announce]);

  // Filtrar ejercicios por búsqueda
  const filterExercisesBySearch = useCallback((ejercicios, grupo) => {
    if (!searchQuery) return ejercicios;
    
    const query = searchQuery.toLowerCase();
    
    if (datosEjercicios[grupo].subgrupos) {
      // Para piernas con subgrupos
      return ejercicios.filter(ej => ej.nombre.toLowerCase().includes(query));
    } else {
      // Para otros grupos
      return ejercicios.filter(ej => ej.nombre.toLowerCase().includes(query));
    }
  }, [searchQuery, datosEjercicios]);

  // Auto-expandir grupos que tengan resultados de búsqueda
  useEffect(() => {
    if (searchQuery) {
      const groupsWithResults = {};
      muscleGroups.forEach(grupo => {
        const data = datosEjercicios[grupo];
        let hasResults = false;
        
        if (data.subgrupos) {
          // Verificar si algún subgrupo tiene ejercicios que coincidan
          hasResults = data.subgrupos.some(sg => 
            filterExercisesBySearch(sg.ejercicios, grupo).length > 0
          );
        } else {
          // Verificar si hay ejercicios que coincidan
          hasResults = filterExercisesBySearch(data.imagenes, grupo).length > 0;
        }
        
        if (hasResults) {
          groupsWithResults[grupo] = true;
        }
      });
      
      setExpandedGroups(groupsWithResults);
    }
  }, [searchQuery, muscleGroups, datosEjercicios, filterExercisesBySearch]);

  // Mostrar detalles de ejercicio
  const showExerciseDetails = useCallback((ejercicio, grupo) => {
    setSelectedExerciseForDetails({ ...ejercicio, grupo });
  }, []);

  // Mostrar video
  const handleShowVideo = useCallback((videoUrl, ejercicioNombre) => {
    setCurrentVideo({ url: videoUrl, nombre: ejercicioNombre });
    setShowVideoModal(true);
  }, []);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Ctrl/Cmd + K = Búsqueda
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-exercises')?.focus();
      }
      
      // Escape = Limpiar búsqueda o cerrar modal
      if (e.key === 'Escape') {
        if (showVideoModal) {
          setShowVideoModal(false);
        } else if (selectedExerciseForDetails) {
          setSelectedExerciseForDetails(null);
        } else if (searchQuery) {
          setSearchQuery('');
        } else {
          collapseAll();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [searchQuery, showVideoModal, selectedExerciseForDetails, collapseAll]);

  // Scroll al grupo al expandir
  useEffect(() => {
    const expandedGroupKeys = Object.keys(expandedGroups).filter(k => expandedGroups[k]);
    if (expandedGroupKeys.length === 1) {
      const groupElement = document.getElementById(`group-${expandedGroupKeys[0]}`);
      if (groupElement) {
        setTimeout(() => {
          groupElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [expandedGroups]);

  // Renderizar grupo muscular
  const renderMuscleGroup = (grupo) => {
    const data = datosEjercicios[grupo];
    const isExpanded = expandedGroups[grupo];
    const selectedCount = selectedExercises[grupo]?.length || 0;
    let totalCount = 0;
    
    if (data.subgrupos) {
      totalCount = data.subgrupos.reduce((sum, sg) => sum + sg.ejercicios.length, 0);
    } else {
      totalCount = data.ejercicios?.length || 0;
    }
    
    const progressPercent = totalCount > 0 ? (selectedCount / totalCount) * 100 : 0;
    
    // Filtrar según modo de filtro
    if (filterMode === 'selected' && selectedCount === 0) return null;

    return (
      <div key={grupo} id={`group-${grupo}`} className="border border-slate-700/80 rounded-xl overflow-hidden">
        {/* Header del acordeón */}
        <button
          onClick={() => toggleGroup(grupo)}
          className="w-full p-4 sm:p-5 bg-gray-800/50 hover:bg-gray-800/70 transition-all flex items-center justify-between gap-3 group focus:outline-none focus-visible:ring-3 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          aria-expanded={isExpanded}
          aria-controls={`panel-${grupo}`}
          id={`header-${grupo}`}
          style={{ minHeight: '64px' }}
        >
          <div className="flex items-center gap-3 flex-1">
            <span className="text-3xl" aria-hidden="true">{groupEmojis[grupo]}</span>
            <div className="text-left flex-1">
              <h3 className="bebas-font text-2xl sm:text-3xl text-white tracking-wider">
                {data.titulo.replace('EJERCICIOS DE ', '')}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${groupColors[grupo]} border`}>
                  {selectedCount}/{totalCount} seleccionados
                </span>
                {selectedCount === totalCount && totalCount > 0 && (
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">
                    ✓ Completo
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Barra de progreso mini */}
          <div className="hidden sm:block w-32">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  progressPercent === 100 ? 'bg-green-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          
          {/* Icono de expandir/contraer */}
          <svg 
            className={`w-6 h-6 text-cyan-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Panel de ejercicios */}
        {isExpanded && (
          <div
            id={`panel-${grupo}`}
            role="region"
            aria-labelledby={`header-${grupo}`}
            className="bg-gray-900/50 p-4"
          >
            {data.subgrupos ? (
              // Renderizar subgrupos (piernas)
              <div className="space-y-6">
                {data.subgrupos.map((subgrupo) => (
                  <div key={subgrupo.nombre} className="border-l-4 border-cyan-500/30 pl-4">
                    <h4 className="text-xl font-bold text-cyan-400 mb-3">{subgrupo.nombre}</h4>
                    <div className="space-y-2">
                      {filterExercisesBySearch(subgrupo.ejercicios, grupo).map((ejercicio) => (
                        <ExerciseItem
                          key={ejercicio.nombre}
                          ejercicio={ejercicio}
                          grupo={grupo}
                          isSelected={selectedExercises[grupo]?.includes(ejercicio.nombre)}
                          onToggle={handleExerciseToggle}
                          onShowDetails={showExerciseDetails}
                          onShowVideo={handleShowVideo}
                          customDetails={customDetails[grupo]?.[ejercicio.nombre]}
                          onDetailsChange={onDetailsChange}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Renderizar ejercicios normales
              <div className="space-y-2">
                {filterExercisesBySearch(data.imagenes, grupo).map((ejercicio) => (
                  <ExerciseItem
                    key={ejercicio.nombre}
                    ejercicio={ejercicio}
                    grupo={grupo}
                    isSelected={selectedExercises[grupo]?.includes(ejercicio.nombre)}
                    onToggle={handleExerciseToggle}
                    onShowDetails={showExerciseDetails}
                    onShowVideo={handleShowVideo}
                    customDetails={customDetails[grupo]?.[ejercicio.nombre]}
                    onDetailsChange={onDetailsChange}
                  />
                ))}
              </div>
            )}
            
            {selectedCount > 0 && (
              <button
                onClick={() => {
                  onClearGroup(grupo);
                  announce(`Todos los ejercicios de ${data.titulo.replace('EJERCICIOS DE ', '')} deseleccionados`);
                }}
                className="mt-4 text-red-400 hover:text-red-300 text-sm underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-2 py-1"
              >
                Deseleccionar todos de este grupo
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white pb-32">
      <GridBackground />
      
      {/* Anuncios para lectores de pantalla */}
      <div role="status" aria-live="polite" className="sr-only">
        {announceMessage}
      </div>

      {/* Skip link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan-600 text-white px-4 py-2 rounded z-[200]"
      >
        Saltar al contenido principal
      </a>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/" 
              className="bebas-font text-xl text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded px-2 py-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              VOLVER AL INICIO
            </Link>
            
            <UserMenu />
          </div>
          
          <h1 className="bebas-font text-4xl sm:text-5xl md:text-6xl text-center text-white tracking-wider mb-4">
            SELECCIONA TUS <span className="text-cyan-400">EJERCICIOS</span>
          </h1>
          
          <p className="text-center text-gray-400 text-lg max-w-3xl mx-auto">
            Elige los ejercicios para tu rutina personalizada. Puedes expandir cada grupo muscular y seleccionar los que prefieras.
          </p>
        </div>

        {/* Contador simple de ejercicios seleccionados */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-lg sm:text-xl font-bold text-white">
              {totalSelected} ejercicio{totalSelected !== 1 ? 's' : ''} seleccionado{totalSelected !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700 space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <label htmlFor="search-exercises" className="sr-only">Buscar ejercicios</label>
            <input
              id="search-exercises"
              type="text"
              placeholder="Buscar ejercicios... (Ctrl/Cmd + K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                aria-label="Limpiar búsqueda"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filtros y acciones rápidas */}
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  filterMode === 'all' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterMode('selected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  filterMode === 'selected' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Solo seleccionados
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                aria-label="Expandir todos los grupos"
              >
                Expandir todo
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                aria-label="Contraer todos los grupos"
              >
                Contraer
              </button>
            </div>
          </div>
        </div>

        {/* Lista de grupos musculares */}
        <div id="main-content" className="space-y-4">
          {muscleGroups.map(grupo => renderMuscleGroup(grupo))}
        </div>

        {/* Empty state si no hay resultados de búsqueda */}
        {searchQuery && muscleGroups.every(grupo => {
          const data = datosEjercicios[grupo];
          if (data.subgrupos) {
            return data.subgrupos.every(sg => filterExercisesBySearch(sg.ejercicios, grupo).length === 0);
          }
          return filterExercisesBySearch(data.imagenes, grupo).length === 0;
        }) && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No se encontraron ejercicios</h3>
            <p className="text-gray-500">Intenta con otra búsqueda</p>
          </div>
        )}

        {/* Espacio para el bottom bar */}
        <div style={{ height: '80px' }} aria-hidden="true" />
      </div>

      {/* Bottom Bar (Sticky) - Móvil */}
      {/* Desktop: Sidebar fijo a la derecha */}
      <div 
        ref={bottomBarRef}
        className="fixed bottom-0 left-0 right-0 md:top-24 md:right-8 md:left-auto md:bottom-auto md:w-80 bg-gray-800/95 backdrop-blur-md border-t md:border border-gray-700 md:rounded-xl shadow-2xl z-50 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">💪</span>
              Resumen
            </h3>
            <span className="text-2xl font-bold text-cyan-400">{totalSelected}</span>
          </div>
          
          {/* Lista de ejercicios por grupo */}
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto hidden md:block">
            {muscleGroups.map(grupo => {
              const count = selectedExercises[grupo]?.length || 0;
              if (count === 0) return null;
              return (
                <div key={grupo} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{datosEjercicios[grupo].titulo.replace('EJERCICIOS DE ', '')}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${groupColors[grupo]} border`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {totalSelected === 0 && (
            <p className="text-gray-500 text-sm text-center py-4 hidden md:block">
              No has seleccionado ejercicios aún
            </p>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/mi-plan')}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 flex items-center justify-center gap-2"
              style={{ minHeight: '48px', touchAction: 'manipulation' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="hidden sm:inline">Ir a Mi Plan</span>
              <span className="sm:hidden">Mi Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Video */}
      {showVideoModal && currentVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl overflow-hidden max-w-4xl w-full border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{currentVideo.nombre}</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-400 hover:text-white p-2"
                aria-label="Cerrar video"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <VideoPlayer videoUrl={currentVideo.url} />
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de item de ejercicio
const ExerciseItem = ({ 
  ejercicio, 
  grupo, 
  isSelected, 
  onToggle, 
  onShowDetails, 
  onShowVideo,
  customDetails,
  onDetailsChange
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = () => {
    onToggle(grupo, ejercicio.nombre);
  };

  return (
    <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-all">
      {/* Checkbox y nombre */}
      <label 
        htmlFor={`ex-${grupo}-${ejercicio.nombre.replace(/\s+/g, '-')}`}
        className="flex items-center gap-3 p-3 sm:p-4 cursor-pointer group"
        style={{ minHeight: '48px', touchAction: 'manipulation' }}
      >
        <input
          type="checkbox"
          id={`ex-${grupo}-${ejercicio.nombre.replace(/\s+/g, '-')}`}
          checked={isSelected}
          onChange={handleToggle}
          className="w-5 h-5 rounded border-gray-600 text-cyan-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer"
          aria-describedby={`desc-${grupo}-${ejercicio.nombre.replace(/\s+/g, '-')}`}
        />
        <div className="flex-1 min-w-0">
          <span className="text-white font-medium block truncate group-hover:text-cyan-400 transition-colors">
            {ejercicio.nombre}
          </span>
          {isSelected && customDetails && (
            <span className="text-xs text-gray-400">
              {customDetails.series || 3} series × {customDetails.repeticiones || 10} reps
              {customDetails.peso ? ` @ ${customDetails.peso}kg` : ''}
            </span>
          )}
        </div>
        {isSelected && (
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        <span id={`desc-${grupo}-${ejercicio.nombre.replace(/\s+/g, '-')}`} className="sr-only">
          Ejercicio de {grupo}, {isSelected ? 'seleccionado' : 'no seleccionado'}
        </span>
      </label>

      {/* Botones de acción */}
      {isSelected && (
        <div className="border-t border-gray-700/50 p-2 flex gap-2 flex-wrap">
          {ejercicio.videoUrl && (
            <button
              onClick={() => onShowVideo(ejercicio.videoUrl, ejercicio.nombre)}
              className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              📹 Ver video
            </button>
          )}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            {showDetails ? '▲ Ocultar' : '▼ Detalles'}
          </button>
        </div>
      )}

      {/* Panel de detalles expandible */}
      {showDetails && isSelected && (
        <div className="border-t border-gray-700/50 p-4 bg-gray-900/50 space-y-3">
          {ejercicio.descripcion && (
            <p className="text-sm text-gray-300">{ejercicio.descripcion}</p>
          )}
          
          {/* Inputs personalizados */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Series</label>
              <input
                type="number"
                min="1"
                max="10"
                value={customDetails?.series || 3}
                onChange={(e) => onDetailsChange(grupo, ejercicio.nombre, 'series', parseInt(e.target.value) || 3)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Reps</label>
              <input
                type="number"
                min="1"
                max="50"
                value={customDetails?.repeticiones || 10}
                onChange={(e) => onDetailsChange(grupo, ejercicio.nombre, 'repeticiones', parseInt(e.target.value) || 10)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Peso (kg)</label>
              <input
                type="number"
                min="0"
                step="2.5"
                value={customDetails?.peso || ''}
                onChange={(e) => onDetailsChange(grupo, ejercicio.nombre, 'peso', parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectExercises;
