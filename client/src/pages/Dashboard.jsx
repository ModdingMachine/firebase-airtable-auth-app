import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ParentPortal from './ParentPortal';
import EducatorPortal from './EducatorPortal';
import AdminPortal from './AdminPortal';
import ITPortal from './ITPortal';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { currentUser, userProfile, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for Firebase to finish checking for existing session
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  // Show error if there's an authentication error
  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading while Firebase checks for existing session OR while fetching profile
  if (loading || !userProfile) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  // Route to the appropriate portal based on role
  switch (userProfile.role) {
    case 'Admin':
      return <AdminPortal />;
    case 'IT':
      return <ITPortal />;
    case 'Educator':
      return <EducatorPortal />;
    case 'Parent':
    default:
      return <ParentPortal />;
  }
};

export default Dashboard;

