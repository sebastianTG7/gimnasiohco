import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GridBackground } from './GridBackground';
import { Spotlight } from './ui/Spotlight';
import { useAuth } from '../contexts/AuthContext';

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border-2 border-[#379AA5] rounded-xl shadow-2xl p-8 w-full max-w-md text-center relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#379AA5] to-transparent"></div>
        
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-[#379AA5]/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-[#379AA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="bebas-font text-4xl text-[#379AA5] tracking-wider mb-2">¡REGISTRO EXITOSO!</h2>
          <p className="text-gray-300 text-lg">Tu cuenta ha sido creada correctamente</p>
        </div>
        
        <p className="text-gray-400 mb-6">Ya puedes iniciar sesión con tus credenciales</p>
        
        <button 
          onClick={onClose}
          className="bebas-font w-full bg-[#379AA5] text-white px-6 py-3 rounded-lg hover:bg-[#2A7A87] transition-all shadow-lg text-lg tracking-wider"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { signup, login, resetPassword } = useAuth();
  const [mode, setMode] = useState('login');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    acceptTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    };

    for (const [code, message] of Object.entries(errorMessages)) {
      if (errorCode.includes(code)) {
        return message;
      }
    }

    return 'Error al procesar la solicitud';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setLoading(false);
          return;
        }

        if (!formData.acceptTerms) {
          setError('Debes aceptar los términos y condiciones');
          setLoading(false);
          return;
        }

        const result = await signup(formData.email, formData.password, formData.username);
        
        if (result.success) {
          setShowSuccessModal(true);
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            username: '',
            acceptTerms: false
          });
        } else {
          setError(getErrorMessage(result.error));
        }
      } else if (mode === 'login') {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          navigate('/');
        } else {
          setError(getErrorMessage(result.error));
        }
      } else if (mode === 'forgot') {
        const result = await resetPassword(formData.email);
        
        if (result.success) {
          setError('');
          alert('Se ha enviado un enlace de recuperación a tu correo electrónico');
          setMode('login');
        } else {
          setError(getErrorMessage(result.error));
        }
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setMode('login');
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <GridBackground />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="bebas-font text-2xl text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              VOLVER
            </Link>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#379AA5] to-transparent"></div>
              <div className="p-8 pb-6">
                <h1 className="bebas-font text-5xl text-center tracking-wider mb-2">
                  {mode === 'login' && 'INICIAR SESIÓN'}
                  {mode === 'register' && 'REGISTRARSE'}
                  {mode === 'forgot' && 'RECUPERAR CUENTA'}
                </h1>
                <p className="text-center text-gray-400">
                  {mode === 'login' && 'Accede a tu cuenta de Energy'}
                  {mode === 'register' && 'Crea tu cuenta en Energy'}
                  {mode === 'forgot' && 'Recupera el acceso a tu cuenta'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mx-8 mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                    NOMBRE DE USUARIO
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#379AA5] focus:ring-1 focus:ring-[#379AA5] transition-all"
                    placeholder="Tu nombre de usuario"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                  CORREO ELECTRÓNICO
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#379AA5] focus:ring-1 focus:ring-[#379AA5] transition-all"
                  placeholder="tu@email.com"
                />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                    CONTRASEÑA
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#379AA5] focus:ring-1 focus:ring-[#379AA5] transition-all"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                    CONFIRMAR CONTRASEÑA
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#379AA5] focus:ring-1 focus:ring-[#379AA5] transition-all"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {mode === 'register' && (
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-4 h-4 bg-gray-800 border-gray-700 rounded focus:ring-[#379AA5] focus:ring-2"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-400 cursor-pointer">
                    Acepto los{' '}
                    <a href="#" className="text-[#379AA5] hover:text-[#2A7A87] underline">
                      términos y condiciones
                    </a>
                    {' '}y la{' '}
                    <a href="#" className="text-[#379AA5] hover:text-[#2A7A87] underline">
                      política de privacidad
                    </a>
                  </label>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-sm text-[#379AA5] hover:text-[#2A7A87] transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bebas-font bg-gradient-to-r from-[#379AA5] to-[#2A7A87] text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-[#379AA5]/50 transition-all text-xl tracking-wider transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'PROCESANDO...' : (
                  <>
                    {mode === 'login' && 'INICIAR SESIÓN'}
                    {mode === 'register' && 'CREAR CUENTA'}
                    {mode === 'forgot' && 'ENVIAR ENLACE'}
                  </>
                )}
              </button>
            </form>

            <div className="px-8 pb-8">
              <div className="border-t border-gray-800 pt-6 text-center">
                {mode === 'login' && (
                  <p className="text-gray-400">
                    ¿No tienes cuenta?{' '}
                    <button
                      onClick={() => setMode('register')}
                      className="text-[#379AA5] hover:text-[#2A7A87] font-semibold transition-colors"
                    >
                      Regístrate aquí
                    </button>
                  </p>
                )}
                {(mode === 'register' || mode === 'forgot') && (
                  <p className="text-gray-400">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="text-[#379AA5] hover:text-[#2A7A87] font-semibold transition-colors"
                    >
                      Inicia sesión
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Energy Gym © {new Date().getFullYear()} - Todos los derechos reservados
          </p>
        </div>
      </div>

      <SuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />
    </div>
  );
};

export default Login;
