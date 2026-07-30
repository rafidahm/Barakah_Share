// frontend/src/context/AuthContext.jsx
// Real Firebase Authentication — replaces all mock login/register logic

import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from '../services/api';

const AuthContext = createContext(null);

// ── Allowed university domains ───────────────────────────────────
const ALLOWED_DOMAINS = ['@ugrad.iiuc.ac.bd', '@iiuc.ac.bd'];

const isUniversityEmail = (email) =>
  ALLOWED_DOMAINS.some((domain) => email?.endsWith(domain));

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  // ── Watch Firebase auth state ────────────────────────────────
  // Runs on every page load/refresh — keeps user logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If registering, skip auto-fetching profile in onAuthStateChanged
        // The register function itself will handle backend creation and profile loading.
        if (localStorage.getItem('is_registering') === 'true') {
          setLoading(false);
          return;
        }
        try {
          // Get fresh ID token from Firebase
          const token = await firebaseUser.getIdToken(true);
          localStorage.setItem('bs_token', token);

          // Fetch user profile from your MongoDB via backend
          const res = await api.get('/api/auth/me');
          setCurrentUser(res.data.user);
        } catch {
          // Token invalid or backend down — clear state
          localStorage.removeItem('bs_token');
          setCurrentUser(null);
        }
      } else {
        localStorage.removeItem('bs_token');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; // cleanup listener on unmount
  }, []);

  // ── Email/Password Login ─────────────────────────────────────
  const login = async (email, password) => {
    try {
      // Domain check for email login
      if (!isUniversityEmail(email)) {
        return {
          success: false,
          error: 'Only IIUC university emails are allowed (@ugrad.iiuc.ac.bd or @iiuc.ac.bd)',
        };
      }
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged above handles setCurrentUser
      return { success: true };
    } catch (err) {
      const msg =
        err.code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : err.message;
      return { success: false, error: msg };
    }
  };

  // ── Register ─────────────────────────────────────────────────
  const register = async (name, email, password, department = '') => {
    try {
      // Domain check
      if (!isUniversityEmail(email)) {
        return {
          success: false,
          error: 'Only IIUC university emails are allowed (@ugrad.iiuc.ac.bd or @iiuc.ac.bd)',
        };
      }

      localStorage.setItem('is_registering', 'true');

      // Create Firebase user (for authentication)
      const cred  = await createUserWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      localStorage.setItem('bs_token', token);

      // Save user profile to MongoDB via backend
      const res = await api.post('/api/auth/register', {
        name,
        email,
        password,
        department,
        firebaseUid: cred.user.uid,
      });

      setCurrentUser(res.data.user);
      return { success: true };
    } catch (err) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'This email is already registered'
          : err.message;
      return { success: false, error: msg };
    } finally {
      localStorage.removeItem('is_registering');
    }
  };

  // ── Google Sign-In ───────────────────────────────────────────
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email  = result.user.email;

      // Enforce university domain
      if (!isUniversityEmail(email)) {
        await signOut(auth); // kick them out immediately
        return {
          success: false,
          error: `Only IIUC accounts allowed. You signed in with ${email}. Use your @ugrad.iiuc.ac.bd email.`,
        };
      }

      // onAuthStateChanged handles the rest (token + profile fetch)
      return { success: true };
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in cancelled' };
      }
      return { success: false, error: err.message };
    }
  };

  // ── Logout ───────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('bs_token');
    setCurrentUser(null);
  };

  // ── Update profile ───────────────────────────────────────────
  const updateProfile = async (data) => {
    try {
      const res = await api.patch('/api/auth/me', data);
      setCurrentUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  // Show nothing while checking auth state on page load
  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
