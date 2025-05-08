// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRIERQ2_cboV54srTxVdCwUXDvq8cxMa8",
  authDomain: "tuacar-ac1da.firebaseapp.com",
  projectId: "tuacar-ac1da",
  storageBucket: "tuacar-ac1da.firebasestorage.app",
  messagingSenderId: "1020028662787",
  appId: "1:1020028662787:web:d203fe6107ac3ae4b0ca36",
  measurementId: "G-CTMLJPQBMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);