import { MenuIcon, MailIcon, PhoneIcon } from "lucide-react";
import React, { useState, useContext } from "react";
import { Button } from "../ui/button";
import { CONTACT_EMAIL, CONTACT_PHONE } from "../../constants/contact";
import { AuthContext } from "../../context/AuthContext";

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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { requireAuth } = useContext(AuthContext);

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href.startsWith("/")) {
      window.location.href = href;
    }
  };

  const handleCtaClick = () => {
    if (ctaButtonOnClick) {
      requireAuth(() => ctaButtonOnClick());
    } else {
      requireAuth(() => (window.location.href = "/dashboard"));
    }
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
                <div className="w-8 h-8 rounded-full bg-app-accent overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-app-primary text-app-accent font-semibold">
                      {user.name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <span className="text-xs sm:text-sm hidden md:block text-app-text-muted">
                  {user.name || "User"}
                </span>
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
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Button 
              onClick={handleCtaClick} 
              className="px-6 py-2 sm:px-8 sm:py-3 bg-app-accent hover:bg-app-accent/90 rounded-full h-auto text-xs sm:text-sm font-semibold text-app-primary"
            >
              {ctaButtonText}
            </Button>
          </div>

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
              <Button 
                onClick={handleCtaClick} 
                className="w-full px-6 py-2 bg-app-accent hover:bg-app-accent/90 rounded-full h-auto text-xs font-semibold text-app-primary mt-2"
              >
                {ctaButtonText}
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default UnifiedHeader;

