// firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWCVx3BrxGTfJjAdWAgCoIzlmk-er2uEs",
  authDomain: "feestio.firebaseapp.com",
  projectId: "feestio",
  storageBucket: "feestio.firebasestorage.app",
  messagingSenderId: "583705168189",
  appId: "1:583705168189:web:dc914b1f62de10cca51d54"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 
