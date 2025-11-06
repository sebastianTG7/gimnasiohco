import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook personalizado para gestionar rutinas en Firebase Firestore
 * Permite CRUD completo de rutinas por usuario
 */
export const useRoutines = () => {
  const { currentUser } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todas las rutinas del usuario actual
  const loadRoutines = async () => {
    if (!currentUser) {
      setRoutines([]);
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setLoading(true);
      setError(null);

      const routinesRef = collection(db, 'users', currentUser.uid, 'routines');
      const q = query(routinesRef, orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const routinesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setRoutines(routinesList);
      setLoading(false);
      return { success: true, data: routinesList };
    } catch (err) {
      console.error('Error cargando rutinas:', err);
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Cargar una rutina específica
  const loadRoutine = async (routineId) => {
    if (!currentUser) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setLoading(true);
      setError(null);

      const routineRef = doc(db, 'users', currentUser.uid, 'routines', routineId);
      const routineSnap = await getDoc(routineRef);

      if (routineSnap.exists()) {
        const routineData = { id: routineSnap.id, ...routineSnap.data() };
        setCurrentRoutine(routineData);
        setLoading(false);
        return { success: true, data: routineData };
      } else {
        setLoading(false);
        return { success: false, error: 'Rutina no encontrada' };
      }
    } catch (err) {
      console.error('Error cargando rutina:', err);
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Crear nueva rutina
  const createRoutine = async (routineData) => {
    if (!currentUser) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setLoading(true);
      setError(null);

      const routinesRef = collection(db, 'users', currentUser.uid, 'routines');
      
      const newRoutine = {
        name: routineData.name || 'Mi Rutina',
        description: routineData.description || '',
        schedule: routineData.schedule || { days: {}, types: [] },
        selectedExercises: routineData.selectedExercises || {},
        customDetails: routineData.customDetails || {},
        isActive: routineData.isActive !== undefined ? routineData.isActive : true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(routinesRef, newRoutine);
      
      const createdRoutine = {
        id: docRef.id,
        ...newRoutine
      };

      setRoutines(prev => [createdRoutine, ...prev]);
      setCurrentRoutine(createdRoutine);
      setLoading(false);

      return { success: true, data: createdRoutine, id: docRef.id };
    } catch (err) {
      console.error('Error creando rutina:', err);
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Actualizar rutina existente
  const updateRoutine = async (routineId, updates) => {
    if (!currentUser) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setLoading(true);
      setError(null);

      const routineRef = doc(db, 'users', currentUser.uid, 'routines', routineId);
      
      const updatedData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(routineRef, updatedData);

      // Actualizar estado local
      setRoutines(prev => 
        prev.map(r => r.id === routineId ? { ...r, ...updatedData } : r)
      );

      if (currentRoutine?.id === routineId) {
        setCurrentRoutine(prev => ({ ...prev, ...updatedData }));
      }

      setLoading(false);
      return { success: true, data: updatedData };
    } catch (err) {
      console.error('Error actualizando rutina:', err);
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Eliminar rutina
  const deleteRoutine = async (routineId) => {
    if (!currentUser) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setLoading(true);
      setError(null);

      const routineRef = doc(db, 'users', currentUser.uid, 'routines', routineId);
      await deleteDoc(routineRef);

      setRoutines(prev => prev.filter(r => r.id !== routineId));
      
      if (currentRoutine?.id === routineId) {
        setCurrentRoutine(null);
      }

      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Error eliminando rutina:', err);
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Marcar rutina como activa
  const setActiveRoutine = async (routineId) => {
    if (!currentUser) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setLoading(true);
      setError(null);

      // Desactivar todas las rutinas
      const batch = routines.map(async (routine) => {
        const routineRef = doc(db, 'users', currentUser.uid, 'routines', routine.id);
        await updateDoc(routineRef, { isActive: routine.id === routineId });
      });

      await Promise.all(batch);

      // Actualizar estado local
      setRoutines(prev =>
        prev.map(r => ({ ...r, isActive: r.id === routineId }))
      );

      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Error estableciendo rutina activa:', err);
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Cargar rutinas automáticamente cuando el usuario inicia sesión
  useEffect(() => {
    if (currentUser) {
      loadRoutines();
    } else {
      setRoutines([]);
      setCurrentRoutine(null);
    }
  }, [currentUser?.uid]);

  return {
    routines,
    currentRoutine,
    loading,
    error,
    loadRoutines,
    loadRoutine,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    setActiveRoutine,
    setCurrentRoutine
  };
};
