import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxSBe0PWZ-KLCuXIe49ajTcIeRG4P_Lg8",
  authDomain: "plantrise-d497a.firebaseapp.com",
  projectId: "plantrise-d497a",
  storageBucket: "plantrise-d497a.firebasestorage.app",
  messagingSenderId: "685568111558",
  appId: "1:685568111558:web:5a831d528851170fbff8c7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
