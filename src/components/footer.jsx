// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="py-12 px-4 backdrop-blur-md"
      style={{
        backgroundColor: "rgba(52,78,65,0.85)", // #344E41 with opacity
        borderTop: "1px solid #588157"
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">

          {/* Logo & Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <PenTool className="w-6 h-6" style={{ color: "#588157" }} />
              <span className="text-xl font-bold" style={{ color: "#dad7cd" }}>
                Public Writer
              </span>
            </div>
            <p style={{ color: "#dad7cd", opacity: 0.7 }} className="text-sm">
              Professional writing services for all your documentation needs
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "#dad7cd" }}>Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="transition"
                  style={{ color: "#dad7cd" }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="transition"
                  style={{ color: "#dad7cd" }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition"
                  style={{ color: "#dad7cd" }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "#dad7cd" }}>Services</h4>
            <ul className="space-y-2 text-sm" style={{ color: "#dad7cd" }}>
              <li>Legal Documents</li>
              <li>Applications</li>
              <li>Letters</li>
              <li>Contracts</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "#dad7cd" }}>Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2" style={{ color: "#dad7cd" }}>
                <Mail className="w-4 h-4" style={{ color: "#588157" }} />
                <span>info@publicwriter.com</span>
              </li>
              <li className="flex items-center space-x-2" style={{ color: "#dad7cd" }}>
                <Phone className="w-4 h-4" style={{ color: "#588157" }} />
                <span>+213 XXX XXX XXX</span>
              </li>
              <li className="flex items-center space-x-2" style={{ color: "#dad7cd" }}>
                <MapPin className="w-4 h-4" style={{ color: "#588157" }} />
                <span>Algiers, Algeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="pt-8 text-center text-sm"
          style={{
            borderTop: "1px solid #588157",
            color: "#dad7cd",
            opacity: 0.7
          }}
        >
          © 2024 Public Writer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
