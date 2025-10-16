import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile } from '../services/api';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
  const { currentUser, userProfile, logout, fetchUserProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    role: 'Parent',
  });

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
      return;
    }

    loadProfile();
  }, [currentUser, navigate, authLoading]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProfile();
      
      setFormData({
        displayName: data.user.displayName || '',
        phone: data.user.phone || '',
        role: data.user.role || 'Parent',
      });
    } catch (err) {
      setError('Failed to load profile. ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Only send displayName and phone - role cannot be changed by users
      await updateProfile({
        displayName: formData.displayName,
        phone: formData.phone,
      });
      await fetchUserProfile(); // Refresh the profile in context
      
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile. ' + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      
      <GlassCard className="w-full max-w-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tighter">
            My Profile
          </h1>
          <Button
            onClick={handleLogout}
            variant="danger"
          >
            Logout
          </Button>
        </div>

        <div className="mb-6 p-4 bg-white/50 rounded-2xl">
          <p className="text-sm text-gray-600">Signed in as</p>
          <p className="text-lg font-bold text-gray-800">{currentUser?.email}</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-2xl">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Display Name"
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            placeholder="John Doe"
            disabled={saving}
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
            disabled={saving}
          />

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Role
            </label>
            <div className="w-full px-5 py-3 bg-gray-100 border-2 border-gray-300 rounded-2xl text-gray-600 cursor-not-allowed">
              {formData.role}
            </div>
            <p className="mt-1 text-xs text-gray-500">Role cannot be changed by users</p>
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              fullWidth
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={loadProfile}
              disabled={saving}
            >
              Reset
            </Button>
          </div>
        </form>

        {userProfile && (
          <div className="mt-8 p-4 bg-white/30 rounded-2xl">
            <p className="text-sm text-gray-600 mb-2">Last updated</p>
            <p className="text-gray-800">
              {userProfile.updatedAt 
                ? new Date(userProfile.updatedAt).toLocaleString()
                : 'Never'}
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default ProfilePage;

