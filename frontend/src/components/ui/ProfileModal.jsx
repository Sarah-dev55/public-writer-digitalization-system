import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ProfileModal = ({ open, onClose, user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: ''
  });

  // Auto-populate form data whenever user data changes or modal opens
  useEffect(() => {
    if (user && open) {
      console.log('User data:', user); // Debug log
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        location: user.location || ''
      });
      // Clear any previous errors when modal opens
      setError('');
      setMessage('');
    }
  }, [user, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      console.log('Sending update request with token:', token.substring(0, 20) + '...'); // Debug

      const response = await fetch('http://localhost:5070/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle token errors specifically
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || 'Update failed');
      }

      setMessage('Profile updated successfully!');
      
      // Update user in localStorage
      const updatedUser = data.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Notify parent component
      if (onUpdate) {
        onUpdate(updatedUser);
      }

      setTimeout(() => {
        setIsEditing(false);
        setMessage('');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to update profile');
      
      // If session expired, redirect to login after showing error
      if (err.message.includes('Session expired') || err.message.includes('login again')) {
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      location: user?.location || ''
    });
    setIsEditing(false);
    setError('');
    setMessage('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getInitials = () => {
    if (!user) return '??';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || '??';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-10">
      <Card className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            
            {/* Left Sidebar */}
            <div className="w-full md:w-64 bg-gray-50 p-6 border-r relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light"
              >
                ✕
              </button>

              {/* User Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-app-primary text-white flex items-center justify-center text-2xl font-bold mb-3">
                  {getInitials()}
                </div>
                <h3 className="font-semibold text-lg text-center">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-gray-600 text-center">{user?.email}</p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {/* My Profile - Always Active */}
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-app-primary text-white rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>My Profile</span>
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Log Out */}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Log Out</span>
                </button>
              </nav>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-16 h-16 rounded-full bg-app-primary text-white flex items-center justify-center text-xl font-bold">
                    {getInitials()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              {message && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {message}
                </div>
              )}

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name - Auto-populated from signup */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                    required
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name - Auto-populated from signup */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                    required
                    placeholder="Enter last name"
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email account
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Mobile Number - Auto-populated from signup */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                    required
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="City, Country"
                    className="w-full p-3 border rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  {!isEditing ? (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-app-primary hover:opacity-90"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-app-primary hover:opacity-90"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileModal;