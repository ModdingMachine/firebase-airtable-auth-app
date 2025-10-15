import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import BackgroundBlobs from '../components/BackgroundBlobs';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminUserManagement from '../components/AdminUserManagement';
import IssuesList from '../components/IssuesList';
import SyncIndicator from '../components/SyncIndicator';

const AdminPortal = () => {
  const { currentUser, userProfile, logout, syncing, loading } = useAuth();
  const navigate = useNavigate();
  const [showErrorLogs, setShowErrorLogs] = useState(false);
  const [showResolvedIssues, setShowResolvedIssues] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        navigate('/login');
      } else if (userProfile && userProfile.role !== 'Admin') {
        navigate('/dashboard');
      }
    }
  }, [currentUser, userProfile, navigate, loading]);

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

  return (
    <div className="min-h-screen bg-pastel-bg flex flex-col items-center p-4">
      <BackgroundBlobs />
      <SyncIndicator syncing={syncing} />
      
      {/* Header */}
      <div className="w-full max-w-6xl mt-8 mb-6 flex justify-between items-center z-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tighter">
          Admin Portal
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
          Manage users, configure system settings, and oversee all operations.
        </p>
      </GlassCard>

      {/* User Management Section */}
      <div className="w-full max-w-6xl mb-6">
        <AdminUserManagement currentUserUid={userProfile.uid} />
      </div>

      {/* Error Logs Section (Toggleable) */}
      <div className="w-full max-w-6xl mb-6">
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">System Error Logs</h2>
              <button
                onClick={() => setShowErrorLogs(!showErrorLogs)}
                className="px-4 py-2 bg-pastel-blue hover:bg-pastel-pink rounded-full transition-colors duration-200 font-semibold text-gray-800"
              >
                {showErrorLogs ? 'Hide' : 'Show'}
              </button>
            </div>
            {showErrorLogs && (
              <Button
                onClick={() => setShowResolvedIssues(!showResolvedIssues)}
                variant="secondary"
              >
                {showResolvedIssues ? 'Show Open Only' : 'Show All'}
              </Button>
            )}
          </div>
          
          {showErrorLogs && (
            <div className="mt-4">
              <IssuesList showResolved={showResolvedIssues} />
            </div>
          )}
        </GlassCard>
      </div>

      {/* Admin Dashboard Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-pastel-blue rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Reports</h3>
            <p className="text-gray-600">View system-wide analytics and reports</p>
          </div>
          <Button variant="secondary" fullWidth>View Reports</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-pastel-pink rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Settings</h3>
            <p className="text-gray-600">Configure system settings and preferences</p>
          </div>
          <Button variant="secondary" fullWidth>Open Settings</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-light-pastel-blue rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Activity Logs</h3>
            <p className="text-gray-600">Monitor system activity and user actions</p>
          </div>
          <Button variant="secondary" fullWidth>View Logs</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-pastel-blue rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Announcements</h3>
            <p className="text-gray-600">Send system-wide announcements</p>
          </div>
          <Button variant="secondary" fullWidth>Create Announcement</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-pastel-pink rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Security</h3>
            <p className="text-gray-600">Manage security settings and permissions</p>
          </div>
          <Button variant="secondary" fullWidth>Security Settings</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-light-pastel-blue rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Database</h3>
            <p className="text-gray-600">Manage database backups and maintenance</p>
          </div>
          <Button variant="secondary" fullWidth>Database Tools</Button>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminPortal;

