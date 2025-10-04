import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { images, videos } from '../../assets';
import SwipeableMenu from '../SwipeableMenu';
import ImageLoader from '../ImageLoader';

const ResumenSemanal = ({ schedule, daysOfWeek }) => {
  const scheduleByDay = useMemo(() => {
    const byDay = {};
    const scheduleDays = schedule.days || {}; // Acceder al objeto de días

    // Llenar el objeto byDay con los grupos musculares por día
    for (const group in scheduleDays) {
      if (scheduleDays[group] && Array.isArray(scheduleDays[group])) {
        scheduleDays[group].forEach(day => {
          if (!byDay[day]) {
            byDay[day] = [];
          }
          // Capitalizar el nombre del grupo antes de añadirlo
          byDay[day].push(group.charAt(0).toUpperCase() + group.slice(1));
        });
      }
    }
    return byDay;
  }, [schedule]); // La dependencia en `schedule` es correcta

  return (
    // Resumen semanal
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg mb-1">
      <ul className="space-y-4">
        {daysOfWeek.map(day => {
          const groupsForDay = scheduleByDay[day];
          // Si no hay grupos para el día, mostrar "Descanso"
          return (
            <li key={day} className="flex flex-col sm:flex-row sm:items-center text-lg p-2 rounded-md transition-colors hover:bg-gray-700">
              <span className="w-full sm:w-32 font-semibold text-[#379AA5] mb-2 sm:mb-0 flex-shrink-0">{day}:</span>
              <div className="flex flex-wrap gap-2">
                {groupsForDay && groupsForDay.length > 0 ? (
                  groupsForDay.map(group => (
                    <span key={group} className="bg-gray-700 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md">
                      {group}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Descanso</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const DetalleEjercicio = ({ selectedExercises, onSelectExercise, onClearGroup, schedule, routineTypes, onRoutineTypeChange, onOpenPlanner, onShare }) => {
  let { grupo } = useParams();
  const [openIndex, setOpenIndex] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPlanAccordionOpen, setIsPlanAccordionOpen] = useState(false);
  const [isPersonalizeAccordionOpen, setIsPersonalizeAccordionOpen] = useState(true);

  // Logic to get today's workout
  const daysMap = useMemo(() => ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], []);
  const todayName = daysMap[new Date().getDay()];

  const todaysGroups = useMemo(() => {
    const groups = [];
    const scheduleDays = schedule.days || {};
    for (const group in scheduleDays) {
      if (scheduleDays[group] && scheduleDays[group].includes(todayName)) {
        groups.push(group.charAt(0).toUpperCase() + group.slice(1));
      }
    }
    return groups;
  }, [schedule, todayName]);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const nombreGrupo = grupo ? grupo.charAt(0).toUpperCase() + grupo.slice(1) : 'Grupo no especificado';

  const datosEjercicios = useMemo(() => ({
    pecho: {
      titulo: "RUTINA DE PECHO",
      ejercicios: ["Press Banca (barra)", "Press Inclinado (barra)", "Press Banca (Mancuernas)","Press Inclinado (Mancuernas)","Press Máquina", "Aperturas (Mancuernas)","Aperturas (Cable)", "Aperturas Pec Fly","Fondos"],
      imagenes: [
        { src: images.img_press_banca_barra, nombre: 'Press Banca (barra)', descripcion: 'Activa principalmente las fibras centrales del pectoral mayor (porción esternocostal). También involucra el deltoides anterior y la cabeza larga del tríceps braquial.', detalles: '3 series de 8–12 repeticiones', videoUrl: 'https://www.youtube.com/embed/HzkHpIIo4IA' },
        { src: images.img_press_inclinado_barra, nombre: 'Press Inclinado (barra)', descripcion: 'Enfoca el estímulo en la parte superior del pectoral mayor (porción clavicular). Secundariamente activa el deltoides anterior y el tríceps braquial.', detalles: '3 series de 8–12 repeticiones', videoUrl: 'https://www.youtube.com/embed/HImp2-LuihU' },
        { src: images.img_press_banca_mancuernas, nombre: 'Press Banca (Mancuernas)', descripcion: 'Estimula las fibras centrales del pectoral mayor (porción esternocostal), con mayor implicación de los músculos estabilizadores escapulares. También participa el deltoides anterior y el tríceps braquial.', detalles: '3 series de 10–12 repeticiones', videoUrl:"https://www.youtube.com/embed/48L0oQApm_0" },
        { src: images.img_press_inclinado_mancuernas, nombre: 'Press Inclinado (Mancuernas)', descripcion: 'Activa predominantemente la parte superior del pectoral mayor (porción clavicular). Como sinergistas intervienen el deltoides anterior y el tríceps braquial.', detalles: '3 series de 10 repeticiones', videoUrl: videos.vid_press_inclinado_mancuernas },
        { src: images.img_press_maquina, nombre: 'Press Máquina', descripcion: 'Focaliza la tensión sobre las fibras medias del pectoral mayor (porción esternocostal), reduciendo la participación de estabilizadores. Secundariamente se activa el deltoides anterior y el tríceps braquial.', detalles: '3 series de 12–15 repeticiones', videoUrl: 'https://www.youtube.com/embed/JXJmPXlqwh0' },
        { src: images.img_aperturas_mancuernas, nombre: 'Aperturas (Mancuernas)', descripcion: 'Aíslan las fibras externas del pectoral mayor (porción lateral y esternal) durante la aducción horizontal del brazo. Participa también el deltoides anterior como sinergista leve.',detalles: '3 series de 12 repeticiones', videoUrl: 'https://www.youtube.com/embed/C7Nq4DgV9Mg' },
        { src: images.img_aperturas_cable, nombre: 'Aperturas (Cable)', descripcion: 'Mantienen tensión continua sobre las fibras laterales del pectoral mayor (porción esternocostal y clavicular) en todo el rango de aducción. Actúan los músculos estabilizadores escapulares y el deltoides anterior',detalles: '3 series de 12–15 repeticiones', videoUrl: 'https://www.youtube.com/embed/5oX3KUSiqy4' },
        { src: images.img_aperturas_pecfly, nombre: 'Aperturas Pec Fly', descripcion: 'Concentran la activación en las fibras internas del pectoral mayor (porción esternal medial), con mínima exigencia para los músculos estabilizadores.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/-9JbjkG5f0Q' },
        { src: images.img_pecho_fondos, nombre: 'Fondos', descripcion:  'Activan principalmente las fibras inferiores del pectoral mayor. También se involucran el tríceps braquial y el deltoides anterior.', detalles: '3 series de 6–10 repeticiones (con asistencia si es necesario)', videoUrl: 'https://www.youtube.com/embed/1fR3Ss8OFug'}
      ]
    },
    espalda: {
        titulo: "RUTINA DE ESPALDA",
        ejercicios: ["Remo Parado (Barra)", "Remo a 1 mano (Mancuerna)","Remo a 1 mano (Polea)","Remo Máquina", "Dominadas", "Jalón (Agarre Abierto)", "Jalón (Agarre Cerrado)", "Remo sentado (Polea, Abierto)", "Remo sentado (Polea, Cerrado)"],
        imagenes: [
          { src: images.img_e_remo_parado_barra, nombre: 'Remo Parado (barra)', descripcion: 'Este ejercicio fortalece la espalda alta y media al jalar la barra hacia el abdomen. Ayuda a mejorar la postura, ganar fuerza general y desarrollar volumen en la espalda superior.', detalles: '3 series de 10–12 repeticiones', videoUrl: 'https://youtube.com/embed/FWJR5Ve8bnQ?si=HITcjbHoFZR1T-td' },
          { src: images.img_e_remo_1_mano_mancuerna, nombre: 'Remo a 1 mano (Mancuerna)', descripcion: 'Este ejercicio logra mayor enfoque en un lado de la espalda, corrigiendo desequilibrios musculares y aumentando la conexión mente-músculo. (Concentrarse en el control, no en el peso)', detalles: '3 series de 10–12 repeticiones por brazo', videoUrl: 'https://youtube.com/embed/ZRSGpBUVcNw?si=MNx4gYwQnhlYXy7O' },
          { src: images.img_e_remo_1_mano_polea, nombre: 'Remo a 1 mano (Polea)', descripcion: 'Este ejercicio es excelente para mantener tensión constante durante todo el movimiento. Ideal para mejorar la definición y control muscular en la espalda alta.', detalles: '3 series de 12–15 repeticiones por brazo', videoUrl: 'https://youtube.com/embed/1jN6qeXdvWA?si=wGf0T3EvQCn9zjrz' },
          { src: images.img_e_remo_maquina, nombre: 'Remo Máquina', descripcion: 'Una opción segura y guiada para aprender el patrón de movimiento del remo. Reduce el riesgo de mala técnica.', detalles: '3 series de 12 repeticiones', videoUrl: 'https://www.youtube.com/embed/rPuck3iZjek' },
          { src: images.img_e_dominadas, nombre: 'Dominadas', descripcion: 'Un ejercicio completo de tracción que fortalece toda la espalda superior. Mejora la fuerza funcional y el control corporal.', detalles: '3 series al fallo o usar banda/elástico de asistencia', videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g' },
          { src: images.img_e_jalon_agarre_abierto, nombre: 'Jalón (Agarre Abierto)', descripcion: 'Este ejercicio imita la dominada pero en máquina, ayudando a ganar fuerza y masa en la espalda ancha. El agarre abierto enfatiza más la expansión del dorsal.', detalles: '3 series de 10–12 repeticiones', videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc' },
          { src: images.img_e_jalon_agarre_cerrado, nombre: 'Jalón (Agarre Cerrado)', descripcion: 'Este tipo de jalón permite mayor rango de movimiento y una contracción más fuerte en la parte media de la espalda. (Usar agarre neutro si hay molestias en hombros)', detalles: '3 series de 12 repeticiones', videoUrl: 'https://youtube.com/embed/Y2uznEZAmN0?si=kCWf1uDm6Tl_-ka1' },
          { src: images.img_e_remo_sentado_polea_abierto, nombre: 'Remo sentado (Polea, Abierto)', descripcion: 'El agarre abierto en polea ayuda a abrir la caja torácica y expandir la parte alta de la espalda. Mejora postura y definición muscular. (Evitar impulso con la espalda baja)', detalles: '3 series de 12 repeticiones', videoUrl: 'https://youtube.com/embed/Vm6E-2tq0bU?si=PpSpYM2rqOaeFSv3' },
          { src: images.img_e_remo_sentado_polea_cerrado, nombre: 'Remo sentado (Polea, Cerrado)', descripcion: 'Este remo trabaja de forma más directa la parte media de la espalda, con mayor rango de recorrido. Muy útil para crear una espalda fuerte y estable. (Mantener postura recta, jalar con los codos)', detalles: '3 series de 10–12 repeticiones', videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74' }
        ]
      },
      hombros: {
        titulo: "RUTINA DE HOMBROS",
        ejercicios: ["Press Militar (barra)", "Press Militar (mancuernas)", "Aperturas Laterales", "Elevaciones Frontales", "Elevaciones Posteriores", "Encogimientos de Hombros (Trapecios)"],
        imagenes: [
            { src: images.img_h_press_militar_barra, nombre: 'Press Militar (barra)', descripcion: 'Activa principalmente las fibras anteriores del deltoides (porción anterior). También participa el deltoides medio (porción lateral) y el tríceps braquial (cabeza larga y mediana).', detalles: '3 series de 8-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI' },
            { src: images.img_h_press_militar_mancuernas, nombre: 'Press Militar (mancuernas)', descripcion: 'Estimula el deltoides anterior (porción anterior del deltoides) con mayor activación del deltoides medio para estabilización. También interviene el tríceps braquial (cabeza mediana y lateral).', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://youtube.com/embed/BaONy7w34-U?si=Ekdg7RFqBcbefY--' },
            { src: images.img_h_aperturas_laterales, nombre: 'Aperturas Laterales', descripcion: 'Focaliza la activación en el deltoides medio (porción lateral del deltoides) durante la abducción del brazo', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/zBqZqAjCnR4' },
            { src: images.img_h_elevaciones_frontales, nombre: 'Elevaciones Frontales', descripcion: 'Activa principalmente el deltoides anterior (porción clavicular / frontal del deltoides) en el movimiento de elevar el brazo hacia adelante.', detalles: '3 series de 12 repeticiones', videoUrl: 'https://www.youtube.com/embed/-t7fuZ0KhDA' },
            { src: images.img_h_elevaciones_posteriores, nombre: 'Elevaciones Posteriores', descripcion: 'Estimulan la porción posterior del deltoides (deltoides posterior) durante la extensión / abducción horizontal inversa del brazo.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://youtube.com/embed/BDYAo6xAO9w?si=8ZPnWy0-xSm7vNu9' },
            { src: images.img_h_trapecios, nombre: 'Encogimientos de Hombros (Trapecios)', descripcion: 'Activa principalmente el trapecio superior (porción superior del trapecio). También se activa el elevador de la escápula como estabilizador.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/jdPzNNfj_kg' }
        ]
    },
    biceps: {
        titulo: "RUTINA DE BICEPS",
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
        titulo: "RUTINA DE TRICEPS",
        ejercicios: ["Press Frances", "Fondos para Tríceps", "Empujon Parado (Cable)", "Empujon Tras Nuca (Cable)","Empujon Tras Nuca (Mancuerna)","Patada de Tríceps(Cable o Mancuernas)", "Extensiones en Polea Alta Cruzada"],
        imagenes: [
            { src: images.img_t_press_frances, nombre: 'Press Frances', descripcion: 'Gran ejercicio compuesto para tríceps y pecho.', detalles: '4 series al fallo', videoUrl: 'https://www.youtube.com/embed/emnTk9VixDA' },
            { src: images.img_t_fondos, nombre: 'Fondos para Tríceps', descripcion: 'Perfecto para un bombeo final y dar forma al tríceps.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/cI6HMipOva4' },
            { src: images.img_t_empujon_parado_cable, nombre: 'Empujon Parado (Cable)', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/S1mPrwz8JWI' },
            { src: images.img_t_empujon_tras_nuca_cable, nombre: 'Empujon Tras Nuca (Cable)', descripcion: '', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/8GkV8XvGev4' },
            { src: images.img_t_empujon_tras_nuca_mancuernas, nombre: 'Empujon Tras Nuca (Mancuerna)', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/51u8_hHx5UI' },
            { src: images.img_t_patada, nombre: 'Patada de Tríceps', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/g95kR_X9kZM' },
            { src: images.img_t_extensiones_polea_alta_cruzada, nombre: 'Extensiones en Polea Alta Cruzada', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/GvGlCLBdkaQ' }
        ]
    },
    abdominales: {
      titulo: "RUTINA DE ABDOMINALES",
      ejercicios: ["Crunches", "Palo Press (Cable)", "Elevación de Piernas", "Caminata de Granjero", "Plancha Frontal"],
      imagenes: [
          { src: images.img_a_crunch, nombre: 'Crunches', descripcion: 'El ejercicio básico para la parte superior del abdomen.', detalles: '3 series al fallo', videoUrl: 'https://www.youtube.com/embed/Xyd_fa5zoEU' },
          { src: images.img_a_palo_press_cable, nombre: 'Palo Press(Cable)', descripcion: 'Fortalece todo el core, incluyendo abdomen, espalda baja y oblicuos.', detalles: '3 series, manteniendo la posición el mayor tiempo posible', videoUrl: 'https://www.youtube.com/embed/ASdvN_XMM_g' },
          { src: images.img_a_elevacion_piernas, nombre: 'Elevación de Piernas', descripcion: 'Excelente para enfocar el trabajo en la parte inferior del abdomen.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://www.youtube.com/embed/l4kQd9eWJmk' },
          { src: images.img_a_caminata_cangrejo, nombre: 'Caminata de Granjero', descripcion: 'Excelente para enfocar el trabajo en la parte inferior del abdomen.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://www.youtube.com/embed/l4kQd9eWJmk' },
          { src: images.img_a_plancha_frontal, nombre: 'Planchas Frontal', descripcion: 'Excelente para enfocar el trabajo en la parte inferior del abdomen.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://www.youtube.com/embed/l4kQd9eWJmk' },


      ]
  },
    piernas: {
        titulo: "RUTINA DE PIERNAS",
        subgrupos: [
          {
            nombre: "Cuádriceps",
            ejercicios: [
              { src: images.img_c_sentadilla_libre, nombre: 'Sentadillas Libre', descripcion: 'Activa principalmente el cuádriceps junto con los glúteos y la zona estabilizadora del core.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://youtube.com/embed/dsCuiccYNGs?si=NdKTQealxD9SXaiZ' },
              { src: images.img_c_sentadilla_hack, nombre: 'Sentadilla Hack', descripcion: 'Enfoca la tensión sobre el cuádriceps (vastos) manteniendo el tronco más erguido, reduciendo la carga en la espalda baja.', detalles: '3 series de 10 repeticiones', videoUrl: 'https://youtube.com/embed/0tn5K9NlCfo?si=FDZf6MEr9Dd9DN5v' },
              { src: images.img_c_sentadilla_multipower, nombre: 'Sentadillas Multipower', descripcion: 'Trabaja el cuádriceps (vasto lateral/medial/intermedio) con trayectoria guiada, disminuyendo la necesidad de estabilización.', detalles: '3 series de 12 repeticiones', videoUrl: 'https://youtube.com/embed/4r9o_rqFZX4?si=aEcs2AsJPuQlBQ9Z' },
              { src: images.img_c_sentadilla_squat_pendulo, nombre: 'Sentadilla Squat Péndulo', descripcion: 'Desplaza la carga de forma pendular, activando el cuádriceps (vastos) con énfasis en el recorrido vertical.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/6dzuSSQiY48' },
              { src: images.img_c_prensa_45_grados, nombre: 'Prensa 45 grados', descripcion: 'Pone gran tensión sobre el cuádriceps (vastos) con menor exigencia del core, especialmente en la fase de empuje.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/OT7gKslX6pA' },
              { src: images.img_c_extension, nombre: 'Extensiones de Cuádriceps', descripcion: 'Aíslan el cuádriceps (vasto intermedio, lateral, medial) en su función de extensión de rodilla, con mínima participación de otros músculos.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/B9kGULV8jrc' },
              { src: images.img_c_bulgaras, nombre: 'Búlgaras para Cuádriceps', descripcion: 'Activa el cuádriceps (vastos) de la pierna delantera con estabilización adicional desde glúteos y core.', detalles: '3 series de 10 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/73Wnj4XvqDY' },
              { src: images.img_c_zancadas, nombre: 'Zancadas', descripcion: 'Estimula el cuádriceps (vastos) con contribución del glúteo y del stabilizador de cadera en cada paso.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/ArHjLGYmE5k' },
              { src: images.img_c_aductores, nombre: 'Aductores', descripcion: 'Este ejercicio no trabaja el cuádriceps principal, sino los músculos aductores del muslo para estabilizar la rodilla y la cadera.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/76uNT_VMhPI' },

            ]
          },
          {
            nombre: "Isquiotibiales o Femorales",
            ejercicios: [
              { src: images.img_f_peso_muerto_rumano, nombre: 'Peso Muerto Rumano', descripcion: 'Activa principalmente los músculos femorales (bíceps femoral, semitendinoso, semimembranoso) durante la extensión de cadera y control excéntrico. También involucra glúteos y erectores de la columna.', detalles: '3 series de 8-12 repeticiones', videoUrl: 'https://youtube.com/embed/0XL4cZR2Ink?si=O0sngq6ZZh1uhxWt' },
              { src: images.img_f_peso_muerto_b_stand, nombre: 'Peso Muerto B-Stand', descripcion: 'Apunta al femoral de la pierna de apoyo (bíceps femoral, semitendinoso) con estabilización adicional de glúteo e isquiotibiales del lado opuesto', detalles: '3 series de 8-12 repeticiones', videoUrl: 'https://youtube.com/embed/Px9rVZjwXsk?si=gTtuHo3m8X63oHsH' },
              { src: images.img_f_curl_femoral_tumbado, nombre: 'Curl Femoral Tumbado', descripcion: 'Activa específicamente los músculos femorales (bíceps femoral, semitendinoso, semimembranoso) en flexión de rodilla en posición reclinada.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/f9OnW-UkkFk' },
              { src: images.img_f_curl_femoral_hammer, nombre: 'Curl Femoral Hammer', descripcion: 'Enfoca tensión en las fibras del bíceps femoral, con mayor implicación del músculo semitendinoso, manteniendo estabilidad articular.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/A4PRr8CFiaw' },
              { src: images.img_f_curl_femoral_sentado, nombre: 'Curl Femoral Sentado', descripcion: 'Activa los femorales (bíceps femoral, semitendinoso) con tensión constante desde la posición de rodilla flexionada, limitando el apoyo de la cadera.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/VFIONXq3LGw' },
              { src: images.img_f_curl_nordico, nombre: 'Curl Nórdico', descripcion: 'Estimula fuertemente los músculos femorales (bíceps femoral, semitendinoso) en un movimiento excéntrico donde se resiste la caída hacia adelante, con control.', detalles: '3 series de 6-10 repeticiones', videoUrl: 'https://www.youtube.com/embed/7NYAaiWRkcE?si=yOy4l6TfjQF6HeY8' },

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
              { src: images.img_g_patada_cable, nombre: 'Patadas con Cable', descripcion: 'Estimula el glúteo mayor (porción superior) de forma aislada al extender la cadera.', detalles: '3 series de 12-15 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/B9Fqo0KqeWc' },
              { src: images.img_g_patada_maquina, nombre: 'Patadas en Máquina', descripcion: 'Trabaja el glúteo mayor (porción alta) con tensión guiada en extensión de cadera.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/sKyhNSbHqNQ' },
              { src: images.img_g_buenos_dias, nombre: 'Buenos Días', descripcion: 'Activa el glúteo mayor (junto con isquiotibiales) durante el movimiento de flexión de cadera hacia adelante y la extensión.', detalles: '3 series de 10 repeticiones por pierna', videoUrl: 'https://youtube.com/embed/u9700ghVPgE?si=qz1fOHzgDoy7U675' },
              { src: images.img_g_step_up, nombre: 'Step-ups', descripcion: 'Produce alta activación del glúteo mayor (fuerza unilateral) al elevar el cuerpo sobre una plataforma.', detalles: '3 series de 10 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/mw6iqu9K8DY' },
              { src: images.img_g_abductores, nombre: 'Abductores', descripcion: 'Activa principalmente el glúteo medio (parte lateral de la cadera) al separar la pierna hacia afuera.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/cQv9I1-pVBQ'},
              { src: images.img_g_hiperextension, nombre: 'Hiper extensión para Glúteos', descripcion: 'Estimula el glúteo mayor (junto con erectores espinales) cuando haces extensión de cadera desde el tronco.', detalles: '3 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/cffBuDsjxU8'},

            ]
          }
        ]
    }
  }), []);

  const rutinaActual = useMemo(() => {
    const data = datosEjercicios[grupo] || { titulo: "RUTINA DESCONOCIDA", ejercicios: [], imagenes: [] };
    // Si es la rutina de piernas con subgrupos, aplanamos los nombres de los ejercicios para la lógica de selección.
    if (grupo === 'piernas' && data.subgrupos) {
      return {
        ...data,
        ejercicios: data.subgrupos.flatMap(sg => sg.ejercicios.map(e => e.nombre))
      };
    }
    return data;
  }, [datosEjercicios, grupo]);

  const currentSelections = selectedExercises[grupo] || [];

  const filteredGallery = useMemo(() => {
    const hasSelection = currentSelections.length > 0;
    if (grupo === 'piernas' && rutinaActual.subgrupos) {
      if (!hasSelection) return rutinaActual.subgrupos; // Devuelve todos los subgrupos si no hay selección
      // Filtra los ejercicios dentro de cada subgrupo y mantiene la estructura
      return rutinaActual.subgrupos.map(subgrupo => ({
        ...subgrupo,
        ejercicios: subgrupo.ejercicios.filter(ejercicio => currentSelections.includes(ejercicio.nombre))
      })).filter(subgrupo => subgrupo.ejercicios.length > 0); // Elimina subgrupos que quedaron vacíos
    }

    // Lógica original para los demás grupos musculares
    return hasSelection
      ? rutinaActual.imagenes.filter(imagen => currentSelections.includes(imagen.nombre))
      : rutinaActual.imagenes;
  }, [currentSelections, grupo, rutinaActual]);

  const menuItems = ['pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'piernas', 'abdominales'];
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const routineTypeOptions = ['Full Body', 'Torso-Pierna', 'Empuje-Tracción-Pierna'];

  return (
    // Botón para abrir el menú de rutinas
    <>
      <button 
        onClick={() => setIsDrawerOpen(prev => !prev)}
        className="fixed top-5 right-5 z-30 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Abrir menú de rutinas"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>

      {/* Menú deslizable */}
      <SwipeableMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <h3 className="bebas-font text-3xl text-[#379AA5] tracking-widest mb-4">RUTINAS</h3>
        <ul className="flex flex-col space-y-8">
          {menuItems.map(item => (
            <li key={item}>
              <Link 
                to={`/${item}`}
                onClick={() => setIsDrawerOpen(false)} 
                className={`text-lg p-2 rounded-md transition-colors ${grupo === item ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón de Compartir */}
        <div className="border-t border-gray-700 mt-4 pt-4">
          <button 
            onClick={onShare}
            className="w-full flex items-center justify-center text-lg p-2 rounded-md text-[#379AA5] hover:bg-gray-700 hover:text-cyan-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.367a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg>
            Compartir Plan
          </button>
        </div>
      </SwipeableMenu>

      <div className="bg-gray-900 text-white min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="bebas-font text-2xl text-[#379AA5] hover:text-cyan-300 transition-colors tracking-widest">&larr; VOLVER AL INICIO</Link>
          <h1 className="bebas-font text-5xl md:text-7xl text-center my-8 tracking-wider">
            <span className="text-[#379AA5]">{rutinaActual.titulo}</span>
          </h1>

          <div 
            className="bg-gray-800 rounded-lg shadow-lg mb-10 transition-all duration-300"
          >
            <div 
              className="flex justify-between items-center p-4 sm:p-6 cursor-pointer"
              onClick={() => setIsPlanAccordionOpen(!isPlanAccordionOpen)}
            >
              {/* Vista Colapsada */}
              <div className="flex-grow">
                <h2 className="bebas-font text-3xl text-white">Mi Rutina Semanal:</h2>
                <p className="text-gray-400 mt-1">Aquí puedes ver un resumen de tu planificación semanal.</p>
                {!isPlanAccordionOpen && (
                  <div className="mt-2 flex items-center">
                    <span className="font-semibold text-green-500 mr-2">Hoy ({todayName}):</span>
                    <div className="flex flex-wrap gap-2">
                      {todaysGroups.length > 0 ? (
                        todaysGroups.map(group => (
                          <span key={group} className="bg-gray-700 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md">
                            {group}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">Descanso</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Icono de Flecha */}
              <svg className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isPlanAccordionOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            {/* Contenido Expandible */}
            {isPlanAccordionOpen && (
              <div className="px-4 sm:px-6 pb-6" onClick={(e) => e.stopPropagation()}>
                {/* Resumen Semanal */}
                <div className="mb-6">
                  <ResumenSemanal schedule={schedule} daysOfWeek={daysOfWeek} />
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                  {/* Herramientas */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="bebas-font text-2xl sm:text-3xl text-white"></h2>
                    <button 
                      onClick={onOpenPlanner}
                      className="bebas-font text-base sm:text-lg tracking-wider px-4 sm:px-6 py-2 rounded-lg text-white bg-[#379AA5] hover:bg-[#2A7A87] transition-colors shadow-lg"
                    >
                      Planificar Semana
                    </button>
                  </div>
                  
                  {/* Tipo de Rutina */}
                  <div>
                    <h3 className="bebas-font text-xl sm:text-2xl text-white mb-4">Tipo de Rutina</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-4">
                        {routineTypeOptions.map(type => {
                            const isChecked = routineTypes.includes(type);
                            return (
                                <div key={type} onClick={() => onRoutineTypeChange(type)} className="cursor-pointer flex items-center">
                                    <div className={`w-6 h-6 flex justify-center items-center border-2 ${isChecked ? 'border-cyan-500 bg-cyan-500' : 'border-gray-500'} rounded-md mr-2 transition-all`}>
                                        {isChecked && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                    </div>
                                    <span className={`text-lg ${isChecked ? 'text-white' : 'text-gray-300'}`}>{type}</span>
                                </div>
                            );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-12">
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => setIsPersonalizeAccordionOpen(!isPersonalizeAccordionOpen)}
            >
              <div>
                <h2 className="bebas-font text-3xl text-white">Selecciona los ejercicios:</h2>
                <p className="text-gray-400 mt-1">Selecciona o deselecciona los ejercicios que desees para poder verlos en la galería de ejercicios de abajo.</p>
              </div>
              <svg className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isPersonalizeAccordionOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isPersonalizeAccordionOpen ? 'max-h-full mt-4' : 'max-h-0'}`}>
              <ul className="space-y-3">
                {grupo === 'piernas' && rutinaActual.subgrupos ? (
                  rutinaActual.subgrupos.map(subgrupo => (
                    <React.Fragment key={subgrupo.nombre}>
                      <h3 className="bebas-font text-2xl text-[#379AA5] pt-4 pb-2 tracking-wider">{subgrupo.nombre}</h3>
                      {subgrupo.ejercicios.map((ejercicio, index) => {
                        const isChecked = currentSelections.includes(ejercicio.nombre);
                        return (
                          <li key={index} onClick={() => onSelectExercise(grupo, ejercicio.nombre)} className="cursor-pointer flex items-center p-3 rounded-lg transition-colors hover:bg-gray-700">
                            <div className={`w-6 h-6 flex justify-center items-center border-2 ${isChecked ? 'border-cyan-500 bg-cyan-500' : 'border-gray-500'} rounded-md mr-4 transition-all`}>
                                {isChecked && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                            </div>
                            <span className={`text-lg ${isChecked ? 'text-white' : 'text-gray-300'}`}>{ejercicio.nombre}</span>
                          </li>
                        )
                      })}
                    </React.Fragment>
                  ))
                ) : ( 
                  rutinaActual.ejercicios.map((ejercicio, index) => {
                      const isChecked = currentSelections.includes(ejercicio);
                      return (
                        <li key={index} onClick={() => onSelectExercise(grupo, ejercicio)} className="cursor-pointer flex items-center p-3 rounded-lg transition-colors hover:bg-gray-700">
                            <div className={`w-6 h-6 flex justify-center items-center border-2 ${isChecked ? 'border-cyan-500 bg-cyan-500' : 'border-gray-500'} rounded-md mr-4 transition-all`}>
                                {isChecked && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                            </div>
                            <span className={`text-lg ${isChecked ? 'text-white' : 'text-gray-300'}`}>{ejercicio}</span>
                        </li>
                      )
                  })
                )}
              </ul>

              {currentSelections.length > 0 && (
                <div className="text-right mt-4">
                    <button onClick={() => onClearGroup(grupo)} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                        Limpiar selección
                    </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12">
              <h2 className="bebas-font text-4xl text-white mb-6 text-center tracking-wider">Galería de Ejercicios</h2>
              
              {grupo === 'piernas' && Array.isArray(filteredGallery) ? (
                filteredGallery.map(subgrupo => (
                  <div key={subgrupo.nombre} className="mb-12">
                    <h3 className="bebas-font text-3xl text-[#379AA5] mb-6 tracking-wider">{subgrupo.nombre}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {subgrupo.ejercicios.map((imagen, index) => {
                        const isOpen = openIndex === `${subgrupo.nombre}-${index}`;
                        return (
                          <div key={imagen.nombre}>
                            <div onClick={() => handleToggle(`${subgrupo.nombre}-${index}`)} className="relative h-80 rounded-lg overflow-hidden shadow-xl transform transition-transform hover:scale-105 cursor-pointer">
                                <ImageLoader src={imagen.src} alt={imagen.nombre} className="w-full h-full"/>
                                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                                    <h4 className="text-white text-xl font-bold tracking-wide">{imagen.nombre}</h4>
                                </div>
                            </div>
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'}`}>
                                <div className="bg-gray-800 p-6 rounded-lg">
                                    <p className="text-gray-300 mb-4">{imagen.descripcion}</p>
                                    <p className="font-bold text-cyan-400 mb-4">{imagen.detalles}</p>
                                    <VideoPlayer videoUrl={isOpen ? imagen.videoUrl : ''} title={imagen.nombre} />
                                </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGallery.map((imagen, index) => {
                      const isOpen = openIndex === index;
                      return (
                          <div key={imagen.nombre}>
                              <div onClick={() => handleToggle(index)} className="relative h-80 rounded-lg overflow-hidden shadow-xl transform transition-transform hover:scale-105 cursor-pointer">
                                  <ImageLoader src={imagen.src} alt={imagen.nombre} className="w-full h-full"/>
                                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                                      <h4 className="text-white text-xl font-bold tracking-wide">{imagen.nombre}</h4>
                                  </div>
                              </div>
                              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'}`}>
                                  <div className="bg-gray-800 p-6 rounded-lg">
                                      <p className="text-gray-300 mb-4">{imagen.descripcion}</p>
                                      <p className="font-bold text-cyan-400 mb-4">{imagen.detalles}</p>
                                      <VideoPlayer videoUrl={isOpen ? imagen.videoUrl : ''} title={imagen.nombre} />
                                  </div>
                              </div>
                          </div>
                      )
                  })}
                </div>
              )}
          </div>

        </div>
      </div>
    </>
  );
};

const VideoPlayer = ({ videoUrl, title }) => {
  if (!videoUrl) return null;

  // Check if the URL is a YouTube embed link
  const isYouTube = typeof videoUrl === 'string' && videoUrl.includes('youtube.com/embed');

  return (
    <div className="relative pt-[56.25%] w-full h-full">
      {isYouTube ? (
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={videoUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={videoUrl}
          title={title}
          controls
          autoPlay
          muted // Autoplay on browsers often requires the video to be muted
          loop
        >
          Tu navegador no soporta el elemento de video.
        </video>
      )}
    </div>
  );
};

export default DetalleEjercicio;
