import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, setDoc, doc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1ukAMPGUoiNKr3KoOLOuTdjwsvcCPkBg",
  authDomain: "stop-at-10-6ead4.firebaseapp.com",
  projectId: "stop-at-10-6ead4",
  storageBucket: "stop-at-10-6ead4.firebasestorage.app",
  messagingSenderId: "569877730994",
  appId: "1:569877730994:web:162deafdf31832ec1fdbab",
  measurementId: "G-VP3LQV865Q"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
