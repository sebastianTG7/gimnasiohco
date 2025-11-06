
import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(true); // Para controlar la visibilidad con timeout

  // Muestra el botón cuando el scroll vertical es mayor a 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
      setIsActive(true); // Mostrar el botón cuando hay scroll
    } else {
      setIsVisible(false);
      setIsActive(false);
    }
  };

  // Desplaza la página hacia arriba suavemente
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Ocultar el botón después de 2 segundos de inactividad
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsActive(false);
      }, 2000); // 2 segundos

      return () => clearTimeout(timer);
    }
  }, [isVisible, isActive]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 ${
            isActive ? 'opacity-80 translate-x-0' : 'opacity-0 translate-x-20'
          }`}
          aria-label="Volver arriba"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
