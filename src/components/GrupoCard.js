import { Link } from 'react-router-dom';

const GrupoCard = ({ grupo }) => {
  return (
    <Link to={`/${grupo.slug}`} className="relative image-grid-item group rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 h-80">
      <img src={grupo.img} alt={`Entrenamiento de ${grupo.nombre}`} className="w-full h-full object-cover filter grayscale" />
      <div className="image-overlay">
        <div>
          <span className="bebas-font text-3xl tracking-widest text-white">{grupo.nombre.toUpperCase()}</span>
          <p className="text-base text-white/90 md:hidden">Toca para ver</p>
          <p className="text-base text-white/90 hidden md:block">Click para ver</p>
        </div>
      </div>
    </Link>
  );
};

export default GrupoCard;