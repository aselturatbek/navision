// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBiRRfEjwKlXh8Ouu4RU67-SFI_I4gA8HI",
  authDomain: "navision-nv.firebaseapp.com",
  databaseURL: "https://navision-nv-default-rtdb.firebaseio.com",
  projectId: "navision-nv",
  storageBucket: "navision-nv.appspot.com",
  messagingSenderId: "784327572499",
  appId: "1:784327572499:web:0344fcac161f25a4b253e6",
  measurementId: "G-Y5WX3FV2XE"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth,database};
