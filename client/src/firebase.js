// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const analytics = getAnalytics(app);