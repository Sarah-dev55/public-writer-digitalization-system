import React, { useState } from 'react';  // ← IMPORTANT: Add useState here
import Book_model from '../../components/forms/BookAppointment';
import Footer from '../../components/layout/Footer';

const Appointments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Appointment Page</h1>
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-6">Click the button below to open the booking modal</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Book an Appointment
          </button>
        </div>
      </div>

      <Book_model isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Footer />
    </div>
  );
};

export default Appointments;