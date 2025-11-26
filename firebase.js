import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA-hQiTwTuVuTcNAeaqfQq85BWbEYzGI5Q",
    authDomain: "entropy-energy-store.firebaseapp.com",
    projectId: "entropy-energy-store",
    storageBucket: "entropy-energy-store.firebasestorage.app",
    messagingSenderId: "160823337864",
    appId: "1:160823337864:web:cca954ec8e04cfc506903d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, query, orderBy, Timestamp, doc, updateDoc };
