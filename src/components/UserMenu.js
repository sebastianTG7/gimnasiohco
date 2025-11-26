import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserMenu = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  if (!currentUser) return null;

  const userEmail = currentUser.email || 'Usuario';
  const userName = currentUser.username || userEmail.split('@')[0];

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón del usuario - Estilo del home */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bebas-font flex items-center gap-2 bg-blue-600 border border-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md tracking-wider"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>{userName}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menú dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#191919] backdrop-blur-md border-2 border-slate-700/50 rounded-lg shadow-xl overflow-hidden z-[60]">
          {/* Header del menú */}
          <div className="bg-[#252525] p-4 border-b-2 border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white">{userName}</p>
                <p className="text-xs text-gray-400">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="py-2">
            <button
              onClick={() => handleNavigation('/entrenamiento')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-800/20 transition-all text-left"
            >
              <span className="font-medium">Entrenar Ahora</span>
            </button>

            <button
              onClick={() => handleNavigation('/mi-plan')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-800/20 transition-all text-left"
            >
              <span className="font-medium">Mi Rutina</span>
            </button>

            <button
              onClick={() => handleNavigation('/seleccionar-ejercicios')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-800/20 transition-all text-left"
            >
              <span className="font-medium">Seleccionar Ejercicios</span>
            </button>

            <button
              onClick={() => handleNavigation('/historial-entrenamiento')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-800/20 transition-all text-left"
            >
              <span className="font-medium">Ver Historial</span>
            </button>

            <div className="border-t border-slate-700/50 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-600/20 transition-all text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
