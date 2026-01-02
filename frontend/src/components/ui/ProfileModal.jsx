import React, { useState, useEffect } from "react";
import { X, User, Settings, Bell, LogOut, ChevronRight, Pencil } from "lucide-react";
import { Button } from "./button";
import { getErrorMessage } from "../../utils/errorUtils";
import { uploadProfileImage } from "../../services/userService";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ProfileModal = ({ open, onClose, user, onUpdate, onLogout, reloadUser }) => {
  const [activeView, setActiveView] = useState("profile"); // "profile" or "settings"
  const [isEditing, setIsEditing] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("Allow");
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("Light");
  const [language, setLanguage] = useState("Eng");

  // Fill the form with user info when the window opens
  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name || user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
      });
    }
  }, [user, open]);

  // Get the latest info from the server when the window opens
  useEffect(() => {
    if (open && user?.id || user?._id) {
      const fetchFreshData = async () => {
        setInitialLoading(true);
        try {
          if (reloadUser) {
            await reloadUser();
          }
        } catch (error) {
          console.error("Error fetching fresh user data:", error);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchFreshData();
    }
  }, [open, user?.id, user?._id]);

  if (!open) return null;

  // When the user clicks the save button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Wait a tiny bit to show the loading icon
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (onUpdate) {
        // Send the new info to the parent component
        const payload = { ...formData, fullName: formData.name };
        await onUpdate(payload);
      }
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error("Failed to update profile", error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // When the user types in a box
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
      });
    }
    setIsEditing(false);
  };

  // When the user logs out
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    onClose();
  };

  // When the user picks a new profile picture
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if the file is too big (max 5mb)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userId = user._id || user.id;
      // Send the picture to the server
      const res = await uploadProfileImage(userId, file);
      if (res.success) {
        if (onUpdate) {
          // Tell the rest of the app about the new picture
          await onUpdate(res.data);
        }
      }
    } catch (error) {
      console.error('Image upload failed', error);
      setError('Failed to upload profile image.');
    } finally {
      setLoading(false);
    }
  };

  // Get the first letters of the user's name
  const getUserInitials = (name) => {
    if (!name) return "?";
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      // Use first letter of first and last name
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
    // Use just the first letter
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 h-[85vh] overflow-hidden flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-app-primary transition-colors z-10 p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full min-h-0">
          {/* Left Sidebar */}
          <div className="w-full md:w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-5 flex flex-col flex-shrink-0">
            {/* User Info Section */}
            <div className="mb-6">
              <div className="w-20 h-20 rounded-full bg-app-primary overflow-hidden flex items-center justify-center mx-auto mb-4 shadow-lg ring-2 ring-app-accent/20">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage.startsWith('http') ? user.profileImage : `${API_BASE.replace('/api', '')}${user.profileImage}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-app-primary text-app-accent font-bold text-2xl">
                    {getUserInitials(user?.fullName || user?.name || user?.fullname)}
                  </div>
                )}
              </div>
              <h3 className="text-center font-semibold text-app-primary text-lg mb-1">
                {user?.name || user?.fullName || "Your name"}
              </h3>
              <p className="text-center text-sm text-gray-600">
                {user?.email || ""}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 mb-6"></div>

            {/* Navigation Menu */}
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveView("profile");
                  setIsEditing(false);
                }}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  activeView === "profile"
                    ? "bg-app-primary text-app-accent shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className={`w-5 h-5 ${activeView === "profile" ? "text-app-accent" : "text-gray-600"}`} />
                  <span className="font-medium">My Profile</span>
                </div>
                <ChevronRight className={`w-5 h-5 ${activeView === "profile" ? "text-app-accent" : "text-gray-400"}`} />
              </button>

              <button
                onClick={() => {
                  setActiveView("settings");
                  setIsEditing(false);
                }}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  activeView === "settings"
                    ? "bg-app-primary text-app-accent shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className={`w-5 h-5 ${activeView === "settings" ? "text-app-accent" : "text-gray-600"}`} />
                  <span className="font-medium">Settings</span>
                </div>
                <ChevronRight className={`w-5 h-5 ${activeView === "settings" ? "text-app-accent" : "text-gray-400"}`} />
              </button>

              {/* Notification with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 w-full text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Notification</span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{notificationStatus}</span>
                </button>
                {showNotificationDropdown && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                    <button
                      onClick={() => {
                        setNotificationStatus("Allow");
                        setShowNotificationDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-app-accent/20 transition-colors ${
                        notificationStatus === "Allow" ? "bg-app-accent/30 text-app-primary font-medium" : "text-gray-700"
                      }`}
                    >
                      Allow
                    </button>
                    <button
                      onClick={() => {
                        setNotificationStatus("Mute");
                        setShowNotificationDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-app-accent/20 transition-colors ${
                        notificationStatus === "Mute" ? "bg-app-accent/30 text-app-primary font-medium" : "text-gray-700"
                      }`}
                    >
                      Mute
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 mt-4 hover:shadow-sm"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Log Out</span>
              </button>
            </nav>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-white min-h-0">
            {activeView === "profile" ? (
              <div className="h-full">
                <h2 className="text-xl font-bold text-app-primary mb-6">My Profile</h2>

                {initialLoading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-10 h-10 border-4 border-app-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 animate-pulse">Fetching latest information...</p>
                  </div>
                ) : (
                  <>
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-app-primary overflow-hidden flex items-center justify-center shadow-lg ring-2 ring-app-accent/20">
                      {user?.profileImage ? (
                        <img 
                          src={user.profileImage.startsWith('http') ? user.profileImage : `${API_BASE.replace('/api', '')}${user.profileImage}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-app-primary text-app-accent font-bold text-2xl">
                          {getUserInitials(formData.name || user?.fullName || user?.name || user?.fullname)}
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <>
                        <input
                          type="file"
                          id="profileImageInput"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('profileImageInput').click()}
                          className="absolute bottom-0 right-0 w-6 h-6 bg-app-secondary rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-app-secondary/90 transition-colors"
                        >
                          <Pencil className="w-3 h-3 text-white" />
                        </button>
                      </>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-app-primary mb-1">
                      {formData.name || user?.name || user?.fullName || "Your name"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formData.email || user?.email || ""}
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-4">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-app-primary mb-2">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-app-primary transition-all text-sm"
                        placeholder="Enter your name"
                        required
                      />
                    ) : (
                      <p className="p-2 bg-app-accent/30 rounded-lg text-gray-700 border border-gray-200 text-sm">
                        {formData.name || user?.name || user?.fullName || ""}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-app-primary mb-2">
                      Email account
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-app-primary transition-all text-sm"
                        placeholder="Enter your email"
                        required
                      />
                    ) : (
                      <p className="p-2 bg-app-accent/30 rounded-lg text-gray-700 border border-gray-200 text-sm">
                        {formData.email || user?.email || ""}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-app-primary mb-2">
                      Mobile number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-app-primary transition-all text-sm"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="p-2 bg-app-accent/30 rounded-lg text-gray-700 border border-gray-200 text-sm">
                        {formData.phone || ""}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-app-primary mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-app-primary transition-all text-sm"
                        placeholder="Enter location"
                      />
                    ) : (
                      <p className="p-2 bg-app-accent/30 rounded-lg text-gray-700 border border-gray-200 text-sm">
                        {formData.location || ""}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    {isEditing ? (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleCancel}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="px-6 py-2 text-sm bg-app-primary hover:bg-app-primary/90 text-app-accent shadow-md hover:shadow-lg transition-all"
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save Change"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 text-sm bg-app-primary hover:bg-app-primary/90 text-app-accent shadow-md hover:shadow-lg transition-all"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </form>
                </>
                )}
              </div>
            ) : (
              <div className="h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-app-primary">Settings</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-app-primary mb-2">
                      Theme
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-app-primary bg-white transition-all text-sm"
                    >
                      <option value="Light">Light</option>
                      <option value="Dark">Dark</option>
                      <option value="Auto">Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-app-primary mb-2">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-app-primary bg-white transition-all text-sm"
                    >
                      <option value="Eng">English</option>
                      <option value="Fr">French</option>
                      <option value="Ar">Arabic</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

