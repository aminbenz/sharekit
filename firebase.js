// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.FIREBASE_API_KEY,
  authDomain: 'sharekit-91594.firebaseapp.com',
  projectId: 'sharekit-91594',
  storageBucket: 'sharekit-91594.appspot.com',
  messagingSenderId: '815419219446',
  appId: '1:815419219446:web:ee06e3f71faeed78353bd7',
  measurementId: 'G-DX99FSPJ4E',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage();
const db = getFirestore(app);

export { app, storage, db };
