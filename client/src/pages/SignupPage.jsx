import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../config/firebase';
import { fetchSignInMethodsForEmail, setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Input from '../components/Input';
import BackgroundBlobs from '../components/BackgroundBlobs';
import AuthLoading from '../components/AuthLoading';

const SignupPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Prefill email if redirected from login page
  useEffect(() => {
    if (location.state?.fromLogin) {
      setEmail(location.state.prefillEmail || '');
      setShowRedirectMessage(true);
      
      // Clear the message after 5 seconds
      const timer = setTimeout(() => setShowRedirectMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number (supports multiple formats)
  const isValidPhone = (phone) => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if it's a valid length (10-15 digits for international numbers)
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return false;
    }
    
    // Common phone formats:
    // (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
    // +1 123 456 7890, +1-123-456-7890, etc.
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    
    // Validate email format
    if (!isValidEmail(email)) {
      return setError('Please enter a valid email address (e.g., user@domain.com)');
    }

    // Validate phone format (only if phone is provided)
    if (phone && !isValidPhone(phone)) {
      return setError('Please enter a valid phone number (e.g., (123) 456-7890 or +1-123-456-7890)');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      
      // Default to session persistence for new signups (clears when browser closes)
      await setPersistence(auth, browserSessionPersistence);
      console.log('Persistence set to SESSION for new signup');
      
      await signup(email, password);
      
      // Store additional profile info in localStorage temporarily
      // This will be synced to Airtable on first login
      if (displayName) {
        localStorage.setItem('pendingDisplayName', displayName);
      }
      if (phone) {
        localStorage.setItem('pendingPhone', phone);
      }
      
      // Set session timestamp for new account
      localStorage.setItem('sessionTimestamp', Date.now().toString());
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      
      // Check for specific Firebase error codes
      const errorCode = err.code;
      
      if (errorCode === 'auth/email-already-in-use') {
        // Check what sign-in method the existing account uses
        try {
          const signInMethods = await fetchSignInMethodsForEmail(auth, email);
          
          if (signInMethods.includes('google.com')) {
            setError('GOOGLE_ACCOUNT_EXISTS');
          } else if (signInMethods.includes('password')) {
            setError('EMAIL_ACCOUNT_EXISTS');
          } else {
            setError('An account with this email already exists. Please log in instead.');
          }
        } catch (checkError) {
          console.error('Error checking sign-in methods:', checkError);
          setError('An account with this email already exists. Please log in instead.');
        }
      } else if (errorCode === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else if (errorCode === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError('Failed to create an account. ' + (err.message || 'Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError('');
      setGoogleLoading(true);
      
      // Google signup always uses LOCAL persistence (stays logged in)
      await setPersistence(auth, browserLocalPersistence);
      console.log('Persistence set to LOCAL for Google signup');
      
      await signInWithGoogle();
      
      // Set session timestamp for new account
      localStorage.setItem('sessionTimestamp', Date.now().toString());
      localStorage.setItem('googleAuth', 'true');
      
      // Wait for the bootstrap to complete (account creation in Airtable)
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/dashboard');
    } catch (err) {
      console.error('Google signup error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-up cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please enable pop-ups for this site.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email. Try signing in with email/password.');
      } else {
        setError('Failed to sign up with Google. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      {googleLoading && <AuthLoading message="Creating your account..." />}
      
      <div className="min-h-screen bg-pastel-bg flex items-center justify-center p-4">
        <BackgroundBlobs />
      
      <GlassCard className="w-full max-w-md p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tighter text-center">
          Create Account
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign up to get started
        </p>

        {showRedirectMessage && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-2xl">
            <p className="font-bold">Account not found</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-2xl">
            {error === 'GOOGLE_ACCOUNT_EXISTS' ? (
              <>
                <p className="font-bold mb-2">Account Found</p>
                <p className="mb-4">This email is already registered with a Google account. Please sign in with Google instead.</p>
                <Button
                  onClick={handleGoogleSignup}
                  variant="primary"
                  fullWidth
                  disabled={googleLoading}
                  className="mb-0"
                >
                  <svg className="w-5 h-5 inline mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {googleLoading ? 'Signing in...' : 'Sign in with Google'}
                </Button>
              </>
            ) : error === 'EMAIL_ACCOUNT_EXISTS' ? (
              <div className="bg-red-100 border border-red-400 text-red-700 rounded-2xl p-4 -m-4">
                <p className="font-bold mb-2">Account Already Exists</p>
                <p className="mb-3">An account with this email already exists. Please log in with your password.</p>
                <Link 
                  to="/login" 
                  className="inline-block px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 font-bold"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 rounded-2xl p-4 -m-4">
                <p className="font-bold mb-1">Sign Up Failed</p>
                <p>{error}</p>
                {error.includes('already exists') && (
                  <Link 
                    to="/login" 
                    className="inline-block mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 font-bold"
                  >
                    Go to Login
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleEmailSignup}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@domain.com"
            required
            disabled={loading}
          />

          <Input
            label="Display Name (Optional)"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="John Doe"
            disabled={loading}
          />

          <Input
            label="Phone Number (Optional)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(123) 456-7890"
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            fullWidth
            className="mb-4"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/50 text-gray-600 rounded-full">Or continue with</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleSignup}
          variant="secondary"
          disabled={loading}
          fullWidth
          className="mb-6"
        >
          <svg className="w-5 h-5 inline mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </Button>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-pastel-blue hover:underline font-bold">
            Sign in
          </Link>
        </p>
      </GlassCard>
    </div>
    </>
  );
};

export default SignupPage;

