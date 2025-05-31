import React, { createContext, useContext, useState, useEffect } from 'react';
// Make sure this path matches your firebase config file
import { auth } from '../firebase'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    console.log('Signup function called with:', email); // Debug log
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    console.log('Login function called with:', email); // Debug log
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  console.log('AuthContext value:', value); // Debug log

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}