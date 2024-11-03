// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Firebase Auth için AsyncStorage persistence ekleme
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firebase Database başlat
const database = getDatabase(app);

// Firestore'u optimize edilmiş ayarlarla başlat
const db = initializeFirestore(app, {
  localCache: {
    sizeBytes: CACHE_SIZE_UNLIMITED, // Bellek boyutunu sınırsız olarak ayarlar
  },
});

// Firebase Storage başlat
const storage = getStorage(app);

export { auth, database, db, storage };
