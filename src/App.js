import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { images } from './assets';
import DetalleEjercicio from './components/rutinas/DetalleEjercicio';
import ScrollToTop from './components/ScrollToTop';
import PlanificadorModal from './components/PlanificadorModal';
import pako from 'pako';

// Componente de la Página de Inicio (fuera de App para evitar re-renders)
const HomePage = ({ typewriterText, loopNum, toRotate }) => {
  const [showMore, setShowMore] = useState(false);

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
    <div className="hero-bg relative w-full h-screen flex items-center justify-center p-8">
      {/* Navegación */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-transparent">
           <div className="flex items-center space-x-3">
              <img src={images.logo_gym} alt="Logo de Energy" className="h-10 opacity-70 ml-2" />
              <h1 className="bebas-font text-3x2 md:text-4x2 text-white tracking-widest">ENERGY</h1>
          </div>
          <div className="hidden md:flex space-x-12 text-lg">
              <Link to="/" id='inicio' className="hover:text-[#2A7A87] transition-colors">INICIO</Link>
              <a href="#ejercicios" className="hover:text-[#2A7A87] transition-colors">EJERCICIOS</a>
              <a href="#about" className="hover:text-[#2A7A87] transition-colors">SOBRE NOSOTROS</a>

              <a href="#contacto" className="hover:text-[#2A7A87] transition-colors">CONTACTOS</a>
          </div>
          <a href="#ejercicios" className="bebas-font border-2 border-cyan-400 text-cyan-400 px-6 py-2 rounded-lg hover:bg-cyan-400 hover:text-gray-900 transition-colors">Empezar Entrenamiento</a>
      </nav>
      
      {/* Contenido principal del Hero */}
      <div className="relative z-10 text-center md:text-left md:w-1/2 p-4">
          <h2 className="bebas-font text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-4 tracking-wider">
              EL <span style={{ color: '#379AA5' }}>CAMBIO</span>
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
          <p className="text-xl md:text-2xl text-gray-200 mb-8 tracking-wide">
              MÁS RÁPIDO, MÁS FUERTE, LUCHA HASTA EL FINAL
          </p>
          <a href="#ejercicios" className="bg-[#379AA5] hover:bg-[#2A7A87] text-white px-8 py-3 rounded-md shadow-lg transition-colors">Ver rutinas</a>
      </div>
      
      {/* Imagen de la persona en el Hero */}
      <img src={images.hero} alt="Persona entrenando" className="absolute top-0 right-0 h-full w-full object-cover z-0 opacity-30 md:opacity-40 md:w-2/5" />
  </div>

  {/* Sección de Ejercicios (Menú Principal) */}
  <section id="ejercicios" className="py-20 px-4 md:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
          <h3 className="bebas-font text-5xl md:text-6xl text-center mb-12 tracking-wider">EJERCICIOS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainGrupos.map((grupo) => (
              <Link to={`/${grupo.slug}`} key={grupo.slug} className="relative image-grid-item group rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 h-80">
                <img src={grupo.img} alt={`Entrenamiento de ${grupo.nombre}`} className="w-full h-full object-cover filter grayscale" />
                <div className="image-overlay">
                  <span className="bebas-font text-3xl tracking-widest text-white">{grupo.nombre.toUpperCase()}</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {extraGrupos.map((grupo) => (
                  <Link to={`/${grupo.slug}`} key={grupo.slug} className="relative image-grid-item group rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 h-80">
                    <img src={grupo.img} alt={`Entrenamiento de ${grupo.nombre}`} className="w-full h-full object-cover filter grayscale" />
                    <div className="image-overlay">
                      <span className="bebas-font text-3xl tracking-widest text-white">{grupo.nombre.toUpperCase()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

      </div>
  </section>

  {/* Sección Sobre Nosotros */}
  <section id="about" className="py-20 px-4 md:px-8 bg-gray-950">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-xl overflow-hidden shadow-xl">
              <img src={images.lugar_energy} alt="Grupo de personas en el gimnasio" className="w-full h-auto object-cover" />
          </div>
          <div className="text-gray-200">
              <h3 className="bebas-font text-5xl md:text-6xl text-[#379AA5] mb-6 tracking-wider">Sobre Nosotros</h3>
              <p className="text-lg leading-relaxed mb-6">
                  Energy no es solo un gimnasio. Es una casa de transformación. Con más de 10 años forjando fierros y
                  formando personas, nos dedicamos a algo más que dar rutinas. Aquí no hay excusas, hay resultados, no
                  creemos en atajos, creemos en constancia, disciplina y sudor del bueno.
              </p>
          </div>
      </div>
  </section>

  {/* Pie de Página */}
  <footer id="contacto" className="footer-bg py-16 px-4 md:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto text-center">
          <h3 className="bebas-font text-5xl md:text-6xl text-white mb-8 tracking-wider">CONTACTOS</h3>
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-2 border-gray-800 pb-8">
              <div className="text-center md:text-left mb-8 md:mb-0">
                  <p className="text-lg mb-2">📞 981 326 184</p>
                  <p className="text-lg mb-2">📧 energyhuanuco@gmail.com</p>
                  <p className="text-lg">📍 Jr. Aguilar 771-Piso 2, Huánuco</p>
              </div>
             
              <div className="flex space-x-6 text-2xl">
                  <a href="https://www.tiktok.com/@energyhco" aria-label="Facebook"><img src={images.tik_tok} alt="Facebook" className="h-10 w-10  transition-colors" /></a>
                  <a href="#" aria-label="Instagram"><img src={images.facebook} alt="facebook" className="h-10 w-10 text-white hover:text-cyan-400 transition-colors" /></a>
                  <a href="#" aria-label="YouTube"><img src={images.instagram} alt="instagram" className="h-10 w-10 text-white hover:text-cyan-400 transition-colors" /></a>
                  
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
)};

// Lee el estado desde la URL o devuelve un estado por defecto
const getInitialState = () => {
  const defaultState = { 
    schedule: { days: {}, types: [] }, 
    selectedExercises: {} 
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
          selectedExercises: { ...defaultState.selectedExercises, ...parsedState.selectedExercises }
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

  const toRotate = useMemo(() => ["NO EMPIEZA EL LUNES", "EMPIEZA HOY"], []);
  const period = 2000;

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
          />} 
        />
      </Routes>
      <PlanificadorModal 
        isOpen={isPlannerOpen} 
        onClose={() => setIsPlannerOpen(false)} 
        schedule={schedule} 
        onSave={handleSaveSchedule} 
      />
    </>
  );
}

export default App;
