import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Set default persistence to SESSION (clears when browser closes, but persists on refresh)
// Individual login methods will override this if "Remember Me" is checked
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log('Firebase auth default persistence set to SESSION');
  })
  .catch((error) => {
    console.error('Error setting Firebase persistence:', error);
  });

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;

