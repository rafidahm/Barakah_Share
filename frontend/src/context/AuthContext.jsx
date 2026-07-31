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
        // No Firebase session — but the user may have logged in via backend JWT.
        // Check if there's a valid JWT token before clearing the session.
        const existingToken = localStorage.getItem('bs_token');
        if (existingToken) {
          try {
            // Validate the token against the backend
            const res = await api.get('/api/auth/me');
            setCurrentUser(res.data.user);
          } catch {
            // JWT is invalid or expired — clear everything
            localStorage.removeItem('bs_token');
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
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

      // Clear any stale Firebase Google session first
      // so we don't accidentally use the wrong token
      const currentFirebaseUser = auth.currentUser;
      if (currentFirebaseUser && currentFirebaseUser.providerData?.[0]?.providerId === 'google.com') {
        await signOut(auth);
      }

      // Try Firebase email/password login
      let token;
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        token = await cred.user.getIdToken(true);
      } catch (firebaseErr) {
        // Firebase doesn't have this account (registered via backend only)
        // or password mismatch — fall back to direct backend JWT login
        if (
          firebaseErr.code === 'auth/user-not-found' ||
          firebaseErr.code === 'auth/invalid-credential' ||
          firebaseErr.code === 'auth/wrong-password'
        ) {
          // Try backend JWT login directly
          const jwtRes = await api.post('/api/auth/login', { email, password });
          if (jwtRes.data?.token) {
            localStorage.setItem('bs_token', jwtRes.data.token);
            setCurrentUser(jwtRes.data.user);
            return { success: true, user: jwtRes.data.user };
          }
        }
        throw firebaseErr;
      }

      localStorage.setItem('bs_token', token);

      // Fetch user profile from MongoDB via backend
      const res = await api.get('/api/auth/me');
      setCurrentUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      const msg =
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
          ? 'Invalid email or password'
          : err.response?.data?.message || err.message;
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
      return { success: true, user: res.data.user };
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
        await signOut(auth);
        return {
          success: false,
          error: `Only IIUC accounts allowed. You signed in with ${email}. Use your @ugrad.iiuc.ac.bd email.`,
        };
      }

      // Store Firebase ID token — verifyToken middleware on backend will
      // automatically find the existing MongoDB user by email and link
      // the firebaseUid, preserving all previous data.
      const token = await result.user.getIdToken(true);
      localStorage.setItem('bs_token', token);

      // Fetch user profile from MongoDB via backend.
      // The backend verifyToken will find the account by email if
      // firebaseUid lookup fails (e.g. user previously used email/password).
      const res = await api.get('/api/auth/me');
      if (!res.data?.user) {
        await signOut(auth);
        localStorage.removeItem('bs_token');
        return { success: false, error: 'Could not load your account. Please try again.' };
      }
      setCurrentUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in cancelled' };
      }
      if (err.code === 'auth/cancelled-popup-request') {
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
