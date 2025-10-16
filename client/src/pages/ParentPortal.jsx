import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import SyncIndicator from '../components/SyncIndicator';
import SubmitTicket from '../components/SubmitTicket';

const ParentPortal = () => {
  const { currentUser, userProfile, logout, syncing, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        navigate('/login');
      } else if (userProfile && userProfile.role !== 'Parent') {
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
          Parent Portal
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
          Access your child's information, track progress, and stay connected with educators.
        </p>
      </GlassCard>

      {/* Dashboard Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-pastel-blue rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Children</h3>
            <p className="text-gray-600">View and manage your children's profiles</p>
          </div>
          <Button variant="secondary" fullWidth>View Children</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-pastel-pink rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Progress Reports</h3>
            <p className="text-gray-600">Track your child's development and achievements</p>
          </div>
          <Button variant="secondary" fullWidth>View Reports</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-light-pastel-blue rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Events Calendar</h3>
            <p className="text-gray-600">Stay updated on upcoming events and activities</p>
          </div>
          <Button variant="secondary" fullWidth>View Calendar</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-pastel-blue rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Messages</h3>
            <p className="text-gray-600">Communicate with educators and staff</p>
          </div>
          <Button variant="secondary" fullWidth>View Messages</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-pastel-pink rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Billing</h3>
            <p className="text-gray-600">View invoices and payment history</p>
          </div>
          <Button variant="secondary" fullWidth>View Billing</Button>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <div className="w-12 h-12 bg-light-pastel-blue rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Documents</h3>
            <p className="text-gray-600">Access forms, policies, and important documents</p>
          </div>
          <Button variant="secondary" fullWidth>View Documents</Button>
        </GlassCard>
      </div>

      {/* Submit IT Ticket Section */}
      <div className="w-full max-w-6xl mt-6">
        <SubmitTicket />
      </div>
    </div>
  );
};

export default ParentPortal;

