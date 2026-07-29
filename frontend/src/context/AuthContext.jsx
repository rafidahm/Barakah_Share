import { createContext, useContext, useState } from 'react';
import { mockUsers } from '../data/mockData';

// TODO: Firebase Authentication — replace mock with Firebase onAuthStateChanged
// TODO: JWT Token — store & send token in Axios headers on login

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Mock login — matches against mockUsers array
  // TODO: Firebase Authentication — signInWithEmailAndPassword(auth, email, password)
  const login = (email, password) => {
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password123') {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  // Mock register — creates a new user in state
  // TODO: Firebase Authentication — createUserWithEmailAndPassword
  const register = (name, email, password) => {
    const exists = mockUsers.find(u => u.email === email);
    if (exists) return { success: false, error: 'Email already in use' };
    const newUser = {
      _id: `u${Date.now()}`,
      name,
      email,
      role: 'user',
      avatar: null,
      department: '',
      joinedAt: new Date().toISOString().split('T')[0],
    };
    // In mock mode we just set the current user
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // Google sign-in placeholder
  // TODO: Firebase Authentication — signInWithPopup(auth, googleProvider)
  const loginWithGoogle = () => {
    const mockGoogleUser = {
      _id: 'u_google',
      name: 'Google User',
      email: 'google@iiuc.ac.bd',
      role: 'user',
      avatar: null,
      department: '',
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(mockGoogleUser);
    return { success: true, user: mockGoogleUser };
  };

  const logout = () => {
    setCurrentUser(null);
    // TODO: Firebase Authentication — signOut(auth)
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, login, register, loginWithGoogle, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
