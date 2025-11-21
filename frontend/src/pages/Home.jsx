import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Home() {
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to Public Writer Management</h2>
        <p className="text-gray-700">Manage clients, appointments and documents with ease.</p>
      </main>
      <Footer />
    </div>
  );
}
