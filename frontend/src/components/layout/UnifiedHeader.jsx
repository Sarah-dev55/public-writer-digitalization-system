import { MenuIcon, MailIcon, PhoneIcon } from "lucide-react";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { CONTACT_EMAIL, CONTACT_PHONE } from "../../constants/contact";
import { AuthContext } from "../../context/AuthContext";
import ProfileModal from "../ui/ProfileModal";
import LanguageSwitcher from "../common/LanguageSwitcher";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const contactInfo = [
  {
    icon: MailIcon,
    text: CONTACT_EMAIL,
  },
  {
    icon: PhoneIcon,
    text: CONTACT_PHONE,
  },
];

export const UnifiedHeader = ({
  navItems = [],
  logoImage = "/assets/images/Logo.png",
  logoOnClick,
  ctaButtonText = "Get a Quote",
  ctaButtonOnClick,
  className = "",
  navClassName = "",
  contactBarClassName = "",
  showUser = false,
  user = null,
  showCtaButton = true, // New prop to control CTA button visibility
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { requireAuth, isAuthenticated, logout, updateProfile, reloadUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scrolling to hash after navigation
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Small delay to ensure page is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      // Hash link on current page - scroll to element
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href.includes("#")) {
      // Path with hash (e.g., "/#home") - navigate to path with hash
      navigate(href);
    } else if (href.startsWith("/")) {
      // Regular path - navigate
      navigate(href);
    }
  };

  const handleCtaClick = () => {
    if (isAuthenticated) {
      // If authenticated, directly execute the action
      if (ctaButtonOnClick) {
        ctaButtonOnClick();
      } else {
        window.location.href = "/client/dashboard";
      }
    } else {
      // If not authenticated, require auth first
      if (ctaButtonOnClick) {
        requireAuth(() => ctaButtonOnClick());
      } else {
        requireAuth(() => (window.location.href = "/client/dashboard"));
      }
    }
  };

  // Helper function to get user initials
  const getUserInitials = (name) => {
    if (!name) return "?";
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className={`w-full flex flex-col relative ${className}`}>
      {/* Top Contact Bar */}
      <div className={`w-full px-4 sm:px-6 py-3 sm:py-4 ${contactBarClassName || 'bg-app-primary'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-center gap-2">
                  <contact.icon className="w-4 h-4 sm:w-5 sm:h-5 text-app-accent flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-app-text-muted">
                    {contact.text}
                  </span>
                </div>
              ))}
            </div>
            
            {/* User Info (Top Right) */}
            {showUser && user && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (reloadUser) reloadUser();
                    setProfileModalOpen(true);
                  }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-app-primary overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-app-accent transition-all"
                  aria-label="View Profile"
                >
                  <div className="w-full h-full flex items-center justify-center bg-app-primary text-app-accent font-semibold text-xs sm:text-sm">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage.startsWith('http') ? user.profileImage : `${API_BASE.replace('/api', '')}${user.profileImage}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getUserInitials(user.fullName || user.name || user.fullname)
                    )}
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className={`w-full bg-transparent border-b border-white/10 px-6 sm:px-8 py-4 sm:py-6 ${navClassName}`}>
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-8">
          {/* Logo */}
          <img
            className="w-24 sm:w-32 h-auto object-contain flex-shrink-0 cursor-pointer"
            alt="Company Logo"
            src={logoImage}
            onClick={logoOnClick || (() => handleNavClick("#home"))}
          />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center gap-8 flex-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.href)}
                className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                  item.active ? "text-app-text-light" : "text-app-text-muted hover:text-app-text-light"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Buttons - Desktop */}
          {showCtaButton && (
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <LanguageSwitcher />
              <Button 
                onClick={handleCtaClick} 
                className="px-6 py-2 sm:px-8 sm:py-3 bg-app-accent hover:bg-app-accent/90 rounded-full h-auto text-xs sm:text-sm font-semibold text-app-primary"
              >
                {ctaButtonText}
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 text-app-text-light hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(item.href)}
                  className="text-sm font-semibold text-app-text-muted hover:text-app-text-light transition-colors text-left cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <div className="py-2 border-t border-white/10">
                <LanguageSwitcher />
              </div>
              {showCtaButton && (
                <Button 
                  onClick={handleCtaClick} 
                  className="w-full px-6 py-2 bg-app-accent hover:bg-app-accent/90 rounded-full h-auto text-xs font-semibold text-app-primary mt-2"
                >
                  {ctaButtonText}
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Profile Modal */}
      {showUser && user && (
        <ProfileModal
          open={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={user}
          onUpdate={async (updatedData) => {
            await updateProfile(updatedData);
            setProfileModalOpen(false);
          }}
          reloadUser={reloadUser}
          onLogout={() => {
            if (logout) {
              logout();
            }
            navigate("/");
          }}
        />
      )}
    </header>
  );
};

export default UnifiedHeader;

