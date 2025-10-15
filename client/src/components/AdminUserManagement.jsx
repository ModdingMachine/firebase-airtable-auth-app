import { useState } from 'react';
import { searchUsers, updateUserAsAdmin } from '../services/api';
import GlassCard from './GlassCard';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const AdminUserManagement = ({ currentUserUid }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    displayName: '',
    phone: '',
    role: 'Parent',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      setError('');
      setSuccess('');
      const data = await searchUsers(searchQuery);
      setSearchResults(data.users || []);
      
      if (data.users.length === 0) {
        setError('No users found matching your search');
      }
    } catch (err) {
      setError('Search failed: ' + err.message);
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleEditClick = (user) => {
    if (user.uid === currentUserUid) {
      setError('You cannot edit your own profile from here. Use the My Profile page.');
      return;
    }
    
    setEditingUser(user);
    setEditForm({
      displayName: user.displayName || '',
      phone: user.phone || '',
      role: user.role || 'Parent',
    });
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ displayName: '', phone: '', role: 'Parent' });
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await updateUserAsAdmin(editingUser.uid, editForm);
      
      // Update the user in search results
      setSearchResults((prev) =>
        prev.map((u) =>
          u.uid === editingUser.uid
            ? { ...u, ...editForm }
            : u
        )
      );
      
      setSuccess(`Successfully updated ${editForm.displayName}'s profile`);
      setEditingUser(null);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update user: ' + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const roleOptions = [
    { value: 'Parent', label: 'Parent' },
    { value: 'Educator', label: 'Educator' },
    { value: 'Admin', label: 'Admin' },
    { value: 'IT', label: 'IT' },
  ];

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <GlassCard className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Users</h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={searching}
            className="flex-1"
          />
          <Button type="submit" variant="primary" disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </GlassCard>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-2xl">
          {success}
        </div>
      )}

      {/* Edit Form Modal */}
      {editingUser && (
        <GlassCard className="p-6 border-4 border-pastel-blue">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Edit User: {editingUser.email}
          </h2>
          
          <form onSubmit={handleSaveUser}>
            <Input
              label="Display Name"
              type="text"
              name="displayName"
              value={editForm.displayName}
              onChange={handleInputChange}
              disabled={saving}
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={editForm.phone}
              onChange={handleInputChange}
              disabled={saving}
            />

            <Select
              label="Role"
              name="role"
              value={editForm.role}
              onChange={handleInputChange}
              options={roleOptions}
              disabled={saving}
            />

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
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && !editingUser && (
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Search Results ({searchResults.length})
          </h2>
          <div className="space-y-3">
            {searchResults.map((user) => (
              <div
                key={user.uid}
                className="p-4 bg-white/40 rounded-2xl flex justify-between items-center hover:bg-white/60 transition-colors duration-200"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{user.displayName}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-600">
                    <span>Role: <span className="font-semibold">{user.role}</span></span>
                    {user.phone && <span>Phone: {user.phone}</span>}
                  </div>
                </div>
                <Button
                  variant={user.uid === currentUserUid ? 'secondary' : 'primary'}
                  onClick={() => handleEditClick(user)}
                  disabled={user.uid === currentUserUid}
                >
                  {user.uid === currentUserUid ? 'You' : 'Edit'}
                </Button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default AdminUserManagement;

