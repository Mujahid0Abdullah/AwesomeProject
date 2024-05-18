// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import  {getStorage} from "firebase/storage"
import {initializeFirestore} from "firebase/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjDeR8tjRgm7lLZ0ne9JDt32wcZW9X5ps",
  authDomain: "chatdoctor-70dbb.firebaseapp.com",
  projectId: "chatdoctor-70dbb",
  storageBucket: "chatdoctor-70dbb.appspot.com",
  messagingSenderId: "665264320629",
  appId: "1:665264320629:web:54f80583a9f14db8d2083c"
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app ,{ experimentalForseLongPollinng: true})

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}



/*
export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}*/



export function signUp(email, password, userType) {
  return createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Kullanıcı başarıyla oluşturulduğunda, Firestore'da bir belge oluştur
    const user = userCredential.user;
    return setDoc(doc(db, "users", user.uid), {
      email: user.email,
      userType: userType
    });
  });
}