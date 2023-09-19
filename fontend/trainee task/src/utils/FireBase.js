// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getStorage } from "firebase/storage";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcyUSs4rhjIAoJBuTRjdPPR2Q4hLJXYq4",
  authDomain: "chat-8a809.firebaseapp.com",
  projectId: "chat-8a809",
  storageBucket: "chat-8a809.appspot.com",
  messagingSenderId: "938335827319",
  appId: "1:938335827319:web:eadab132962e2da6b85d72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const storage = getStorage(app)
export const db = getFirestore(app)
