import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Input from '../components/Input';
import BackgroundBlobs from '../components/BackgroundBlobs';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/profile');
    } catch (err) {
      console.error('Signup error:', err);
      
      // Check for specific Firebase error codes
      const errorCode = err.code;
      
      if (errorCode === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please log in instead.');
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
      setLoading(true);
      await signInWithGoogle();
      navigate('/profile');
    } catch (err) {
      setError('Failed to sign up with Google.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-bg flex items-center justify-center p-4">
      <BackgroundBlobs />
      
      <GlassCard className="w-full max-w-md p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tighter text-center">
          Create Account
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign up to get started
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
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

        <form onSubmit={handleEmailSignup}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
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
  );
};

export default SignupPage;

