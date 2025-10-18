import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { images } from './assets';
import DetalleEjercicio from './components/rutinas/DetalleEjercicio';
import SwipeableMenu from './components/SwipeableMenu';
import ScrollToTop from './components/ScrollToTop';
import PlanificadorModal from './components/PlanificadorModal';
import ScrollToTopButton from './components/ScrollToTopButton';
import { Spotlight } from './components/ui/Spotlight';
import { GridBackground } from './components/GridBackground';
import pako from 'pako';

// Componente de la Página de Inicio (fuera de App para evitar re-renders)
const HomePage = ({ typewriterText, loopNum, toRotate }) => {
  const [showMore, setShowMore] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#', text: 'INICIO' },
    { href: '#ejercicios', text: 'EJERCICIOS' },
    { href: '#about', text: '¿QUIÉNES SOMOS?' },
    { href: '#contacto', text: 'CONTACTOS' },
  ];

  const socialLinks = [
    { href: 'https://www.tiktok.com/@energyhco', icon: images.tik_tok, name: 'TikTok' },
    { href: 'https://www.facebook.com/energy.huanuco', icon: images.facebook, name: 'Facebook' },
    { href: 'https://www.instagram.com/energyhuanuco/', icon: images.instagram, name: 'Instagram' },
  ];

  const mainGrupos = [
    { nombre: 'Pecho', slug: 'pecho', img: images.pecho },
    { nombre: 'Espalda', slug: 'espalda', img: images.espalda },
    { nombre: 'Hombros', slug: 'hombros', img: images.hombros },
    { nombre: 'Biceps', slug: 'biceps', img: images.biceps },
    { nombre: 'Triceps', slug: 'triceps', img: images.triceps },
    { nombre: 'Piernas', slug: 'piernas', img: images.piernas },
  ];

  const extraGrupos = [
    { nombre: 'Abdominales', slug: 'abdominales', img: images.abdominales },
  ];

  return (
  <>
    <SwipeableMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
      <ul className="flex flex-col space-y-8 text-center mt-24">
        {navLinks.map(link => (
          <li key={link.href}>
            <a 
              href={link.href} 
              onClick={() => setIsMenuOpen(false)} 
              className="bebas-font text-2xl text-gray-300 hover:text-white tracking-widest transition-colors"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
      <div className="border-t border-gray-700 mt-auto pt-6">
        <div className="flex justify-center space-x-6">
          {socialLinks.map(social => (
            <a href={social.href} key={social.name} target="_blank" className="group flex flex-col items-center space-y-2">
              <img src={social.icon} alt={social.name} className="h-8 w-8 transition-transform group-hover:scale-110" />
              <span 
                className="text-xs tracking-wider bg-clip-text text-gray-500 group-hover:animate-shine group-hover:text-gray-400"
                style={{
                  backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 70%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                }}
              >
                {social.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </SwipeableMenu>

    <div className="hero-bg relative w-full h-screen flex items-center justify-center p-8 bg-black">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
      
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-6 right-6 z-[100] flex items-center gap-2 text-white"
        aria-label="Toggle menu"
      >
        <span className="bebas-font text-xl tracking-wider">
          {isMenuOpen ? 'CERRAR' : 'MENU'}
        </span>
        <div className={`menu-icon-container ${isMenuOpen ? 'open' : ''}`}>
          <div className="menu-icon-bar bar1 bg-white"></div>
          <div className="menu-icon-bar bar2 bg-white"></div>
        </div>
      </button>

      {/* Navegación */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-transparent">
           <div className="flex items-center space-x-3">
              <img src={images.logo_gym} alt="Logo de Energy" className="h-10 opacity-70 ml-2" />
              <h1 className="bebas-font text-3x2 md:text-4x2 text-white tracking-widest">ENERGY</h1>
          </div>
          <div className="hidden md:flex space-x-12 text-lg">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="hover:text-[#2A7A87] transition-colors">{link.text}</a>
            ))}
          </div>
          <a href="#ejercicios" className="hidden md:block bebas-font border-2 border-[#379AA5] text-[#379AA5] px-6 py-2 rounded-lg hover:bg-[#379AA5] hover:text-gray-900 transition-colors">
            Empezar
          </a>
      </nav>
      
      {/* Contenido principal del Hero */}
      <div className="relative z-10 text-center md:text-left md:w-1/2 p-4">
        {/* Letras efecto maquina de escribir */}
          <h2 className="bebas-font text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-4 tracking-wider">
              BIENVENIDO A <span style={{ color: '#379AA5' }}>ENERGY</span>
              {
                (loopNum % toRotate.length === 1 && typewriterText.indexOf('HOY') !== -1)
                ? <>
                    {` ${typewriterText.substring(0, typewriterText.indexOf('HOY'))}`}
                    <span style={{color: '#379AA5'}}>{typewriterText.substring(typewriterText.indexOf('HOY'))}</span>
                  </>
                : ` ${typewriterText}`
              }
              <span className="cursor">|</span>
          </h2>
                  <div
                    className="animate-shine text-xl md:text-2xl mb-8 tracking-wide bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(120deg, #9CA3AF 30%, #FFFFFF 50%, #9CA3AF 70%)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                    }}
                  >
                    Ideal para quienes están empezando en el gimnasio
                  </div>
                  <a href="#ejercicios" className="bg-[#379AA5] hover:bg-[#2A7A87] text-white px-8 py-3 rounded-md shadow-lg transition-colors">Ver Ejercicios</a>
              </div>

              {/* Animated Scroll Down Indicator */}
              <a href="#ejercicios" aria-label="Scroll down" className="absolute z-30 bottom-8 md:left-1/2 md:-translate-x-1/2 text-white animate-bounce" style={{ bottom: 'calc(3rem + env(safe-area-inset-bottom))' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </a>
      
      {/* Imagen de la persona en el Hero */}
      <img src={images.hero} alt="Persona entrenando" className="absolute top-0 right-0 h-full w-full object-cover z-5 opacity-30 md:opacity-40 md:w-2/5" />
  </div>

  {/* Sección de Ejercicios (Menú Principal) */}
  <section id="ejercicios" className="relative py-20 px-4 md:px-8 bg-gray-900">
      <GridBackground />
      <div className="relative z-10 max-w-7xl mx-auto">
          <h3 className="bebas-font text-5xl md:text-6xl text-center mb-8 tracking-wider">LISTA DE EJERCICIOS</h3>
          <p className="text-lg text-gray-400 mb-8">Selecciona un grupo muscular para comenzar y ver los ejercicios.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainGrupos.map((grupo) => (
              <Link to={`/${grupo.slug}`} key={grupo.slug} className="relative image-grid-item group rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 h-80">
                <img src={grupo.img} alt={`Entrenamiento de ${grupo.nombre}`} className="w-full h-full object-cover filter grayscale" />
                <div className="image-overlay">
                  <div>
                    <span className="bebas-font text-3xl tracking-widest text-white">{grupo.nombre.toUpperCase()}</span>
                    <p className="text-base text-white/90 md:hidden">Toca para ver</p>
                    <p className="text-base text-white/90 hidden md:block">Click para ver</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            {!showMore ? (
              <span 
                onClick={() => setShowMore(true)} 
                className="text-gray-400 hover:text-white text-lg underline cursor-pointer transition-colors"
              >
                Ver más...
              </span>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {extraGrupos.map((grupo) => (
                    <Link to={`/${grupo.slug}`} key={grupo.slug} className="relative image-grid-item group rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 h-80">
                      <img src={grupo.img} alt={`Entrenamiento de ${grupo.nombre}`} className="w-full h-full object-cover filter grayscale" />
                      <div className="image-overlay">
                        <div>
                          <span className="bebas-font text-3xl tracking-widest text-white">{grupo.nombre.toUpperCase()}</span>
                          <p className="text-base text-white/90 md:hidden">Toca para ver</p>
                          <p className="text-base text-white/90 hidden md:block">Click para ver</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <span 
                  onClick={() => setShowMore(false)} 
                  className="text-gray-400 hover:text-white text-lg underline cursor-pointer transition-colors mt-8 inline-block"
                >
                  Ver menos
                </span>
              </>
            )}
          </div>

      </div>
  </section>

  {/* Separador de línea con gradiente */}
  <div className="px-4 md:px-8">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#379AA5] to-transparent"></div>
  </div>

  {/* Sección Sobre Nosotros */}
  <section id="about" className="py-20 px-4 md:px-8 bg-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-xl overflow-hidden shadow-xl image-feather-edge">
              <img src={images.lugar_energy} alt="Grupo de personas en el gimnasio" className="w-full h-auto object-cover" />
          </div>
          <div className="text-gray-200">
              <h3 className="bebas-font text-5xl md:text-6xl text-[#379AA5] mb-5 tracking-wider">¿QUIÉNES SOMOS?</h3>
              <p className="text-lg leading-relaxed mb-6">
                  Energy no es solo un gimnasio. Es una casa de transformación. Con más de 10 años forjando fierros y
                  formando personas, nos dedicamos a algo más que dar rutinas. Aquí no hay excusas, hay resultados, no
                  creemos en atajos, creemos en constancia, disciplina y sudor del bueno.
              </p>
          </div>
      </div>
  </section>

  {/* Separador de línea con gradiente */}
  <div className="px-4 md:px-8">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#379AA5] to-transparent"></div>
  </div>

  {/* Pie de Página */}
  <footer id="contacto" className="bg-black py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center">
          <h3 className="bebas-font text-5xl md:text-6xl text-white mb-8 tracking-wider">CONTACTOS</h3>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-2 border-gray-800 pb-8">
              <div className="text-center md:text-left mb-8 md:mb-0">
                  <p className="text-lg mb-2">📞 981 326 184</p>
                  <p className="text-lg mb-2">📧 energyhuanuco@gmail.com</p>
                  <p className="text-lg">📍 Jr. Aguilar 771-Piso 2, Huánuco</p>
              </div>
             
              <div className="flex space-x-6 text-2xl">
                  <a href="https://www.tiktok.com/@energyhco" target="_blank" aria-label="TikTok"><img src={images.tik_tok} alt="TikTok" className="h-10 w-10  transition-colors" /></a>
                  <a href="https://www.facebook.com/energy.huanuco" target="_blank" aria-label="Facebook"><img src={images.facebook} alt="facebook" className="h-10 w-10 text-white hover:text-cyan-400 transition-colors" /></a>
                  <a href="https://www.instagram.com/energyhuanuco/" target="_blank" aria-label="Instagram"><img src={images.instagram} alt="instagram" className="h-10 w-10 text-white hover:text-cyan-400 transition-colors" /></a>

              </div>
              
          </div>
         <div className="flex flex-col justify-center items-center">
           <div className="flex items-center space-x-3">
                <img src={images.logo_gym} alt="Logo de Energy" className="h-16 opacity-70" /> 
                <h1  className="bebas-font text-3xl md:text-4xl text-white tracking-widest opacity-70">ENERGY</h1> 
              </div>
              <p className="mt-4 text-gray-500 max-w-md">⚠️ Energy está en versión beta!</p>
            <p className="text-gray-500 mt-4">&copy; {new Date().getFullYear()} Energy.</p>
           </div>
      </div>
  </footer>
  </>
);};

// Lee el estado desde la URL o devuelve un estado por defecto
const getInitialState = () => {
  const defaultState = { 
    schedule: { days: {}, types: [] }, 
    selectedExercises: {},
    customDetails: {} 
  };

  try {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');

    if (configParam) {
      // Decodificar de Base64 a string binario
      const binaryString = atob(configParam);
      // Convertir string binario a Uint8Array
      const compressed = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        compressed[i] = binaryString.charCodeAt(i);
      }

      // Descomprimir con pako
      const decodedJson = pako.inflate(compressed, { to: 'string' });
      const parsedState = JSON.parse(decodedJson);
      
      // Valida y fusiona el estado para asegurar que no falten llaves
      if (parsedState.schedule && parsedState.selectedExercises) {
        return {
          schedule: { ...defaultState.schedule, ...parsedState.schedule },
          selectedExercises: { ...defaultState.selectedExercises, ...parsedState.selectedExercises },
          customDetails: { ...defaultState.customDetails, ...parsedState.customDetails }
        };
      }
    }
  } catch (error) {
    console.error("Fallo al leer el estado de la URL, usando valores por defecto.", error);
    return defaultState;
  }

  return defaultState;
};

function App() {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(150);

  // Estado inicializado desde la URL o por defecto
  const initialState = useMemo(() => getInitialState(), []);
  const [selectedExercises, setSelectedExercises] = useState(initialState.selectedExercises);
  const [schedule, setSchedule] = useState(initialState.schedule);
  const [customDetails, setCustomDetails] = useState(initialState.customDetails);

  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  const handleRoutineTypeChange = (type) => {
    setSchedule(prev => {
      const currentTypes = prev.types || [];
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter(t => t !== type)
        : [...currentTypes, type];
      return { ...prev, types: newTypes };
    });
  };

  const handleSaveSchedule = (newDaySchedule) => {
    setSchedule(prev => ({
      ...prev,
      days: newDaySchedule
    }));
    setIsPlannerOpen(false);
  };

  const handleExerciseSelection = (group, exerciseName) => {
    setSelectedExercises(prev => {
      const groupSelections = prev[group] || [];
      const newGroupSelections = groupSelections.includes(exerciseName)
        ? groupSelections.filter(name => name !== exerciseName)
        : [...groupSelections, exerciseName];
      
      return {
        ...prev,
        [group]: newGroupSelections
      };
    });
  };

  const handleDetailsChange = (group, exerciseName, detail, value) => {
    setCustomDetails(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [exerciseName]: {
          ...prev[group]?.[exerciseName],
          [detail]: value
        }
      }
    }));
  };

  const handleClearGroupSelection = (groupToClear) => {
    setSelectedExercises(prev => ({
      ...prev,
      [groupToClear]: []
    }));
  };

  const handleShare = async () => {
    try {
      const stateToShare = {
        schedule,
        selectedExercises,
        customDetails,
      };
      const jsonString = JSON.stringify(stateToShare);
      
      // Comprimir con pako
      const compressed = pako.deflate(jsonString);

      // Convertir Uint8Array a string binario para btoa
      let binaryString = '';
      const len = compressed.byteLength;
      for (let i = 0; i < len; i++) {
        binaryString += String.fromCharCode(compressed[i]);
      }
      const base64String = btoa(binaryString);
      
      const cleanUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${cleanUrl}?config=${base64String}`;

      if (navigator.share) {
        await navigator.share({
          title: 'Mi Plan de Gimnasio',
          text: '¡Mira el plan de entrenamiento que preparé!',
          url: shareUrl,
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        alert('¡Enlace de tu plan copiado al portapapeles!');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      alert('Hubo un error al intentar compartir tu plan.');
    }
  };
// Las frases dinamicas para el efecto de máquina de escribir
  const toRotate = useMemo(() => ["DONDE EMPIEZA TODO", "TU NUEVA DISCIPLINA."], []);
  const period = 3000;

  useEffect(() => {
    const tick = () => {
      let i = loopNum % toRotate.length;
      let fullText = toRotate[i];
      let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

      setText(updatedText);

      if (isDeleting) {
        setDelta(prevDelta => prevDelta / 2);
      }

      if (!isDeleting && updatedText === fullText) {
        setIsDeleting(true);
        setDelta(period);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setDelta(200);
      } else if (isDeleting) {
        setDelta(75);
      }
    };

    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text, delta, isDeleting, loopNum, toRotate]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage typewriterText={text} loopNum={loopNum} toRotate={toRotate} />} />
        <Route 
          path="/:grupo" 
          element={<DetalleEjercicio 
            selectedExercises={selectedExercises} 
            onSelectExercise={handleExerciseSelection} 
            onClearGroup={handleClearGroupSelection}
            schedule={schedule} 
            routineTypes={schedule.types} // Pasar el array de tipos global
            onRoutineTypeChange={handleRoutineTypeChange} // Pasar el nuevo manejador
            onOpenPlanner={() => setIsPlannerOpen(true)}
            onShare={handleShare} // Pasar la función de compartir
            customDetails={customDetails}
            onDetailsChange={handleDetailsChange}
          />} 
        />
      </Routes>
      <PlanificadorModal 
        isOpen={isPlannerOpen} 
        onClose={() => setIsPlannerOpen(false)} 
        schedule={schedule} 
        onSave={handleSaveSchedule} 
      />
      <ScrollToTopButton />
    </>
  );
}

export default App;