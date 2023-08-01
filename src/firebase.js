// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeIUoycMggQumCdlJN24Xp-IbYYA6YAe0",
  authDomain: "event-finder-test-56e2e.firebaseapp.com",
  projectId: "event-finder-test-56e2e",
  storageBucket: "event-finder-test-56e2e.appspot.com",
  messagingSenderId: "142795023154",
  appId: "1:142795023154:web:9d711d5b48d8a48b39ad2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage=getStorage(app);
export default app;
