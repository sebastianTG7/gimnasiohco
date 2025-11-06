// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// TODO: Reemplazar con tu configuración real de Firebase Console
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "gym-energyhco.firebaseapp.com",
  projectId: "gym-energyhco",
  storageBucket: "gym-energyhco.firebasestorage.app",
  messagingSenderId: "53893...",
  appId: "1:5389335414..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
