// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getStorage } from "firebase/storage";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyCcyUSs4rhjIAoJBuTRjdPPR2Q4hLJXYq4",
  // authDomain: "chat-8a809.firebaseapp.com",
  // projectId: "chat-8a809",
  // storageBucket: "chat-8a809.appspot.com",
  // messagingSenderId: "938335827319",
  // appId: "1:938335827319:web:eadab132962e2da6b85d72"
  apiKey: "AIzaSyCPSjz8EHbfR7w7G2Ch-zkwJfgfTQqdS-g",
  authDomain: "chat-28f3e.firebaseapp.com",
  projectId: "chat-28f3e",
  storageBucket: "chat-28f3e.appspot.com",
  messagingSenderId: "800965567905",
  appId: "1:800965567905:web:078a8bb7d082a61ac8d7e0",
  measurementId: "G-V6E3GGJ9Q7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const storage = getStorage(app)
export const db = getFirestore(app)
