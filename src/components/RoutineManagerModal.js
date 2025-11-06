import React, { useState } from 'react';

const RoutineManagerModal = ({ 
  isOpen, 
  onClose, 
  routines, 
  currentRoutine, 
  onSelectRoutine, 
  onCreateRoutine, 
  onDeleteRoutine,
  onUpdateRoutine 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!newRoutineName.trim()) {
      alert('Por favor ingresa un nombre para la rutina');
      return;
    }

    await onCreateRoutine(newRoutineName);
    setNewRoutineName('');
    setIsCreating(false);
  };

  const handleRename = async (routineId) => {
    if (!editingName.trim()) {
      alert('Por favor ingresa un nombre válido');
      return;
    }

    await onUpdateRoutine(routineId, { name: editingName });
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = async (routineId, routineName) => {
    if (window.confirm(`¿Estás seguro de eliminar la rutina "${routineName}"?`)) {
      await onDeleteRoutine(routineId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-900 border-2 border-[#379AA5] rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#379AA5]/20 to-transparent p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="bebas-font text-3xl text-[#379AA5] tracking-wider">MIS RUTINAS</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-2">Gestiona tus rutinas guardadas</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Create New Button */}
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full bg-[#379AA5]/20 border-2 border-dashed border-[#379AA5] text-[#379AA5] px-6 py-4 rounded-lg hover:bg-[#379AA5]/30 transition-all mb-4 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="bebas-font text-lg tracking-wider">CREAR NUEVA RUTINA</span>
            </button>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
              <input
                type="text"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                placeholder="Nombre de la rutina"
                className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg mb-3 focus:outline-none focus:border-[#379AA5]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  className="flex-1 bg-[#379AA5] text-white px-4 py-2 rounded-lg hover:bg-[#2A7A87] transition-colors"
                >
                  Crear
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewRoutineName('');
                  }}
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Routines List */}
          {routines.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">No tienes rutinas guardadas</p>
              <p className="text-sm mt-2">Crea tu primera rutina para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className={`bg-gray-800 border rounded-lg p-4 transition-all ${
                    currentRoutine?.id === routine.id
                      ? 'border-[#379AA5] shadow-lg shadow-[#379AA5]/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {editingId === routine.id ? (
                    <div>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg mb-2 focus:outline-none focus:border-[#379AA5]"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRename(routine.id)}
                          className="flex-1 bg-[#379AA5] text-white px-3 py-1 rounded text-sm hover:bg-[#2A7A87]"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingName('');
                          }}
                          className="flex-1 bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="bebas-font text-xl text-white tracking-wider flex items-center gap-2">
                          {routine.name}
                          {routine.isActive && (
                            <span className="text-xs bg-[#379AA5] text-white px-2 py-1 rounded">ACTIVA</span>
                          )}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {Object.keys(routine.selectedExercises || {}).reduce((acc, key) => 
                            acc + (routine.selectedExercises[key]?.length || 0), 0
                          )} ejercicios
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {currentRoutine?.id !== routine.id && (
                          <button
                            onClick={() => onSelectRoutine(routine)}
                            className="bg-[#379AA5] text-white px-4 py-2 rounded-lg hover:bg-[#2A7A87] transition-colors text-sm"
                          >
                            Usar
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            setEditingId(routine.id);
                            setEditingName(routine.name);
                          }}
                          className="p-2 text-gray-400 hover:text-[#379AA5] transition-colors"
                          title="Renombrar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleDelete(routine.id, routine.name)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4 bg-gray-900/50">
          <button
            onClick={onClose}
            className="w-full bebas-font bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all tracking-wider"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutineManagerModal;
