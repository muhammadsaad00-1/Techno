// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCEClniIpmx0x8zQPP811hQ4mMpHou6Pc",
  authDomain: "technoverse-123.firebaseapp.com",
  projectId: "technoverse-123",
  storageBucket: "technoverse-123.firebasestorage.app",
  messagingSenderId: "1008285849970",
  appId: "1:1008285849970:web:f49c71f354e669adbe65eb",
  measurementId: "G-0TX18GGPR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Collections
export const messagesCollection = collection(db, 'messages');
export const officersCollection = collection(db, 'officers');
export const reportsCollection = collection(db, 'reports'); // New collection for reports
export const issuesCollection = collection(db, 'issues'); // Collection for issues

export default app;