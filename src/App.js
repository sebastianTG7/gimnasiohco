import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { images, videos } from './assets';
import DetalleEjercicio from './components/rutinas/DetalleEjercicio';
import MiPlan from './components/MiPlan';
import WorkoutMode from './components/WorkoutMode';
import WorkoutHistory from './components/WorkoutHistory';
import Login from './components/Login';
import SwipeableMenu from './components/SwipeableMenu';
import ScrollToTop from './components/ScrollToTop';
import PlanificadorModal from './components/PlanificadorModal';
import ScrollToTopButton from './components/ScrollToTopButton';
import { Spotlight } from './components/ui/Spotlight';
import { GridBackground } from './components/GridBackground';
import { useAuth } from './contexts/AuthContext';
import { useRoutines } from './hooks/useRoutines';
import RoutineManagerModal from './components/RoutineManagerModal';
import SelectExercises from './components/SelectExercises';
import UserMenu from './components/UserMenu';
import pako from 'pako';


// Componente de la Página de Inicio (fuera de App para evitar re-renders)
const HomePage = ({ typewriterText, loopNum, toRotate }) => {
  const { currentUser, logout, loading } = useAuth();
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [shouldOpenAccordions, setShouldOpenAccordions] = useState(false);

  // Scroll automático a ejercicios cuando se navega con el state
  useEffect(() => {
    if (location.state?.scrollToExercises) {
      setShouldOpenAccordions(true); // Activar flag para abrir acordeones
      setTimeout(() => {
        const ejerciciosSection = document.getElementById('ejercicios');
        if (ejerciciosSection) {
          ejerciciosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        // Siempre mostrar el nav en la parte superior
        setShowNav(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling hacia abajo - ocultar nav
        setShowNav(false);
      } else {
        // Scrolling hacia arriba - mostrar nav
        setShowNav(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Cerrar menú de usuario al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

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
              className="bebas-font text-2xl text-white hover:text-gray-900 tracking-widest transition-colors"
            >
              {link.text}
            </a>
          </li>
        ))}
        <li>
          <Link 
            to="/seleccionar-ejercicios"
            onClick={() => setIsMenuOpen(false)} 
            className="bebas-font text-2xl text-white hover:text-gray-900 tracking-widest transition-colors"
          >
            SELECCIONAR EJERCICIOS
          </Link>
        </li>
        <li>
          <Link 
            to="/login"
            onClick={() => setIsMenuOpen(false)} 
            className="bebas-font text-2xl text-white hover:text-gray-900 tracking-widest transition-colors"
          >
            INICIAR SESIÓN
          </Link>
        </li>
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
    
    <div className="hero-bg relative w-full h-screen flex items-center justify-center md:justify-start p-8 bg-black overflow-hidden isolate">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
      
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`md:hidden fixed top-6 right-6 z-[100] flex items-center gap-2 text-white transition-all duration-300 ${
          (lastScrollY > 50 && !showNav) ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
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

      {/* Navegación superior nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        showNav ? 'translate-y-0' : '-translate-y-full'
      } ${lastScrollY > 50 ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center gap-4">
           <div className="flex items-center space-x-3 flex-shrink-0">
              <img src={images.logo_gym} alt="Logo de Energy" className="h-10 opacity-70 ml-2" />
              <h1 className="bebas-font text-lg md:text-2xl text-white tracking-widest">ENERGY</h1>
          </div>
          <div className="bebas-font tracking-wider hidden md:flex space-x-14 md:space-x-8 lg:space-x-20 text-2xl md:text-xl lg:text-2xl items-center flex-grow justify-center">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="hover:text-blue-600 transition-colors whitespace-nowrap">{link.text}</a>
            ))}
          </div>
          
          {/* User Menu o Login Button */}
          <div className="flex justify-end flex-shrink-0">
            {loading ? (
              <div className="w-[148px] h-10 bg-gray-800/50 rounded-lg animate-pulse"></div>
            ) : currentUser ? (
              <UserMenu />
            ) : (
              <Link to="/login" className="bebas-font bg-blue-600 hover:bg-blue-700 rounded-md shadow-lg text-white px-6 py-2 tracking-wider whitespace-nowrap inline-block">
                INICIAR SESIÓN 
              </Link>
            )}
          </div>
          </div>
        </div>
      </nav>
      
      {/* Contenido principal del Hero */}
      <div className="relative z-10 text-center md:text-left md:w-[70%] md:p-20 p-4">
        {/* Letras efecto maquina de escribir */}
          <h2 className="bebas-font text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-4 tracking-wider">
              BIENVENIDO A <span className='text-orange-500'>ENERGY</span>
              {
                (loopNum % toRotate.length === 1 && typewriterText.indexOf('HOY') !== -1)
                ? <>
                    {` ${typewriterText.substring(0, typewriterText.indexOf('HOY'))}`}
                    <span style={{color: '#2563EB'}}>{typewriterText.substring(typewriterText.indexOf('HOY'))}</span>
                  </>
                : ` ${typewriterText}`
              }
              <span className="cursor">|</span>
          </h2>
                  <div
                    className="animate-shine text-sm  md:text-xl mb-8 tracking-wide bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(120deg, #9CA3AF 30%, #FFFFFF 50%, #9CA3AF 70%)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                    }}
                  >
                   Tu punto de partida está aquí, te guiamos con planes perersonalizados y sin presiones.
                  </div>
                  <Link to="/mi-plan" className="bebas-font tracking-widest bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-lg transition-colors">Comenzar Ahora</Link>
              </div>

              {/* Animated Scroll Down Indicator */}
              <a href="#ejercicios" aria-label="Scroll down" className="absolute z-30 bottom-8 md:left-1/2 md:-translate-x-1/2 text-white animate-bounce" style={{ bottom: 'calc(3rem + env(safe-area-inset-bottom))' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </a>
      
      {/* Imagen de la persona en el Hero */}
      <img src={images.hero} alt="Persona entrenando" className="absolute inset-0 h-full w-full object-cover z-5 opacity-30 md:opacity-40 hero-image-position"/>
  </div>

  {/* Sección de Ejercicios (Menú Principal) */}
  <section id="ejercicios" className="relative py-20 px-4 md:px-8 bg-gray-900">
      <GridBackground />
      <div className="relative z-10 max-w-7xl mx-auto">
          <h3 className="bebas-font text-5xl md:text-6xl text-center mb-4 tracking-wider">LISTA DE EJERCICIOS</h3>
          <p className="text-lg text-gray-400 mb-8 text-center">Selecciona un grupo muscular para comenzar y ver los ejercicios.</p>
          
          {/* Botón para vista unificada */}
          <div className="flex justify-center mb-8">
            <Link
              to="/seleccionar-ejercicios"
              className="bebas-font bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-2xl transition-all transform hover:scale-105 text-xl tracking-wider flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              SELECCIÓN AVANZADA DE EJERCICIOS
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainGrupos.map((grupo) => (
              <Link 
                to={`/${grupo.slug}`} 
                state={shouldOpenAccordions ? { openAccordion: true } : undefined}
                key={grupo.slug} 
                className="relative image-grid-item group rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 h-80"
              >
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
                    <Link 
                      to={`/${grupo.slug}`} 
                      state={shouldOpenAccordions ? { openAccordion: true } : undefined}
                      key={grupo.slug} 
                      className="relative image-grid-item group rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 h-80"
                    >
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
    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#252525] to-transparent"></div>
  </div>

  {/* Sección Sobre Nosotros */}
  <section id="about" className="py-20 px-4 md:px-8 bg-[#191919]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-xl overflow-hidden shadow-xl image-feather-edge">
              <img src={images.lugar_energy} alt="Grupo de personas en el gimnasio" className="w-full h-auto object-cover" />
          </div>
          <div className="text-gray-200">
              <h3 className="bebas-font text-5xl md:text-6xl text-white mb-5 tracking-wider">¿QUIÉNES SOMOS?</h3>
              <p className="text-lg leading-relaxed mb-6">
                  Energy no es solo un gimnasio. Es una casa de transformación. Con más de 20 años forjando fierros y
                  formando personas, nos dedicamos a algo más que dar rutinas. Aquí no hay excusas, hay resultados, no
                  creemos en atajos, creemos en constancia, disciplina y sudor del bueno.
              </p>
          </div>
      </div>
  </section>


  {/* Pie de Página */}
  <footer id="contacto" className="bg-black py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center">
          <h3 className="bebas-font text-5xl md:text-6xl text-white mb-8 tracking-wider">CONTACTOS</h3>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-2 border-gray-800 pb-8">
              <div className="text-left  md:text-left mb-8 md:mb-0">
                  <p className="text-lg mb-2">Tel: 981 326 184</p>
                  <p className="text-lg mb-2">Correo: energyhuanuco@gmail.com</p>
                  <p className="text-lg">Jr. Aguilar 771-Piso 2, Huánuco</p>
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
              <p className="mt-4 text-gray-500 max-w-md">Energy está en versión beta!</p>
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
  const { currentUser } = useAuth();
  const { 
    routines, 
    currentRoutine, 
    loading: routinesLoading,
    createRoutine, 
    updateRoutine, 
    deleteRoutine,
    setActiveRoutine,
    setCurrentRoutine 
  } = useRoutines();

  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(150);

  const datosEjercicios = useMemo(() => ({
    pecho: {
      titulo: "EJERCICIOS DE PECHO",
      ejercicios: ["Press Banca (barra)", "Press Inclinado (barra)", "Press Banca (Mancuernas)","Press Inclinado (Mancuernas)","Press Máquina", "Aperturas (Mancuernas)","Aperturas (Cable)", "Aperturas Pec Fly","Fondos"],
      imagenes: [
        { src: images.img_press_banca_barra, nombre: 'Press Banca (barra)', descripcion: 'Activa principalmente las fibras centrales del pectoral mayor (porción esternocostal). También involucra el deltoides anterior y la cabeza larga del tríceps braquial.', detalles: '3 series de 8–12 repeticiones', videoUrl: 'https://www.youtube.com/embed/g4Ah9uYn8pI' },
        { src: images.img_press_inclinado_barra, nombre: 'Press Inclinado (barra)', descripcion: 'Enfoca el estímulo en la parte superior del pectoral mayor (porción clavicular). Secundariamente activa el deltoides anterior y el tríceps braquial.', detalles: '3 series de 8–12 repeticiones', videoUrl: 'https://www.youtube.com/embed/HImp2-LuihU' },
        { src: images.img_press_banca_mancuernas, nombre: 'Press Banca (Mancuernas)', descripcion: 'Estimula las fibras centrales del pectoral mayor (porción esternocostal), con mayor implicación de los músculos estabilizadores escapulares. También participa el deltoides anterior y el tríceps braquial.', detalles: '3 series de 10–12 repeticiones', videoUrl:videos.vid_pecho_press_banca_mancuerna },
        { src: images.img_press_inclinado_mancuernas, nombre: 'Press Inclinado (Mancuernas)', descripcion: 'Activa predominantemente la parte superior del pectoral mayor (porción clavicular). Como sinergistas intervienen el deltoides anterior y el tríceps braquial.', detalles: '3 series de 10 repeticiones', videoUrl: videos.vid_press_inclinado_mancuernas },
        { src: images.img_press_maquina, nombre: 'Press Máquina', descripcion: 'Focaliza la tensión sobre las fibras medias del pectoral mayor (porción esternocostal), reduciendo la participación de estabilizadores. Secundariamente se activa el deltoides anterior y el tríceps braquial.', detalles: '3 series de 12–15 repeticiones', videoUrl: 'https://www.youtube.com/embed/JXJmPXlqwh0' },
        { src: images.img_aperturas_mancuernas, nombre: 'Aperturas (Mancuernas)', descripcion: 'Aíslan las fibras externas del pectoral mayor (porción lateral y esternal) durante la aducción horizontal del brazo. Participa también el deltoides anterior como sinergista leve.',detalles: '3 series de 12 repeticiones', videoUrl: videos.vid_pecho_aperturas_mancuernas },
        { src: images.img_aperturas_cable, nombre: 'Aperturas (Cable)', descripcion: 'Mantienen tensión continua sobre las fibras laterales del pectoral mayor (porción esternocostal y clavicular) en todo el rango de aducción. Actúan los músculos estabilizadores escapulares y el deltoides anterior',detalles: '3 series de 12–15 repeticiones', videoUrl: 'https://www.youtube.com/embed/5oX3KUSiqy4' },
        { src: images.img_aperturas_pecfly, nombre: 'Aperturas Pec Fly', descripcion: 'Concentran la activación en las fibras internas del pectoral mayor (porción esternal medial), con mínima exigencia para los músculos estabilizadores.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/-9JbjkG5f0Q' },
        { src: images.img_pecho_fondos, nombre: 'Fondos', descripcion:  'Activan principalmente las fibras inferiores del pectoral mayor. También se involucran el tríceps braquial y el deltoides anterior.', detalles: '3 series de 6–10 repeticiones (con asistencia si es necesario)', videoUrl: 'https://www.youtube.com/embed/1fR3Ss8OFug'}
      ]
    },
    espalda: {
        titulo: "EJERCICIOS DE ESPALDA",
        ejercicios: ["Remo Parado (barra)", "Remo a 1 mano (Mancuerna)","Remo a 1 mano (Polea)","Remo Máquina", "Dominadas", "Jalón (Agarre Abierto)", "Jalón (Agarre Cerrado)", "Remo sentado (Polea, Abierto)", "Remo sentado (Polea, Cerrado)"],
        imagenes: [
          { src: images.img_e_remo_parado_barra, nombre: 'Remo Parado (barra)', descripcion: 'Este ejercicio fortalece la espalda alta y media al jalar la barra hacia el abdomen. Ayuda a mejorar la postura, ganar fuerza general y desarrollar volumen en la espalda superior.', detalles: '3 series de 10–12 repeticiones', videoUrl: 'https://www.youtube.com/embed/sr_U0jBE89A' },
          { src: images.img_e_remo_1_mano_mancuerna, nombre: 'Remo a 1 mano (Mancuerna)', descripcion: 'Este ejercicio logra mayor enfoque en un lado de la espalda, corrigiendo desequilibrios musculares y aumentando la conexión mente-músculo. (Concentrarse en el control, no en el peso)', detalles: '3 series de 10–12 repeticiones por brazo', videoUrl: 'https://youtube.com/embed/ZRSGpBUVcNw?si=MNx4gYwQnhlYXy7O' },
          { src: images.img_e_remo_1_mano_polea, nombre: 'Remo a 1 mano (Polea)', descripcion: 'Este ejercicio es excelente para mantener tensión constante durante todo el movimiento. Ideal para mejorar la definición y control muscular en la espalda alta.', detalles: '3 series de 12–15 repeticiones por brazo', videoUrl: 'https://www.youtube.com/embed/BfNyUa1io_M' },
          { src: images.img_e_remo_maquina, nombre: 'Remo Máquina', descripcion: 'Una opción segura y guiada para aprender el patrón de movimiento del remo. Reduce el riesgo de mala técnica.', detalles: '3 series de 12 repeticiones', videoUrl: 'https://www.youtube.com/embed/rPuck3iZjek' },
          { src: images.img_e_dominadas, nombre: 'Dominadas', descripcion: 'Un ejercicio completo de tracción que fortalece toda la espalda superior. Mejora la fuerza funcional y el control corporal.', detalles: '3 series al fallo o usar banda/elástico de asistencia', videoUrl: 'https://www.youtube.com/embed/MPbRERVWkbg' },
          { src: images.img_e_jalon_agarre_abierto, nombre: 'Jalón (Agarre Abierto)', descripcion: 'Este ejercicio imita la dominada pero en máquina, ayudando a ganar fuerza y masa en la espalda ancha. El agarre abierto enfatiza más la expansión del dorsal.', detalles: '3 series de 10–12 repeticiones', videoUrl: 'https://www.youtube.com/embed/RD4t94XvKsU' },
          { src: images.img_e_jalon_agarre_cerrado, nombre: 'Jalón (Agarre Cerrado)', descripcion: 'Este tipo de jalón permite mayor rango de movimiento y una contracción más fuerte en la parte media de la espalda. (Usar agarre neutro si hay molestias en hombros)', detalles: '3 series de 12 repeticiones', videoUrl: 'https://youtube.com/embed/Y2uznEZAmN0?si=kCWf1uDm6Tl_-ka1' },
          { src: images.img_e_remo_sentado_polea_abierto, nombre: 'Remo sentado (Polea, Abierto)', descripcion: 'El agarre abierto en polea ayuda a abrir la caja torácica y expandir la parte alta de la espalda. Mejora postura y definición muscular. (Evitar impulso con la espalda baja)', detalles: '3 series de 12 repeticiones', videoUrl: 'https://youtube.com/embed/Vm6E-2tq0bU?si=PpSpYM2rqOaeFSv3' },
          { src: images.img_e_remo_sentado_polea_cerrado, nombre: 'Remo sentado (Polea, Cerrado)', descripcion: 'Este remo trabaja de forma más directa la parte media de la espalda, con mayor rango de recorrido. Muy útil para crear una espalda fuerte y estable. (Mantener postura recta, jalar con los codos)', detalles: '3 series de 10–12 repeticiones', videoUrl: 'https://www.youtube.com/embed/D_UXjlrZIBw' }
        ]
      },
      hombros: {
        titulo: "EJERCICIOS DE HOMBROS",
        ejercicios: ["Press Militar (barra)", "Press Militar (mancuernas)", "Aperturas Laterales", "Elevaciones Frontales", "Elevaciones Posteriores", "Encogimientos de Hombros (Trapecios)"],
        imagenes: [
            { src: images.img_h_press_militar_barra, nombre: 'Press Militar (barra)', descripcion: 'Activa principalmente las fibras anteriores del deltoides (porción anterior). También participa el deltoides medio (porción lateral) y el tríceps braquial (cabeza larga y mediana).', detalles: '3 series de 8-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/895PvlhMpTQ' },
            { src: images.img_h_press_militar_mancuernas, nombre: 'Press Militar (mancuernas)', descripcion: 'Estimula el deltoides anterior (porción anterior del deltoides) con mayor activación del deltoides medio para estabilización. También interviene el tríceps braquial (cabeza mediana y lateral).', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://youtube.com/embed/BaONy7w34-U?si=Ekdg7RFqBcbefY--' },
            { src: images.img_h_aperturas_laterales, nombre: 'Aperturas Laterales', descripcion: 'Focaliza la activación en el deltoides medio (porción lateral del deltoides) durante la abducción del brazo', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/Vh_Kjw3O-DQ' },
            { src: images.img_h_elevaciones_frontales, nombre: 'Elevaciones Frontales', descripcion: 'Activa principalmente el deltoides anterior (porción clavicular / frontal del deltoides) en el movimiento de elevar el brazo hacia adelante.', detalles: '3 series de 12 repeticiones', videoUrl: 'https://www.youtube.com/embed/HciAFZSN2Qo' },
            { src: images.img_h_elevaciones_posteriores, nombre: 'Elevaciones Posteriores', descripcion: 'Estimulan la porción posterior del deltoides (deltoides posterior) durante la extensión / abducción horizontal inversa del brazo.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://youtube.com/embed/BDYAo6xAO9w?si=8ZPnWy0-xSm7vNu9' },
            { src: images.img_h_trapecios, nombre: 'Encogimientos de Hombros (Trapecios)', descripcion: 'Activa principalmente el trapecio superior (porción superior del trapecio). También se activa el elevador de la escápula como estabilizador.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/KMFhLLp5jnU' }
        ]
    },
    biceps: {
        titulo: "EJERCICIOS DE BICEPS",
        ejercicios: ["Curl Parado (Barra)", "Curl Banco Scott", "Curl Banco Inclinado","Curl Araña","Curl Concentrado a 1 brazo", "Curl Martillo"],
        imagenes: [
            { src: images.img_b_curl_parado_barra, nombre: 'Curl Parado (Barra)', descripcion: 'Activa principalmente el bíceps braquial (cabeza larga y corta) en el movimiento de flexión del codo. También participa el braquial anterior como músculo sinergista.', detalles: '3 series de 8-12 repeticiones', videoUrl: 'https://youtube.com/embed/QLduGgStKTA?si=22dQ72agxuZ0Z33o' },
            { src: images.img_b_curl_banco_scott, nombre: 'Curl Banco Scott', descripcion: 'Enfatiza la cabeza corta del bíceps braquial al limitar el balanceo del cuerpo, permitiendo un rango de movimiento controlado.', detalles: '3 series de 10-12 repeticiones  ', videoUrl: 'https://www.youtube.com/embed/YUhSi_sUGmM' },
            { src: images.img_b_curl_banco_inclinado, nombre: 'Curl Banco Inclinado', descripcion: 'Estira más el bíceps en su posición más extendida, activando fibras profundas del bíceps braquial (tanto cabeza larga como corta).', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://youtube.com/embed/OWaaLHA7pX0?si=yU82xzZiWYsQPEng' },
            { src: images.img_b_curl_arana, nombre: 'Curl Araña', descripcion: 'Sitúa al bíceps en ángulo para eliminar inercia; concentra activación sobre la cabeza larga del bíceps braquial.', detalles: '3 series de 10 repeticiones', videoUrl: 'https://www.youtube.com/embed/TkVxNAAhycM' },
            { src: images.img_b_curl_concentrado_1_brazo, nombre: 'Curl Concentrado a 1 brazo', descripcion: 'Permite un enfoque máximo en la contracción del bíceps braquial (cabeza corta principalmente), aislando el movimiento a un brazo a la vez.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/fP0JSmbdFNI' },
            { src: images.img_b_curl_martillo, nombre: 'Curl Martillo', descripcion: 'Activa principalmente la parte externa del antebrazo (braquiorradial) y el músculo profundo del brazo (braquial anterior), con menor implicación de ambas cabezas del bíceps (bíceps braquial: cabeza larga y corta).', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://youtube.com/embed/j99intoPKGE?si=tPj84J1l928lyuoD' }
        ]
    },
    triceps: {
        titulo: "EJERCICIOS DE TRICEPS",
        ejercicios: ["Press Frances", "Fondos para Tríceps", "Empujon Parado (Cable)", "Empujon Tras Nuca (Cable)","Empujon Tras Nuca (Mancuerna)","Patada de Tríceps", "Extensiones en Polea Alta Cruzada"],
        imagenes: [
            { src: images.img_t_press_frances, nombre: 'Press Frances', descripcion: 'Gran ejercicio compuesto para tríceps y pecho.', detalles: '4 series al fallo', videoUrl: 'https://www.youtube.com/embed/emnTk9VixDA' },
            { src: images.img_t_fondos, nombre: 'Fondos para Tríceps', descripcion: 'Perfecto para un bombeo final y dar forma al tríceps.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/cI6HMipOva4' },
            { src: images.img_t_empujon_parado_cable, nombre: 'Empujon Parado (Cable)', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/S1mPrwz8JWI' },
            { src: images.img_t_empujon_tras_nuca_cable, nombre: 'Empujon Tras Nuca (Cable)', descripcion: '', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/8GkV8XvGev4' },
            { src: images.img_t_empujon_tras_nuca_mancuernas, nombre: 'Empujon Tras Nuca (Mancuerna)', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/51u8_hHx5UI' },
            { src: images.img_t_patada, nombre: 'Patada de Tríceps', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/g95kR_X9kZM' },
            { src: images.img_t_extensiones_polea_alta_cruzada, nombre: 'Extensiones en Polea Alta Cruzada', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/TpxGMOLtfWk' }
        ]
    },
    abdominales: {
      titulo: "EJERCICIOS DE ABDOMINALES",
      ejercicios: ["Crunches", "Palo Press (Cable)", "Elevación de Piernas", "Caminata de Granjero", "Plancha Frontal"],
      imagenes: [
          { src: images.img_a_crunch, nombre: 'Crunches', descripcion: 'El ejercicio básico para la parte superior del abdomen.', detalles: '3 series al fallo', videoUrl: 'https://www.youtube.com/embed/U2Pxw_PLfXc' },
          { src: images.img_a_palo_press_cable, nombre: 'Palo Press (Cable)', descripcion: 'Fortalece todo el core, incluyendo abdomen, espalda baja y oblicuos.', detalles: '3 series, manteniendo la posición el mayor tiempo posible', videoUrl: 'https://www.youtube.com/embed/Jio_SzqlNUk' },
          { src: images.img_a_elevacion_piernas, nombre: 'Elevación de Piernas', descripcion: 'Excelente para enfocar el trabajo en la parte inferior del abdomen.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://www.youtube.com/embed/PfXQJ1-s9A8' },
          { src: images.img_a_caminata_cangrejo, nombre: 'Caminata de Granjero', descripcion: 'Excelente para enfocar el trabajo en la parte inferior del abdomen.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://youtube.com/embed/bnnlfhic4r0?si=uy1z3d1HK2RkUkoi' },
          { src: images.img_a_plancha_frontal, nombre: 'Plancha Frontal', descripcion: 'Excelente para enfocar el trabajo en la parte inferior del abdomen.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://www.youtube.com/embed/KC-DK0qydqw' },


      ]
  },
    piernas: {
        titulo: "EJERCICIOS DE PIERNAS",
        subgrupos: [
          {
            nombre: "Cuádriceps",
            ejercicios: [
              { src: images.img_c_sentadilla_libre, nombre: 'Sentadillas Libre', descripcion: 'Activa principalmente el cuádriceps junto con los glúteos y la zona estabilizadora del core.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/NHD0vH7XXgw' },
              { src: images.img_c_sentadilla_hack, nombre: 'Sentadilla Hack', descripcion: 'Enfoca la tensión sobre el cuádriceps (vastos) manteniendo el tronco más erguido, reduciendo la carga en la espalda baja.', detalles: '3 series de 10 repeticiones', videoUrl: 'https://www.youtube.com/embed/8Gk8snrY8u4' },
              { src: images.img_c_sentadilla_multipower, nombre: 'Sentadillas Multipower', descripcion: 'Trabaja el cuádriceps (vasto lateral/medial/intermedio) con trayectoria guiada, disminuyendo la necesidad de estabilización.', detalles: '3 series de 12 repeticiones', videoUrl: 'https://www.youtube.com/embed/me2mBRugU7c' },
              { src: images.img_c_sentadilla_squat_pendulo, nombre: 'Sentadilla Squat Péndulo', descripcion: 'Desplaza la carga de forma pendular, activando el cuádriceps (vastos) con énfasis en el recorrido vertical.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/6dzuSSQiY48' },
              { src: images.img_c_prensa_45_grados, nombre: 'Prensa 45 grados', descripcion: 'Pone gran tensión sobre el cuádriceps (vastos) con menor exigencia del core, especialmente en la fase de empuje.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/OT7gKslX6pA' },
              { src: images.img_c_extension, nombre: 'Extensiones de Cuádriceps', descripcion: 'Aíslan el cuádriceps (vasto intermedio, lateral, medial) en su función de extensión de rodilla, con mínima participación de otros músculos.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/FtXooCm3wdQ' },
              { src: images.img_c_bulgaras, nombre: 'Búlgaras para Cuádriceps', descripcion: 'Activa el cuádriceps (vastos) de la pierna delantera con estabilización adicional desde glúteos y core.', detalles: '3 series de 10 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/73Wnj4XvqDY' },
              { src: images.img_c_zancadas, nombre: 'Zancadas', descripcion: 'Estimula el cuádriceps (vastos) con contribución del glúteo y del stabilizador de cadera en cada paso.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/ArHjLGYmE5k' },
              { src: images.img_c_aductores, nombre: 'Aductores', descripcion: 'Este ejercicio no trabaja el cuádriceps principal, sino los músculos aductores del muslo para estabilizar la rodilla y la cadera.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/76uNT_VMhPI' },

            ]
          },
          {
            nombre: "Isquiotibiales o Femorales",
            ejercicios: [
              { src: images.img_f_peso_muerto_rumano, nombre: 'Peso Muerto Rumano', descripcion: 'Activa principalmente los músculos femorales (bíceps femoral, semitendinoso, semimembranoso) durante la extensión de cadera y control excéntrico. También involucra glúteos y erectores de la columna.', detalles: '3 series de 8-12 repeticiones', videoUrl: 'https://youtube.com/embed/0XL4cZR2Ink?si=O0sngq6ZZh1uhxWt' },
              { src: images.img_f_peso_muerto_b_stand, nombre: 'Peso Muerto B-Stand', descripcion: 'Apunta al femoral de la pierna de apoyo (bíceps femoral, semitendinoso) con estabilización adicional de glúteo e isquiotibiales del lado opuesto', detalles: '3 series de 8-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/_k7MmWlHMPo' },
              { src: images.img_f_curl_femoral_tumbado, nombre: 'Curl Femoral Tumbado', descripcion: 'Activa específicamente los músculos femorales (bíceps femoral, semitendinoso, semimembranoso) en flexión de rodilla en posición reclinada.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/ENDnSAkatcw' },
              { src: images.img_f_curl_femoral_hammer, nombre: 'Curl Femoral Hammer', descripcion: 'Enfoca tensión en las fibras del bíceps femoral, con mayor implicación del músculo semitendinoso, manteniendo estabilidad articular.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/K4moYGBfNmo' },
              { src: images.img_f_curl_femoral_sentado, nombre: 'Curl Femoral Sentado', descripcion: 'Activa los femorales (bíceps femoral, semitendinoso) con tensión constante desde la posición de rodilla flexionada, limitando el apoyo de la cadera.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/VFIONXq3LGw' },
              { src: images.img_f_curl_nordico, nombre: 'Curl Nórdico', descripcion: 'Estimula fuertemente los músculos femorales (bíceps femoral, semitendinoso) en un movimiento excéntrico donde se resiste la caída hacia adelante, con control.', detalles: '3 series de 6-10 repeticiones', videoUrl: 'https://www.youtube.com/embed/QZdcn8POwbw' },

            ]
          },
          {
            nombre: "Glúteos",
            ejercicios: [
              { src: images.img_g_hip_thrust, nombre: 'Hip Thrust', descripcion: 'Activa principalmente el glúteo mayor (porción superior y media).', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://youtube.com/embed/JbkOLo0b514?si=E-H6P_kjCQS80dzG' },
              { src: images.img_g_puentes, nombre: 'Puentes', descripcion: 'Enfoca la activación en el glúteo mayor (porción media) con menor involucramiento de la cadena posterior.', detalles: '3 series de 12 repeticiones', videoUrl: 'https://www.youtube.com/embed/UACIKae85Sk' },
              { src: images.img_g_bulgaras, nombre: 'Búlgaras para Glúteos', descripcion: 'Trabaja el glúteo mayor (principalmente en la pierna delantera) con apoyo del glúteo medio para estabilización.', detalles: '3 series de 10 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/OqHQuEBm-Ik' },
              { src: images.img_g_peso_muerto_sumo, nombre: 'Peso Muerto Sumo', descripcion: 'Activa el glúteo mayor (junto con aductores) al extender la cadera con piernas separadas.', detalles: '3 series de 8-10 repeticiones', videoUrl: 'https://www.youtube.com/embed/YE7rtn57tP4' },
              { src: images.img_g_sentadilla_sumo, nombre: 'Sentadilla Sumo', descripcion: 'Focaliza el estímulo en el glúteo mayor y los aductores durante la extensión de cadera + rodilla.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/PFh39yoRSes' },
              { src: images.img_g_patada_cable, nombre: 'Patadas con Cable', descripcion: 'Estimula el glúteo mayor (porción superior) de forma aislada al extender la cadera.', detalles: '3 series de 12-15 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/GvgL2NbOaKE' },
              { src: images.img_g_patada_maquina, nombre: 'Patadas en Máquina', descripcion: 'Trabaja el glúteo mayor (porción alta) con tensión guiada en extensión de cadera.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/sKyhNSbHqNQ' },
              { src: images.img_g_buenos_dias, nombre: 'Buenos Días', descripcion: 'Activa el glúteo mayor (junto con isquiotibiales) durante el movimiento de flexión de cadera hacia adelante y la extensión.', detalles: '3 series de 10 repeticiones por pierna', videoUrl: 'https://youtube.com/embed/u9700ghVPgE?si=qz1fOHzgDoy7U675' },
              { src: images.img_g_step_up, nombre: 'Step-ups', descripcion: 'Produce alta activación del glúteo mayor (fuerza unilateral) al elevar el cuerpo sobre una plataforma.', detalles: '3 series de 10 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/mw6iqu9K8DY' },
              { src: images.img_g_abductores, nombre: 'Abductores', descripcion: 'Activa principalmente el glúteo medio (parte lateral de la cadera) al separar la pierna hacia afuera.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/6ZU_WuhMoIM'},
              { src: images.img_g_hiperextension, nombre: 'Hiper extensión para Glúteos', descripcion: 'Estimula el glúteo mayor (junto con erectores espinales) cuando haces extensión de cadera desde el tronco.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/neoUfYkJVwM'},

            ]
          }
        ]
    }
  }), []);

  // Estado local para la rutina actual (si no hay usuario, usar estado local)
  // Si hay usuario, usar la rutina activa de Firebase
  const [localSchedule, setLocalSchedule] = useState({ days: {}, types: [] });
  const [localSelectedExercises, setLocalSelectedExercises] = useState({});
  const [localCustomDetails, setLocalCustomDetails] = useState({});

  // Determinar qué datos usar (Firebase o local)
  const schedule = currentUser && currentRoutine ? currentRoutine.schedule : localSchedule;
  const selectedExercises = currentUser && currentRoutine ? currentRoutine.selectedExercises : localSelectedExercises;
  const customDetails = currentUser && currentRoutine ? currentRoutine.customDetails : localCustomDetails;

  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isRoutineManagerOpen, setIsRoutineManagerOpen] = useState(false);

  // Limpiar estado local cuando el usuario cierra sesión
  useEffect(() => {
    if (!currentUser) {
      // Usuario cerró sesión - limpiar todo el estado local
      setLocalSchedule({ days: {}, types: [] });
      setLocalSelectedExercises({});
      setLocalCustomDetails({});
    }
  }, [currentUser]);

  // Cargar rutina activa cuando el usuario inicia sesión
  useEffect(() => {
    if (currentUser && routines.length > 0 && !currentRoutine) {
      const activeRoutine = routines.find(r => r.isActive);
      if (activeRoutine) {
        setCurrentRoutine(activeRoutine);
      } else {
        // Si no hay rutina activa, usar la primera
        setCurrentRoutine(routines[0]);
      }
    }
  }, [currentUser, routines, currentRoutine]);

  // Sincronizar cambios locales con Firebase (debounced)
  useEffect(() => {
    if (!currentUser || !currentRoutine) return;

    const timer = setTimeout(async () => {
      await updateRoutine(currentRoutine.id, {
        schedule: currentRoutine.schedule,
        selectedExercises: currentRoutine.selectedExercises,
        customDetails: currentRoutine.customDetails
      });
    }, 1000); // Esperar 1 segundo antes de guardar

    return () => clearTimeout(timer);
  }, [currentRoutine?.schedule, currentRoutine?.selectedExercises, currentRoutine?.customDetails]);

  const handleRoutineTypeChange = (type) => {
    if (currentUser && currentRoutine) {
      // Actualizar en Firebase
      const currentTypes = currentRoutine.schedule?.types || [];
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter(t => t !== type)
        : [...currentTypes, type];
      
      setCurrentRoutine(prev => ({
        ...prev,
        schedule: { ...prev.schedule, types: newTypes }
      }));
      
      updateRoutine(currentRoutine.id, {
        schedule: { ...currentRoutine.schedule, types: newTypes }
      });
    } else {
      // Usuario no logueado, usar estado local
      setLocalSchedule(prev => {
        const currentTypes = prev.types || [];
        const newTypes = currentTypes.includes(type)
          ? currentTypes.filter(t => t !== type)
          : [...currentTypes, type];
        return { ...prev, types: newTypes };
      });
    }
  };

  const handleSaveSchedule = async (newDaySchedule) => {
    if (currentUser && currentRoutine) {
      // Guardar en Firebase
      setCurrentRoutine(prev => ({
        ...prev,
        schedule: { ...prev.schedule, days: newDaySchedule }
      }));
      
      await updateRoutine(currentRoutine.id, {
        schedule: { ...currentRoutine.schedule, days: newDaySchedule }
      });
    } else {
      // Usuario no logueado, usar estado local
      setLocalSchedule(prev => ({
        ...prev,
        days: newDaySchedule
      }));
    }
    setIsPlannerOpen(false);
  };

  const handleExerciseSelection = async (group, exerciseName) => {
    if (currentUser && currentRoutine) {
      // Actualizar en Firebase
      const groupSelections = currentRoutine.selectedExercises[group] || [];
      const newGroupSelections = groupSelections.includes(exerciseName)
        ? groupSelections.filter(name => name !== exerciseName)
        : [...groupSelections, exerciseName];
      
      const newSelectedExercises = {
        ...currentRoutine.selectedExercises,
        [group]: newGroupSelections
      };

      setCurrentRoutine(prev => ({
        ...prev,
        selectedExercises: newSelectedExercises
      }));

      await updateRoutine(currentRoutine.id, {
        selectedExercises: newSelectedExercises
      });
    } else {
      // Usuario no logueado, usar estado local
      setLocalSelectedExercises(prev => {
        const groupSelections = prev[group] || [];
        const newGroupSelections = groupSelections.includes(exerciseName)
          ? groupSelections.filter(name => name !== exerciseName)
          : [...groupSelections, exerciseName];
        
        return {
          ...prev,
          [group]: newGroupSelections
        };
      });
    }
  };

  const handleDetailsChange = async (group, exerciseName, detail, value) => {
    if (currentUser && currentRoutine) {
      // Actualizar en Firebase
      const newCustomDetails = {
        ...currentRoutine.customDetails,
        [group]: {
          ...currentRoutine.customDetails[group],
          [exerciseName]: {
            ...currentRoutine.customDetails[group]?.[exerciseName],
            [detail]: value
          }
        }
      };

      setCurrentRoutine(prev => ({
        ...prev,
        customDetails: newCustomDetails
      }));

      await updateRoutine(currentRoutine.id, {
        customDetails: newCustomDetails
      });
    } else {
      // Usuario no logueado, usar estado local
      setLocalCustomDetails(prev => ({
        ...prev,
        [group]: {
          ...prev[group],
          [exerciseName]: {
            ...prev[group]?.[exerciseName],
            [detail]: value
          }
        }
      }));
    }
  };

  const handleClearGroupSelection = async (groupToClear) => {
    if (currentUser && currentRoutine) {
      // Limpiar en Firebase
      const newSelectedExercises = {
        ...currentRoutine.selectedExercises,
        [groupToClear]: []
      };

      setCurrentRoutine(prev => ({
        ...prev,
        selectedExercises: newSelectedExercises
      }));

      await updateRoutine(currentRoutine.id, {
        selectedExercises: newSelectedExercises
      });
    } else {
      // Usuario no logueado, usar estado local
      setLocalSelectedExercises(prev => ({
        ...prev,
        [groupToClear]: []
      }));
    }
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

  // Función para crear una nueva rutina
  const handleCreateRoutine = async (routineName = 'Nueva Rutina', routineData = null) => {
    if (!currentUser) {
      return;
    }

    const result = await createRoutine({
      name: routineName,
      schedule: routineData?.schedule || { days: {}, types: [] },
      selectedExercises: routineData?.selectedExercises || {},
      customDetails: routineData?.customDetails || {},
      isActive: true
    });

    if (!result.success) {
      console.error('Error al crear la rutina:', result.error);
    }
    
    return result;
  };

  // Función para guardar la rutina actual
  const handleSaveRoutine = async () => {
    if (!currentUser) {
      return;
    }

    if (!currentRoutine) {
      // Si no hay rutina activa, crear una nueva
      await handleCreateRoutine('Mi Rutina');
    } else {
      // Actualizar la rutina existente
      const result = await updateRoutine(currentRoutine.id, {
        schedule,
        selectedExercises,
        customDetails
      });

      if (!result.success) {
        console.error('Error al guardar la rutina:', result.error);
      }
    }
  };
// Las frases dinamicas para el efecto de máquina de escribir
  const toRotate = useMemo(() => ["", "CUERPO, MENTE Y HIERRO"], []);
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
        <Route path="/login" element={<Login />} />
        
        {/* Nueva ruta unificada para selección de ejercicios */}
        <Route 
          path="/seleccionar-ejercicios"
          element={<SelectExercises
            datosEjercicios={datosEjercicios}
            selectedExercises={selectedExercises}
            onSelectExercise={handleExerciseSelection}
            onClearGroup={handleClearGroupSelection}
            customDetails={customDetails}
            onDetailsChange={handleDetailsChange}
            currentUser={currentUser}
          />}
        />
        
        {/* Rutas individuales por grupo (mantener compatibilidad) */}
        <Route 
          path="/:grupo" 
          element={<DetalleEjercicio 
            datosEjercicios={datosEjercicios} // Pasar datos
            selectedExercises={selectedExercises} 
            onSelectExercise={handleExerciseSelection} 
            onClearGroup={handleClearGroupSelection}
            schedule={schedule} 
            routineTypes={schedule.types} // Pasar el array de tipos global
            onRoutineTypeChange={handleRoutineTypeChange} // Pasar el nuevo manejador
            onOpenPlanner={() => setIsPlannerOpen(true)}
            onShare={handleShare} // Pasar la función de compartir
            onSave={handleSaveRoutine} // Nueva: función para guardar
            onOpenRoutineManager={() => setIsRoutineManagerOpen(true)} // Nueva: abrir gestor de rutinas
            customDetails={customDetails}
            onDetailsChange={handleDetailsChange}
            currentUser={currentUser} // Pasar usuario actual
            currentRoutine={currentRoutine} // Pasar rutina actual
          />} 
        />
        <Route 
          path="/mi-plan"
          element={<MiPlan 
            schedule={schedule} 
            onOpenPlanner={() => setIsPlannerOpen(true)} 
            selectedExercises={selectedExercises}
            customDetails={customDetails}
            currentUser={currentUser}
            currentRoutine={currentRoutine}
            routines={routines}
            onSelectRoutine={setCurrentRoutine}
            onCreateRoutine={handleCreateRoutine}
            onDeleteRoutine={deleteRoutine}
            onUpdateRoutine={updateRoutine}
            setSchedule={async (newSchedule) => {
              const scheduleValue = typeof newSchedule === 'function' ? newSchedule(schedule) : newSchedule;
              if (currentUser && currentRoutine) {
                setCurrentRoutine(prev => ({ ...prev, schedule: scheduleValue }));
              } else {
                setLocalSchedule(scheduleValue);
              }
            }}
            setSelectedExercises={async (newExercises) => {
              const exercisesValue = typeof newExercises === 'function' ? newExercises(selectedExercises) : newExercises;
              if (currentUser && currentRoutine) {
                setCurrentRoutine(prev => ({ ...prev, selectedExercises: exercisesValue }));
              } else {
                setLocalSelectedExercises(exercisesValue);
              }
            }}
            setCustomDetails={async (newDetails) => {
              const detailsValue = typeof newDetails === 'function' ? newDetails(customDetails) : newDetails;
              if (currentUser && currentRoutine) {
                setCurrentRoutine(prev => ({ ...prev, customDetails: detailsValue }));
              } else {
                setLocalCustomDetails(detailsValue);
              }
            }}
          />}
        />
        <Route 
          path="/entrenamiento"
          element={<WorkoutMode 
            datosEjercicios={datosEjercicios}
            schedule={schedule}
            selectedExercises={selectedExercises}
            customDetails={customDetails}
          />}
        />
        <Route 
          path="/historial-entrenamiento"
          element={<WorkoutHistory />}
        />
      </Routes>
      <PlanificadorModal 
        isOpen={isPlannerOpen} 
        onClose={() => setIsPlannerOpen(false)} 
        schedule={schedule} 
        onSave={handleSaveSchedule} 
      />
      <RoutineManagerModal
        isOpen={isRoutineManagerOpen}
        onClose={() => setIsRoutineManagerOpen(false)}
        routines={routines}
        currentRoutine={currentRoutine}
        onSelectRoutine={setCurrentRoutine}
        onCreateRoutine={handleCreateRoutine}
        onDeleteRoutine={deleteRoutine}
        onUpdateRoutine={updateRoutine}
      />
      <ScrollToTopButton />
    </>
  );
}

export default App;