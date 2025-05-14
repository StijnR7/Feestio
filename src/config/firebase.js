// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWCVx3BrxGTfJjAdWAgCoIzlmk-er2uEs",
  authDomain: "feestio.firebaseapp.com",
  projectId: "feestio",
  storageBucket: "feestio.firebasestorage.app",
  messagingSenderId: "583705168189",
  appId: "1:583705168189:web:dc914b1f62de10cca51d54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);