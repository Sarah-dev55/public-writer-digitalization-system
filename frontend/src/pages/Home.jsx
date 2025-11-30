import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Home() {
  const menuItems = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT US', href: '/about' },
    { label: 'CONTACT US', href: '/contact' },
    { label: 'BLOG', href: '/blog' },
  ];

  return (
    <div>
      <Header
        logo="MENSE"
        email="Disnmarketir@gmail.com"
        phone="(+92) 123-456-789"
        menuItems={menuItems}
        actionButton={
          <Link to="/client/overview">
            <button className="bg-[#2d4a3e] text-[#f5f5dc] px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-[#1d3a2e] transition-all">
              GET STARTED
            </button>
          </Link>
        }
      />
      <main className="max-w-6xl mx-auto p-6">
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold mb-4 text-[#2d4a3e]">Welcome to MENSEUR public Writer Services System</h2>
          <p className="text-gray-700 text-lg mb-8">Manage clients, appointments and documents with ease.</p>
          <Link to="/client/overview">
            <button className="bg-[#2d4a3e] hover:bg-[#1d3a2e] text-[#f5f5dc] px-8 py-4 rounded-full font-semibold text-lg uppercase tracking-wide transition-all">
              Go to Client Overview
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
