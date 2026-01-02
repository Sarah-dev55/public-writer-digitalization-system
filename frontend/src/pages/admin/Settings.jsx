import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/layout/AdminHeader';
import AdminSidebar from '../../components/layout/AdminSidebar';
import useAuth from '../../hooks/useAuth';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import { updateCurrentUserProfile, changePassword } from '../../services/userService';

// Admin settings page - update profile and change password
export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile form data
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  // Password change form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Initialize profile data from current user
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateCurrentUserProfile(profileData);
      
      if (response.success) {
        if (updateProfile) {
          await updateProfile(response.data);
        }
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-accent">
      <AdminHeader title="Settings" breadcrumb={["Homepage", "Settings"]} />

      <div className="pt-20 lg:pl-64">
        <AdminSidebar />

        <main className="p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-app-primary">Settings</h2>
            <p className="text-lg text-app-primary/70 mt-2">Manage your account settings and preferences</p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-app-secondary/20 border border-app-secondary rounded-lg">
              <p className="text-app-secondary font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md border border-app-primary/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-app-secondary/20 rounded-lg">
                  <User className="w-6 h-6 text-app-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-app-primary">Profile Information</h3>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-app-primary mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-primary/40" />
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-4 py-2 border border-app-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-secondary focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-app-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-primary/40" />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-4 py-2 border border-app-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-secondary focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-app-primary mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-primary/40" />
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-4 py-2 border border-app-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-secondary focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-app-secondary hover:bg-app-secondary/80 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-app-primary/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-app-secondary/20 rounded-lg">
                  <Lock className="w-6 h-6 text-app-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-app-primary">Change Password</h3>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-app-primary mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-primary/40" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 border border-app-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-secondary focus:border-transparent"
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-app-primary mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-primary/40" />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 border border-app-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-secondary focus:border-transparent"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-app-primary mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-primary/40" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 border border-app-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-secondary focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-app-primary hover:bg-app-primary/80 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-5 h-5" />
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-app-primary/10 p-6">
              <h3 className="text-xl font-semibold text-app-primary mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-app-primary/10">
                  <span className="text-app-primary/70">Role</span>
                  <span className="font-medium text-app-primary capitalize">{user?.role || 'Admin'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-app-primary/10">
                  <span className="text-app-primary/70">Account Status</span>
                  <span className="px-3 py-1 bg-app-secondary/20 text-app-secondary rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-app-primary/70">Member Since</span>
                  <span className="font-medium text-app-primary">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
