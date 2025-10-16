import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getIssues, resolveIssue } from '../services/api';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import SyncIndicator from '../components/SyncIndicator';

const ITPortal = () => {
  const { currentUser, userProfile, logout, syncing: profileSyncing, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState({});
  const [showResolved, setShowResolved] = useState(false);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const mountedRef = useRef(true);
  
  // Polling interval in milliseconds
  const POLL_INTERVAL = parseInt(import.meta.env.VITE_SYNC_INTERVAL) || 5000;

  useEffect(() => {
    mountedRef.current = true;
    
    if (!authLoading) {
      if (!currentUser) {
        navigate('/login');
      } else if (userProfile && userProfile.role !== 'IT') {
        navigate('/dashboard');
      } else if (userProfile) {
        loadIssues();
      }
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [currentUser, userProfile, navigate, showResolved, authLoading]);

  // Real-time sync: Poll for issue changes
  useEffect(() => {
    if (loading || !userProfile) return;

    const pollInterval = setInterval(async () => {
      if (mountedRef.current) {
        try {
          setSyncing(true);
          const data = await getIssues(showResolved);
          if (mountedRef.current) {
            setIssues(data.issues || []);
          }
        } catch (err) {
          console.error('Background sync failed:', err);
        } finally {
          if (mountedRef.current) {
            setSyncing(false);
          }
        }
      }
    }, POLL_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [showResolved, loading, userProfile, POLL_INTERVAL]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getIssues(showResolved);
      setIssues(data.issues || []);
    } catch (err) {
      setError('Failed to load issues: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (issueId) => {
    try {
      setResolving({ ...resolving, [issueId]: true });
      await resolveIssue(issueId);
      
      // Remove from list
      setIssues(issues.filter(issue => issue.id !== issueId));
    } catch (err) {
      setError('Failed to resolve issue: ' + err.message);
      console.error(err);
    } finally {
      setResolving({ ...resolving, [issueId]: false });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (!userProfile) {
    return <LoadingSpinner message="Loading portal..." />;
  }

  const unresolvedCount = issues.filter(i => !i.resolved).length;

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <SyncIndicator syncing={syncing || profileSyncing} />
      
      {/* Header */}
      <div className="w-full max-w-6xl mt-8 mb-6 flex justify-between items-center z-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tighter">
          IT Portal
        </h1>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/profile')} variant="secondary">
            My Profile
          </Button>
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </div>
      </div>

      {/* Welcome Card */}
      <GlassCard className="w-full max-w-6xl p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome, {userProfile.displayName}!
        </h2>
        <p className="text-lg text-gray-600">
          Manage and resolve system issues reported by users.
        </p>
      </GlassCard>

      {/* Stats Card */}
      <div className="w-full max-w-6xl mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 text-center">
          <div className="text-4xl font-extrabold text-pastel-blue mb-2">
            {unresolvedCount}
          </div>
          <p className="text-gray-600 font-semibold">Open Issues</p>
        </GlassCard>

        <GlassCard className="p-6 text-center">
          <div className="text-4xl font-extrabold text-pastel-pink mb-2">
            {issues.filter(i => i.resolved).length}
          </div>
          <p className="text-gray-600 font-semibold">Resolved Issues</p>
        </GlassCard>

        <GlassCard className="p-6 text-center">
          <div className="text-4xl font-extrabold text-light-pastel-blue mb-2">
            {issues.length}
          </div>
          <p className="text-gray-600 font-semibold">Total Issues</p>
        </GlassCard>
      </div>

      {/* Issues List */}
      <GlassCard className="w-full max-w-6xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {showResolved ? 'All Issues' : 'Open Issues'}
          </h2>
          <div className="flex items-center gap-3">
            {syncing && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-4 h-4 border-2 border-pastel-blue border-t-transparent rounded-full animate-spin"></div>
                <span>Syncing with database...</span>
              </div>
            )}
            <Button
              onClick={() => setShowResolved(!showResolved)}
              variant="secondary"
            >
              {showResolved ? 'Show Open Only' : 'Show All'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <LoadingSpinner message="Loading issues..." />
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {showResolved ? 'No Issues Found' : 'All Clear!'}
            </h3>
            <p className="text-gray-600">
              {showResolved 
                ? 'No issues have been reported yet.' 
                : 'There are no open issues at this time.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                  issue.resolved
                    ? 'bg-green-50/50 border-green-300'
                    : 'bg-white/40 border-red-300 hover:bg-white/60'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {issue.resolved ? (
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-800">
                        {issue.issue}
                      </h3>
                      {issue.resolved && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                          RESOLVED
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 whitespace-pre-wrap mb-3 ml-11">
                      {issue.description}
                    </p>
                    
                    {issue.createdAt && (
                      <p className="text-xs text-gray-500 ml-11">
                        Reported: {new Date(issue.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {!issue.resolved && (
                    <Button
                      onClick={() => handleResolve(issue.id)}
                      variant="primary"
                      disabled={resolving[issue.id]}
                    >
                      {resolving[issue.id] ? 'Resolving...' : 'Mark Resolved'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default ITPortal;

