import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import SyncIndicator from '../components/SyncIndicator';
import SubmitTicket from '../components/SubmitTicket';

const EducatorPortal = () => {
  const { currentUser, userProfile, logout, syncing, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        navigate('/login');
      } else if (userProfile && userProfile.role !== 'Educator') {
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
    <div className="min-h-screen flex flex-col items-center p-4">
      <SyncIndicator syncing={syncing} />
      
      {/* Header */}
      <div className="w-full max-w-6xl mt-8 mb-6 flex justify-between items-center z-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tighter">
          Educator Portal
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
          Manage your classroom, track student progress, and communicate with families.
        </p>
      </GlassCard>

      {/* Dashboard Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-pastel-blue rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">My Students</h3>
            <p className="text-gray-600">View and manage student information</p>
          </div>
          <Button variant="secondary" fullWidth>View Students</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-pastel-pink rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Attendance</h3>
            <p className="text-gray-600">Track daily attendance and absences</p>
          </div>
          <Button variant="secondary" fullWidth>Take Attendance</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-light-pastel-blue rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Progress Notes</h3>
            <p className="text-gray-600">Document student development and milestones</p>
          </div>
          <Button variant="secondary" fullWidth>Add Notes</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-pastel-blue rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Lesson Plans</h3>
            <p className="text-gray-600">Create and manage weekly lesson plans</p>
          </div>
          <Button variant="secondary" fullWidth>View Plans</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-pastel-pink rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Parent Communication</h3>
            <p className="text-gray-600">Message parents and families</p>
          </div>
          <Button variant="secondary" fullWidth>Send Messages</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-light-pastel-blue rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Photo Gallery</h3>
            <p className="text-gray-600">Share classroom moments with families</p>
          </div>
          <Button variant="secondary" fullWidth>Upload Photos</Button>
        </GlassCard>
      </div>

      {/* Submit IT Ticket Section */}
      <div className="w-full max-w-6xl mt-6">
        <SubmitTicket />
      </div>
    </div>
  );
};

export default EducatorPortal;

