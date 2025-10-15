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
  const [syncing, setSyncing] = useState(false);
  
  // Polling interval in milliseconds (default: 10 seconds)
  const POLL_INTERVAL = parseInt(import.meta.env.VITE_SYNC_INTERVAL) || 10000;
  
  // Session timeout: 5 minutes in milliseconds
  const SESSION_TIMEOUT = 5 * 60 * 1000;

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
      
      // Clear all cached session data
      localStorage.removeItem('sessionTimestamp');
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('googleAuth');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Check if session is still valid (within 5 minutes)
  const isSessionValid = () => {
    const sessionTimestamp = localStorage.getItem('sessionTimestamp');
    if (!sessionTimestamp) return false;
    
    const timeSinceLogin = Date.now() - parseInt(sessionTimestamp);
    return timeSinceLogin < SESSION_TIMEOUT;
  };

  // Bootstrap or get user profile from Airtable
  const fetchUserProfile = async (silent = false) => {
    try {
      if (!silent) setSyncing(true);
      const data = await bootstrapUser();
      
      // Check for pending profile updates from signup
      const pendingDisplayName = localStorage.getItem('pendingDisplayName');
      const pendingPhone = localStorage.getItem('pendingPhone');
      
      if (pendingDisplayName || pendingPhone) {
        console.log('Syncing pending profile information to Airtable...');
        try {
          const { updateProfile } = await import('../services/api');
          const updateData = {};
          if (pendingDisplayName) updateData.displayName = pendingDisplayName;
          if (pendingPhone) updateData.phone = pendingPhone;
          
          const updatedProfile = await updateProfile(updateData);
          
          // Clear pending data
          localStorage.removeItem('pendingDisplayName');
          localStorage.removeItem('pendingPhone');
          
          setUserProfile(updatedProfile.user);
          console.log('Profile information synced successfully');
          return updatedProfile.user;
        } catch (updateErr) {
          console.error('Failed to sync pending profile info:', updateErr);
          // Continue with regular flow if update fails
        }
      }
      
      // Check if profile actually changed
      const hasChanged = !userProfile || 
        userProfile.role !== data.user.role ||
        userProfile.displayName !== data.user.displayName ||
        userProfile.phone !== data.user.phone;
      
      if (hasChanged && !silent) {
        console.log('User profile updated:', data.user.email);
      }
      
      setUserProfile(data.user);
      return data.user;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      if (!silent) {
        setError(err.message);
        throw err;
      }
    } finally {
      if (!silent) setSyncing(false);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // User is signed in, fetch/create their profile from Airtable
        try {
          // Update session timestamp if session is still valid or user just logged in
          if (isSessionValid() || !localStorage.getItem('sessionTimestamp')) {
            localStorage.setItem('sessionTimestamp', Date.now().toString());
          }
          
          await fetchUserProfile();
          console.log('User profile synced with Airtable');
        } catch (err) {
          console.error('Failed to sync user profile:', err);
          // Don't block the UI if Airtable sync fails
        }
      } else {
        // User is signed out - check if we should maintain the session
        const shouldMaintainSession = isSessionValid();
        
        if (shouldMaintainSession) {
          console.log('Session still valid, maintaining login state');
          // Session is valid, but user object is null - this shouldn't happen normally
          // Firebase will restore the session automatically
        } else {
          // Clear session data if timeout exceeded
          localStorage.removeItem('sessionTimestamp');
          setUserProfile(null);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Real-time sync: Poll for profile changes when user is logged in
  useEffect(() => {
    if (!currentUser || loading) return;

    console.log(`🔄 Real-time sync enabled (polling every ${POLL_INTERVAL / 1000}s)`);

    const pollInterval = setInterval(async () => {
      try {
        await fetchUserProfile(true); // Silent fetch
      } catch (err) {
        // Silent fail - don't disrupt user experience
        console.error('Background sync failed:', err);
      }
    }, POLL_INTERVAL);

    return () => {
      console.log('🔄 Real-time sync disabled');
      clearInterval(pollInterval);
    };
  }, [currentUser, loading, POLL_INTERVAL]);

  // Session management: Update timestamp on user activity
  useEffect(() => {
    if (!currentUser) return;

    const updateSessionTimestamp = () => {
      if (isSessionValid()) {
        localStorage.setItem('sessionTimestamp', Date.now().toString());
      }
    };

    // Update timestamp on various user interactions
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    // Throttle updates to avoid excessive localStorage writes
    let lastUpdate = Date.now();
    const throttleDelay = 30000; // Update at most once every 30 seconds

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastUpdate > throttleDelay) {
        updateSessionTimestamp();
        lastUpdate = now;
      }
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [currentUser]);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    syncing,
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

