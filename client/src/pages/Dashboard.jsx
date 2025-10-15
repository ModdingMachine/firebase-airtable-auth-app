import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ParentPortal from './ParentPortal';
import EducatorPortal from './EducatorPortal';
import AdminPortal from './AdminPortal';
import ITPortal from './ITPortal';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for Firebase to finish checking for existing session
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

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

