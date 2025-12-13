import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * cn utility - Combines classes
 */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Header/Navbar Component - Matches Your Design
 */
function Header({
  logo = "asset/ima",
  email = "Disnmarketir@gmail.com",
  phone = "(+92) 123-456-789",
  menuItems = [],
  user = null,
  onLogout,
  actionButton,
  className = "",
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState({});

  const toggleDropdown = (label) => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <header className={cn("w-full", className)}>
      {/* Top Bar - Contact Info */}
      <div className="bg-app-primary text-app-accent py-2"></div>
      <div className="container mx-auto px-4 mx-6 rounded-b-2xl bg-app-primary">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{phone}</span>
            </div>
          </div>

          {/* User Info (Top Right) */}
          {user && (
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
              <span className="text-sm hidden md:block">
                Client services Dashboard
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-app-accent shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  viewBox="0 0 40 40"
                  fill="currentColor"
                >
                  {/* Book with pen icon */}
                  <rect
                    x="8"
                    y="6"
                    width="24"
                    height="28"
                    rx="2"
                    fill="white"
                    stroke="#2d4a3e"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="16"
                    y1="6"
                    x2="16"
                    y2="34"
                    stroke="#2d4a3e"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="24"
                    y1="6"
                    x2="24"
                    y2="34"
                    stroke="#2d4a3e"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="12"
                    y1="14"
                    x2="20"
                    y2="14"
                    stroke="#2d4a3e"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="12"
                    y1="18"
                    x2="20"
                    y2="18"
                    stroke="#2d4a3e"
                    strokeWidth="1.5"
                  />
                  {/* Pen */}
                  <path d="M26 12 L32 6 L34 8 L28 14 Z" fill="#2d4a3e" />
                  <line
                    x1="28"
                    y1="14"
                    x2="32"
                    y2="10"
                    stroke="#2d4a3e"
                    strokeWidth="1"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-app-primary text-xl font-bold tracking-wider">
                  MENSELIR
                </span>
                <span className="text-app-primary text-xs opacity-80 -mt-1">
                  PUBLIC WRITER
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {menuItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.children ? (
                    // Dropdown Menu Item
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className="text-app-primary hover:text-app-secondary transition-colors font-medium text-sm uppercase tracking-wide flex items-center gap-1"
                      >
                        {item.label}
                        <span className="text-xs">▼</span>
                      </button>

                      {isDropdownOpen[item.label] && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                          {item.children.map((child, childIndex) => (
                            <a
                              key={childIndex}
                              href={child.href}
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular Menu Item
                    <a
                      href={item.href}
                      onClick={item.onClick}
                      className="text-app-primary hover:text-app-secondary transition-colors font-medium text-sm uppercase tracking-wide"
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side - Get Started Button */}
            <div className="hidden lg:flex items-center gap-4">
              {actionButton || (
                <Link to="/client/overview">
                  <button className="bg-app-primary text-app-accent px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-app-primary/90 transition-all">
                    S
                  </button>
                </Link>
              )}
              {/* Hamburger Menu Icon */}
              <button className="text-white text-2xl lg:hidden">☰</button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-app-primary text-2xl"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-3 border-t border-app-primary pt-4">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className="w-full text-left text-app-primary hover:text-app-secondary transition-colors font-medium text-sm uppercase tracking-wide flex items-center justify-between"
                      >
                        {item.label}
                        <span className="text-xs">▼</span>
                      </button>
                      {isDropdownOpen[item.label] && (
                        <div className="ml-4 mt-2 space-y-2">
                          {item.children.map((child, childIndex) => (
                            <a
                              key={childIndex}
                              href={child.href}
                              className="block text-app-secondary hover:text-app-primary text-sm"
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      onClick={item.onClick}
                      className="block text-app-primary hover:text-app-secondary transition-colors font-medium text-sm uppercase tracking-wide"
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}

              {actionButton || (
                <Link to="/client/dashboard" className="w-full">
                  <button className="w-full bg-[#2d4a3e] text-[#f5f5dc] px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-[#1d3a2e] transition-all">
                    GET STARTED
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
export default Header;
