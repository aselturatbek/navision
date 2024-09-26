// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD5Go5BbHjqrLP3ZpOvLzNXgq6TGYYiwSM",
  authDomain: "navision-db.firebaseapp.com",
  projectId: "navision-db",
  storageBucket: "navision-db.appspot.com",
  messagingSenderId: "213474868379",
  appId: "1:213474868379:ios:e2e18aaf4f3d3e25a81a3e"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth,database};
