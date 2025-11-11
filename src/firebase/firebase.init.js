// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYTjr4K3UJiNbjKYebUvUdYmT8z5gG47Q",
  authDomain: "habit-tracker-c8676.firebaseapp.com",
  projectId: "habit-tracker-c8676",
  storageBucket: "habit-tracker-c8676.firebasestorage.app",
  messagingSenderId: "537275210263",
  appId: "1:537275210263:web:d48093786c782813921a52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);