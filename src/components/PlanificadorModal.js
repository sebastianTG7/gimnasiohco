// MODAL DE EDITAR PLANIFICADOR SEMANAL PRESENTADO EN MI PLAN
import React, { useState, useEffect, useMemo } from 'react';

const PlanificadorModal = ({ isOpen, onClose, schedule, onSave }) => {
  const [localSchedule, setLocalSchedule] = useState({});

  // Sincronizar el estado local con las props cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      // Copia profunda para evitar mutar el estado original accidentalmente
      // Solo nos interesan los días para el planificador, que ahora están en schedule.days
      setLocalSchedule(JSON.parse(JSON.stringify(schedule.days || {})));
    }
  }, [isOpen, schedule]);

  const handleCheckboxChange = (day, group) => {
    setLocalSchedule(prev => {
      const newSchedule = { ...prev };
      const groupDays = newSchedule[group] ? [...newSchedule[group]] : [];
      
      const dayIndex = groupDays.indexOf(day);
      
      if (dayIndex > -1) {
        groupDays.splice(dayIndex, 1);
      } else {
        groupDays.push(day);
      }
      
      newSchedule[group] = groupDays;
      return newSchedule;
    });
  };

  const handleSave = () => {
    onSave(localSchedule);
    onClose();
  };

  const daysOfWeek = useMemo(() => ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], []);
  const muscleGroups = useMemo(() => ['pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'piernas', 'abdominales'], []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4">
      <div className="bg-[#191919] rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="bebas-font text-4xl text-[#EAEBED] tracking-wider">Planificar Semana</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl">&times;</button>
        </div>
        
        <div className="overflow-y-auto pr-2">
          <div className="space-y-4">
            {daysOfWeek.map(day => (
              <div key={day} className="bg-[#252525] p-4 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-2">{day}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                  {muscleGroups.map(group => {
                    const isChecked = localSchedule[group]?.includes(day) || false;
                    return (
                      <div key={`${day}-${group}`} onClick={() => handleCheckboxChange(day, group)} className="cursor-pointer flex items-center">
                        <div className={`w-5 h-5 flex justify-center items-center border-2 ${isChecked ? 'bg-black border-black' : 'border-gray-500'} rounded-md mr-2 transition-all`}>
                          {isChecked && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                        <span className={`capitalize ${isChecked ? 'text-white' : 'text-gray-300'}`}>{group}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="bebas-font text-lg tracking-wider px-6 py-2 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="bebas-font text-lg tracking-wider px-8 py-2 rounded-lg text-white bg-black hover:bg-gray-900 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanificadorModal;
