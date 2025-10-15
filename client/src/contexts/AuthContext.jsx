import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { bootstrapUser } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign up with email and password
  const signup = async (email, password) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Account created successfully for:', email);
      // Bootstrap will be called by onAuthStateChanged
      return userCredential.user;
    } catch (err) {
      console.error('Signup error:', err.code, err.message);
      setError(err.message);
      throw err;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful for:', email);
      return userCredential.user;
    } catch (err) {
      console.error('Login error:', err.code, err.message);
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Google (automatically creates account if doesn't exist)
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful:', result.user.email);
      // The bootstrap will be automatically called by onAuthStateChanged
      // This creates an Airtable record if it doesn't exist
      return result.user;
    } catch (err) {
      console.error('Google sign-in error:', err.code, err.message);
      setError(err.message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Bootstrap or get user profile from Airtable
  const fetchUserProfile = async () => {
    try {
      const data = await bootstrapUser();
      console.log('User profile loaded:', data.user.email);
      setUserProfile(data.user);
      return data.user;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
      throw err;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // User is signed in, fetch/create their profile from Airtable
        try {
          await fetchUserProfile();
          console.log('User profile synced with Airtable');
        } catch (err) {
          console.error('Failed to sync user profile:', err);
          // Don't block the UI if Airtable sync fails
        }
      } else {
        // User is signed out
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signup,
    login,
    signInWithGoogle,
    logout,
    fetchUserProfile,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

