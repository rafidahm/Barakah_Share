// frontend/src/config/firebase.js
// Firebase Client SDK — used in the browser for auth

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Auth instance — used for login/register/Google sign-in
export const auth = getAuth(app);

// Google provider — used for signInWithPopup
export const googleProvider = new GoogleAuthProvider();

// Restrict Google login to IIUC university domains only
googleProvider.setCustomParameters({
  hd: 'ugrad.iiuc.ac.bd', // hints Google to show only this domain
});
