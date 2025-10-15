import { useState, useEffect, useRef } from 'react';
import { getIssues, resolveIssue } from '../services/api';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

const IssuesList = ({ showResolved = false }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState({});
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const mountedRef = useRef(true);
  
  // Polling interval in milliseconds (default: 5 seconds for issues)
  const POLL_INTERVAL = parseInt(import.meta.env.VITE_SYNC_INTERVAL) || 5000;

  useEffect(() => {
    mountedRef.current = true;
    loadIssues();
    
    return () => {
      mountedRef.current = false;
    };
  }, [showResolved]);

  // Real-time sync: Poll for issue changes
  useEffect(() => {
    if (loading) return;

    const pollInterval = setInterval(async () => {
      if (mountedRef.current) {
        try {
          setSyncing(true);
          const data = await getIssues(showResolved);
          if (mountedRef.current) {
            setIssues(data.issues || []);
          }
        } catch (err) {
          // Silent fail
          console.error('Background sync failed:', err);
        } finally {
          if (mountedRef.current) {
            setSyncing(false);
          }
        }
      }
    }, POLL_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [showResolved, loading, POLL_INTERVAL]);

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

  if (loading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner message="Loading issues..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* Sync Indicator - inline at top */}
      {syncing && (
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 border-2 border-pastel-blue border-t-transparent rounded-full animate-spin"></div>
          <span>Syncing with database...</span>
        </div>
      )}

      {issues.length === 0 ? (
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
    </>
  );
};

export default IssuesList;
