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
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg mb-1">
      <h2 className="bebas-font text-3xl text-white mb-1">Resumen Semanal</h2>
      <ul className="space-y-4">
        {daysOfWeek.map(day => {
          const groupsForDay = scheduleByDay[day];

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
        { src: images.img_press_banca_barra, nombre: 'Press Banca (barra)', descripcion: 'Este es el ejercicio principal para construir fuerza y masa en el pecho.', detalles: '4 series de 8-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/HzkHpIIo4IA' },
        { src: images.img_press_inclinado_barra, nombre: 'Press Inclinado (barra)', descripcion: 'Excelente para aislar y estirar los músculos pectorales.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/HImp2-LuihU' },
        { src: images.img_press_banca_mancuernas, nombre: 'Press Banca (Mancuernas)', descripcion: 'Un ejercicio clásico con peso corporal que trabaja pecho, hombros y tríceps.', detalles: '3 series al fallo', videoUrl:"https://www.youtube.com/embed/48L0oQApm_0" },
        { src: images.img_press_inclinado_mancuernas, nombre: 'Press Inclinado (Mancuernas)', descripcion: 'Un ejercicio clásico con peso corporal que trabaja pecho, hombros y tríceps.', detalles: '3 series al fallo', videoUrl: videos.vid_press_inclinado_mancuernas },
        { src: images.img_press_maquina, nombre: 'Press Máquina', descripcion: 'Enfocado en la parte superior del pectoral para un desarrollo completo.', detalles: '4 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/JXJmPXlqwh0' },
        { src: images.img_aperturas_mancuernas, nombre: 'Aperturas (Mancuernas)', descripcion: 'Enfocado en la parte superior del pectoral para un desarrollo completo.', detalles: '4 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/C7Nq4DgV9Mg' },
        { src: images.img_aperturas_cable, nombre: 'Aperturas (Cable)', descripcion: 'Aísla los pectorales para un bombeo intenso.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/5oX3KUSiqy4' },
        { src: images.img_aperturas_pecfly, nombre: 'Aperturas Pec Fly', descripcion: 'Aísla los pectorales para un bombeo intenso.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/-9JbjkG5f0Q' },
        { src: images.img_pecho_fondos, nombre: 'Fondos', descripcion: 'Un ejercicio clásico con peso corporal que trabaja pecho, hombros y tríceps.', detalles: '3 series al fallo', videoUrl: 'https://www.youtube.com/embed/1fR3Ss8OFug'}
      ]
    },
    espalda: {
        titulo: "RUTINA DE ESPALDA",
        ejercicios: ["Remo Parado (barra)", "Remo a 1 mano (Mancuerna)","Remo a 1 mano (Cable)","Remo Máquina", "Dominadas", "Jalón (Agarre Abierto)", "Jalón (Agarre Cerrado)", "Remo sentado (Polea, Abierto)", "Remo sentado (Polea, Cerrado)"],
        imagenes: [
          { src: images.img_e_remo_parado_barra, nombre: 'Remo Parado (barra)', descripcion: 'El rey de los ejercicios para la amplitud de la espalda.', detalles: '4 series al fallo', videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g' },
          { src: images.img_e_remo_1_mano_mancuerna, nombre: 'Remo a 1 mano (Mancuerna)', descripcion: 'Ideal para añadir densidad y grosor a la espalda media.', detalles: '4 series de 8-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/l_5vkm15_p8' },
          { src: images.img_e_remo_1_mano_polea, nombre: 'Remo a 1 mano (Cable)', descripcion: 'Ejercicio compuesto que trabaja toda la cadena posterior.', detalles: '3 series de 5-8 repeticiones', videoUrl: 'https://www.youtube.com/embed/op9kVnSso6Q' },
          { src: images.img_e_remo_maquina, nombre: 'Remo Máquina', descripcion: 'Ejercicio compuesto que trabaja toda la cadena posterior.', detalles: '3 series de 5-8 repeticiones', videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74' },
          { src: images.img_e_dominadas, nombre: 'Dominadas', descripcion: 'El mejor ejercicio para construir una espalda ancha y fuerte.', detalles: '4 series al fallo', videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g' },
          { src: images.img_e_jalon_agarre_abierto, nombre: 'Jalón (Agarre Abierto)', descripcion: 'Perfecto para trabajar la parte superior de la espalda y los dorsales.', detalles: '4 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc' },
          { src: images.img_e_jalon_agarre_cerrado, nombre: 'Jalón (Agarre Cerrado)', descripcion: 'Enfocado en la parte media de la espalda y los dorsales.', detalles: '4 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/4VdVhX9j6cM' },
          { src: images.img_e_remo_sentado_polea_abierto, nombre: 'Remo sentado (Polea, Abierto)', descripcion: 'Ideal para trabajar la espalda media y los romboides.', detalles: '4 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74' },
          { src: images.img_e_remo_sentado_polea_cerrado, nombre: 'Remo sentado (Polea, Cerrado)', descripcion: 'Ideal para trabajar la espalda media y los romboides.', detalles: '4 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74' }
        ]
      },
      hombros: {
        titulo: "RUTINA DE HOMBROS",
        ejercicios: ["Press Militar (barra)", "Press Militar (mancuernas)", "Aperturas Laterales", "Elevaciones Frontales", "Elevaciones Posteriores", "Encogimientos de Hombros (Trapecios)"],
        imagenes: [
            { src: images.img_h_press_militar_barra, nombre: 'Press Militar (barra)', descripcion: 'Ejercicio fundamental para hombros fuertes y grandes.', detalles: '4 series de 8-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI' },
            { src: images.img_h_press_militar_mancuernas, nombre: 'Press Militar (mancuernas)', descripcion: 'Permite un rango de movimiento más natural.', detalles: '4 series de 8-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo' },
            { src: images.img_h_aperturas_laterales, nombre: 'Aperturas Laterales', descripcion: 'Enfocado en la parte posterior de los hombros.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://www.youtube.com/embed/3dE_1g_e2wM' },
            { src: images.img_h_elevaciones_frontales, nombre: 'Elevaciones Frontales', descripcion: 'Perfecto para trabajar la parte frontal del deltoides.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://www.youtube.com/embed/-t7fuZ0KhDA' },
            { src: images.img_h_elevaciones_posteriores, nombre: 'Elevaciones Posteriores', descripcion: 'Enfocado en la parte posterior de los hombros.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://www.youtube.com/embed/3dE_1g_e2wM' },
            { src: images.img_h_trapecios, nombre: 'Encogimientos de Hombros (Trapecios)', descripcion: 'El mejor ejercicio para desarrollar los trapecios.', detalles: '4 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/5Z0b3n9FfXU' }
        ]
    },
    biceps: {
        titulo: "RUTINA DE BICEPS",
        ejercicios: ["Curl Parado (Barra)", "Curl Banco Scott", "Curl Banco Inclinado","Curl Araña","Curl Concentrado a 1 brazo", "Curl Martillo"],
        imagenes: [
            { src: images.img_b_curl_parado_barra, nombre: 'Curl Parado (Barra)', descripcion: 'El mejor constructor de masa para los bíceps.', detalles: '4 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/kwG2Z2g4fCg' },
            { src: images.img_b_curl_banco_scott, nombre: 'Curl Banco Scott', descripcion: 'Trabaja el braquial y da grosor al brazo.', detalles: '3 series de 10-12 repeticiones por brazo', videoUrl: 'https://www.youtube.com/embed/zC3nLH_b_g4' },
            { src: images.img_b_curl_banco_inclinado, nombre: 'Curl Banco Inclinado', descripcion: 'Excelente para aislar el pico del bíceps.', detalles: '3 series de 12-15 repeticiones por brazo', videoUrl: 'https://www.youtube.com/embed/0AUGkch3tzc' },
            { src: images.img_b_curl_arana, nombre: 'Curl Araña', descripcion: 'Aísla el bíceps para un bombeo intenso.', detalles: '3 series de 12-15 repeticiones por brazo', videoUrl: 'https://www.youtube.com/embed/8EJ3zbKTWQ8' },
            { src: images.img_b_curl_concentrado_1_brazo, nombre: 'Curl Concentrado a 1 brazo', descripcion: 'Aísla el bíceps para un bombeo intenso.', detalles: '3 series de 12-15 repeticiones por brazo', videoUrl: 'https://www.youtube.com/embed/8EJ3zbKTWQ8' },
            { src: images.img_b_curl_martillo, nombre: 'Curl Martillo', descripcion: 'Trabaja el braquiorradial y da un aspecto más completo al brazo.', detalles: '4 series de 10-12 repeticiones por brazo', videoUrl: 'https://www.youtube.com/embed/zC3nLH_b_g4' }
        ]
    },
    triceps: {
        titulo: "RUTINA DE TRICEPS",
        ejercicios: ["Press Frances", "Fondos para Tríceps", "Empujon Parado (Cable)", "Empujon Tras Nuca (Cable)","Empujon Tras Nuca (Mancuerna)","Patada de Tríceps(Cable o Mancuernas)", "Extensiones en Polea Alta Cruzada"],
        imagenes: [
            { src: images.img_t_press_frances, nombre: 'Press Frances', descripcion: 'Gran ejercicio compuesto para tríceps y pecho.', detalles: '4 series al fallo', videoUrl: 'https://www.youtube.com/embed/2z8JmcrW-PY' },
            { src: images.img_t_fondos, nombre: 'Fondos para Tríceps', descripcion: 'Perfecto para un bombeo final y dar forma al tríceps.', detalles: '3 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/2-LAMcpzODs' },
            { src: images.img_t_empujon_parado_cable, nombre: 'Empujon Parado (Cable)', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/tK2-E-p6B_c' },
            { src: images.img_t_empujon_tras_nuca_cable, nombre: 'Empujon Tras Nuca (Cable)', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/tK2-E-p6B_c' },
            { src: images.img_t_empujon_tras_nuca_mancuernas, nombre: 'Empujon Tras Nuca (Mancuerna)', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/tK2-E-p6B_c' },
            { src: images.img_t_patada, nombre: 'Patada de Tríceps', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/tK2-E-p6B_c' },
            { src: images.img_t_extensiones_polea_alta_cruzada, nombre: 'Extensiones en Polea Alta Cruzada', descripcion: 'Aísla la cabeza larga del tríceps.', detalles: '3 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/tK2-E-p6B_c' }
        ]
    },
    abdominales: {
      titulo: "RUTINA DE ABDOMINALES",
      ejercicios: ["Crunches", "Palo Press(Cable)", "Elevación de Piernas", "Caminata de Granjero", "Planchas Frontal"],
      imagenes: [
          { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Abs+1', nombre: 'Crunches', descripcion: 'El ejercicio básico para la parte superior del abdomen.', detalles: '3 series al fallo', videoUrl: 'https://www.youtube.com/embed/Xyd_fa5zoEU' },
          { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Abs+2', nombre: 'Palo Press(Cable)', descripcion: 'Fortalece todo el core, incluyendo abdomen, espalda baja y oblicuos.', detalles: '3 series, manteniendo la posición el mayor tiempo posible', videoUrl: 'https://www.youtube.com/embed/ASdvN_XMM_g' },
          { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Abs+3', nombre: 'Elevación de Piernas', descripcion: 'Excelente para enfocar el trabajo en la parte inferior del abdomen.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://www.youtube.com/embed/l4kQd9eWJmk' },
          { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Abs+3', nombre: 'Caminata de Granjero', descripcion: 'Excelente para enfocar el trabajo en la parte inferior del abdomen.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://www.youtube.com/embed/l4kQd9eWJmk' },
          { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Abs+3', nombre: 'Planchas Frontal', descripcion: 'Excelente para enfocar el trabajo en la parte inferior del abdomen.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://www.youtube.com/embed/l4kQd9eWJmk' },


      ]
  },
    piernas: {
        titulo: "RUTINA DE PIERNAS",
        subgrupos: [
          {
            nombre: "Cuádriceps",
            ejercicios: [
              { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Sentadilla', nombre: 'Sentadillas Libre', descripcion: 'El ejercicio rey para el desarrollo de las piernas en general.', detalles: '4 series de 8-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/4-mS9r6A9S4' },
              { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Prensa', nombre: 'Sentadilla Hack', descripcion: 'Permite mover grandes pesos de forma segura, enfocándose en los cuádriceps.', detalles: '4 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/s1p_F7a2j-M' },
              { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Extensiones', nombre: 'Sentadillas Multipower', descripcion: 'Ejercicio de aislamiento para definir la parte frontal de la pierna.', detalles: '3 series de 15-20 repeticiones', videoUrl: 'https://www.youtube.com/embed/Yy6tn_gli-4' },
              { src: '', nombre: 'Sentadilla Squat Péndulo', descripcion: 'Trabaja cuádriceps, glúteos e isquiotibiales, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U' },
              { src: '', nombre: 'Prensa 45 grados', descripcion: 'Trabaja cuádriceps, glúteos e isquiotibiales, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U' },
              { src: '', nombre: 'Máquina Hack Multipower', descripcion: 'Trabaja cuádriceps, glúteos e isquiotibiales, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U' },
              { src: '', nombre: 'Extensiones de Cuádriceps', descripcion: 'Trabaja cuádriceps, glúteos e isquiotibiales, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U' },
              { src: '', nombre: 'Búlgaras para Cuádriceps', descripcion: 'Trabaja cuádriceps, glúteos e isquiotibiales, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U' },
              { src: '', nombre: 'Zancadas', descripcion: 'Trabaja cuádriceps, glúteos e isquiotibiales, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U' },
              { src: '', nombre: 'Aductores', descripcion: 'Trabaja cuádriceps, glúteos e isquiotibiales, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U' },
              
            ]
          },
          {
            nombre: "Isquiotibiales",
            ejercicios: [
              { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Peso+Muerto', nombre: 'Peso Muerto Rumano', descripcion: 'Excelente para trabajar toda la cadena posterior, con énfasis en los isquiotibiales.', detalles: '4 series de 10-12 repeticiones', videoUrl: 'https://www.youtube.com/embed/JCX_g_ZlQso' },
              { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Curl+1', nombre: 'Peso Muerto B-Stand', descripcion: 'Ejercicio de aislamiento para la parte trasera de la pierna.', detalles: '4 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/Nxd604aK_sQ' },
              { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Curl+2', nombre: 'Curl Femoral Tumbado', descripcion: 'Ejercicio de aislamiento para la parte trasera de la pierna.', detalles: '4 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/Nxd604aK_sQ' },
              { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Curl+3', nombre: 'Curl Femoral Hammer', descripcion: 'Ejercicio de aislamiento para la parte trasera de la pierna.', detalles: '4 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/Nxd604aK_sQ' },
              { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Curl+4', nombre: 'Curl Femoral Sentado', descripcion: 'Ejercicio de aislamiento para la parte trasera de la pierna.', detalles: '4 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/Nxd604aK_sQ' },
              { src: 'https://placehold.co/600x400/1e293b/ffffff?text=Curl+5', nombre: 'Curl Nórdico', descripcion: 'Ejercicio de aislamiento para la parte trasera de la pierna.', detalles: '4 series de 12-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/Nxd604aK_sQ' },

            ]
          },
          {
            nombre: "Glúteos",
            ejercicios: [
              { src: '', nombre: 'Hip Thrust', descripcion: 'El mejor ejercicio para construir fuerza y tamaño en los glúteos.', detalles: '4 series de 10-15 repeticiones', videoUrl: 'https://www.youtube.com/embed/xDmFkJxPzeM' },
              { src: '', nombre: 'Puentes', descripcion: 'Trabaja glúteos y piernas de forma unilateral, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QO_o3_5_1_M' },
              { src: '', nombre: 'Búlgaras para Glúteos', descripcion: 'Trabaja glúteos y piernas de forma unilateral, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QO_o3_5_1_M' },
              { src: '', nombre: 'Peso Muerto Sumo', descripcion: 'Trabaja glúteos y piernas de forma unilateral, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QO_o3_5_1_M' },
              { src: '', nombre: 'Sentadilla Sumo', descripcion: 'Trabaja glúteos y piernas de forma unilateral, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QO_o3_5_1_M' },
              { src: '', nombre: 'Patadas con Cable', descripcion: 'Trabaja glúteos y piernas de forma unilateral, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QO_o3_5_1_M' },
              { src: '', nombre: 'Patadas en Máquina', descripcion: 'Trabaja glúteos y piernas de forma unilateral, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QO_o3_5_1_M' },
              { src: '', nombre: 'Buenos Días', descripcion: 'Trabaja glúteos y piernas de forma unilateral, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QO_o3_5_1_M' },
              { src: '', nombre: 'Step-ups', descripcion: 'Trabaja glúteos y piernas de forma unilateral, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QO_o3_5_1_M' },
              { src: '', nombre: 'Abductores', descripcion: 'Trabaja glúteos y piernas de forma unilateral, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QO_o3_5_1_M'},
              { src: '', nombre: 'Hiper extensión para Glúteos', descripcion: 'Trabaja glúteos y piernas de forma unilateral, mejorando el equilibrio.', detalles: '3 series de 12 repeticiones por pierna', videoUrl: 'https://www.youtube.com/embed/QO_o3_5_1_M'},

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
  const routineTypeOptions = ['Volumen', 'Definición', 'Fuerza'];

  return (
    <>
      <button 
        onClick={() => setIsDrawerOpen(prev => !prev)}
        className="fixed top-5 right-5 z-30 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        aria-label="Abrir menú de rutinas"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>

      <SwipeableMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <h3 className="bebas-font text-3xl text-[#379AA5] tracking-widest mb-4">RUTINAS</h3>
        <ul className="flex flex-col space-y-8">
          {menuItems.map(item => (
            <li key={item}>
              <Link 
                to={`/${item}`}
                onClick={() => setIsDrawerOpen(false)} 
                className={`text-lg p-2 rounded-md transition-colors ${grupo === item ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
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
                <h2 className="bebas-font text-3xl text-white">Mi Plan Semanal:</h2>
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
              <h2 className="bebas-font text-3xl text-white">Personaliza tu Rutina:</h2>
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
