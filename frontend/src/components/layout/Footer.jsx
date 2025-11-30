import React from 'react';

/**
 * cn utility - Combines classes
 */
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Footer Component - Matches Design
 */
function Footer({ className = '' }) {
  return (
    <footer className={cn('bg-[#2d4a3e] text-[#f5f5dc] py-12', className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-white">
                <svg className="w-10 h-10" viewBox="0 0 40 40" fill="currentColor">
                  <rect x="8" y="10" width="24" height="3" />
                  <rect x="8" y="16" width="24" height="3" />
                  <rect x="8" y="22" width="24" height="3" />
                  <path d="M6 8 L10 12 L6 16 Z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#f5f5dc]">MENSEUR</span>
            </div>
            <p className="text-[#f5f5dc] text-sm leading-relaxed">
              Aplikasi berbasis layanan penginapan & restoran terkemuka dan hotel di Indonesia
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#f5f5dc]">Quick Links</h4>
            <ul className="space-y-2 text-[#f5f5dc] text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/checkin" className="hover:text-white transition-colors">Check In - Checkout</a></li>
              <li><a href="/legality" className="hover:text-white transition-colors">Legality</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#f5f5dc]">Tetap bersama kami</h4>
            <ul className="space-y-2 text-[#f5f5dc] text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                mensieur@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +62 (123) 456 789
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#5a7a66] mt-8 pt-8 text-center text-[#f5f5dc] text-sm">
          <p>COPYRIGHT 2023 MENSEUR</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
