import { useState } from 'react';
import { Link } from 'react-router-dom';
import { images } from '../assets';
import { Spotlight } from './ui/Spotlight';
import { GridBackground } from './GridBackground';
import GrupoCard from './GrupoCard';

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
    <div className="hero-bg relative w-full h-screen flex items-center justify-center p-8 bg-black">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
      {/* Navegación */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-transparent">
           <div className="flex items-center space-x-3">
              <img src={images.logo_gym} alt="Logo de Energy" className="h-10 opacity-70 ml-2" />
              <h1 className="bebas-font text-3x2 md:text-4x2 text-white tracking-widest">ENERGY</h1>
          </div>
          <div className="hidden md:flex space-x-12 text-lg">
              <Link to="/" id='inicio' className="hover:text-[#2A7A87] transition-colors">INICIO</Link>
              <a href="#ejercicios" className="hover:text-[#2A7A87] transition-colors">EJERCICIOS</a>
              <a href="#about" className="hover:text-[#2A7A87] transition-colors">¿QUIÉNES SOMOS?</a>

              <a href="#contacto" className="hover:text-[#2A7A87] transition-colors">CONTACTOS</a>
          </div>
          <a href="#ejercicios" className="bebas-font border-2 border-[#379AA5] text-[#379AA5] px-6 py-2 rounded-lg hover:bg-[#379AA5] hover:text-gray-900 transition-colors">Empezar</a>
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
          <p className="text-xl md:text-2xl text-gray-200 mb-8 tracking-wide">
              MÁS RÁPIDO, MÁS FUERTE, LUCHA HASTA EL FINAL.
          </p>
          <a href="#ejercicios" className="bg-[#379AA5] hover:bg-[#2A7A87] text-white px-8 py-3 rounded-md shadow-lg transition-colors">Ver Ejercicios</a>
      </div>

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
              <GrupoCard key={grupo.slug} grupo={grupo} />
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
                    <GrupoCard key={grupo.slug} grupo={grupo} />
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

export default HomePage;