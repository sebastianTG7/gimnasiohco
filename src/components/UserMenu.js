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
        className="bebas-font flex items-center gap-2 bg-gray-800/80 border border-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 hover:border-[#379AA5] transition-all shadow-md tracking-wider"
      >
        <svg className="w-5 h-5 text-[#379AA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl overflow-hidden z-[60]">
          {/* Header del menú */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#379AA5]/20 rounded-full flex items-center justify-center border border-[#379AA5]/30">
                <svg className="w-6 h-6 text-[#379AA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#379AA5]/20 hover:border-l-4 hover:border-[#379AA5] transition-all text-left"
            >
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">Entrenar Ahora</span>
            </button>

            <button
              onClick={() => handleNavigation('/mi-plan')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#379AA5]/20 hover:border-l-4 hover:border-[#379AA5] transition-all text-left"
            >
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">Mi Rutina</span>
            </button>

            <button
              onClick={() => handleNavigation('/seleccionar-ejercicios')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#379AA5]/20 hover:border-l-4 hover:border-[#379AA5] transition-all text-left"
            >
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="font-medium">Seleccionar Ejercicios</span>
            </button>

            <button
              onClick={() => handleNavigation('/historial-entrenamiento')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#379AA5]/20 hover:border-l-4 hover:border-[#379AA5] transition-all text-left"
            >
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">Ver Historial</span>
            </button>

            <div className="border-t border-gray-700 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-600/20 hover:border-l-4 hover:border-red-500 transition-all text-left"
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
