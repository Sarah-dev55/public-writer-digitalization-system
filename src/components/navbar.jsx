import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/images/logose.png'; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav 
      className="backdrop-blur-md border-b sticky top-0 z-50"
      style={{
        backgroundColor: "rgba(52,78,65,0.8)",  // #344E41 with opacity
        borderColor: "#588157"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Logo"
              className="h-16 w-auto"
              style={{ filter: "drop-shadow(0 0 4px #58815750)" }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="transition"
              style={{ color: "#dad7cd" }}
            >
              Home
            </Link>

            <Link 
              to="/about" 
              className="transition"
              style={{ color: "#dad7cd" }}
            >
              About Us
            </Link>

            <Link 
              to="/contact"
              className="transition"
              style={{ color: "#dad7cd" }}
            >
              Contact
            </Link>
          </div>

          {/* Login / Signup buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login"
              className="transition"
              style={{ color: "#dad7cd" }}
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-6 py-2 rounded-lg transition transform hover:scale-105"
              style={{
                backgroundColor: "#588157", 
                color: "white"
              }}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden transition"
            style={{ color: "#dad7cd" }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {["/", "/about", "/contact", "/login"].map((path, idx) => (
              <Link
                key={idx}
                to={path}
                onClick={() => setIsOpen(false)}
                className="py-2 transition block"
                style={{ color: "#dad7cd" }}
              >
                {path === "/" ? "Home" : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
              </Link>
            ))}

            <Link
              to="/signup"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 rounded-lg text-center block transition"
              style={{
                backgroundColor: "#588157",
                color: "white"
              }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
