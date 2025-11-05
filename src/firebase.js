// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// TODO: Reemplazar con tu configuración real de Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBvPqjeEFOL4DH77xo4oWyfugzhrfs5z-o",
  authDomain: "gym-energyhco.firebaseapp.com",
  projectId: "gym-energyhco",
  storageBucket: "gym-energyhco.firebasestorage.app",
  messagingSenderId: "538933541475",
  appId: "1:538933541475:web:b22a5b8d0e8747243f1656"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
