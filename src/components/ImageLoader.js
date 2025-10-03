import React, { useState } from 'react';

const ImageLoader = ({ src, alt, className }) => {
  // --- DETALLE IMPORTANTE 1: El estado de carga ---
  // Usamos un estado para saber si la imagen está cargando o no.
  // Por defecto, asumimos que siempre está cargando al principio.
  const [isLoading, setIsLoading] = useState(true);

  return (
    // Usamos un contenedor relativo para posicionar el esqueleto y la imagen en el mismo lugar.
    <div className={`relative ${className}`}>
      
      {/* --- DETALLE IMPORTANTE 2: El Esqueleto (Skeleton) --- */}
      {/* Mientras isLoading sea true, mostramos este div. */}
      {/* Es un recuadro gris con una animación de pulso que viene de Tailwind CSS. */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-lg"></div>
      )}

      {/* --- DETALLE IMPORTANTE 3: La Imagen Real --- */}
      <img
        src={src}
        alt={alt}
        // Hacemos la imagen transparente al inicio y le aplicamos una transición de opacidad.
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        // El evento 'onLoad' se dispara automáticamente cuando el navegador termina de descargar la imagen.
        // En ese momento, actualizamos el estado para indicar que ya no está cargando.
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default ImageLoader;
