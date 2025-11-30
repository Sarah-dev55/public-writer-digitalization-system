import React from 'react';

export default function ActionCards({ onBookAppointment, onUploadDocuments }) {
  return (
    <div className="container mx-auto my-10 px-10 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Book Appointment Card */}
        <div className="bg-[#3A4D42] rounded-4xl p-8 text-[#f5f5dc] shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#5a7a66] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Book your Appointment</h3>
            <p className="text-[#f5f5dc] mb-6 leading-relaxed">
              Minimize your waiting by booking your appointment now to benefits from our services
            </p>
            <button
              onClick={onBookAppointment}
              className="bg-[#5a7a66] hover:bg-[#4a6a56] text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2"
            >
              BOOK APPOINTMENT
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Upload Documents Card */}
        <div className="bg-[#3A4D42] rounded-4xl p-8 text-[#f5f5dc] shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#5a7a66] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Upload Documents</h3>
            <p className="text-[#f5f5dc] mb-6 leading-relaxed">
              upload your document before appointment for faster service
            </p>
            <button
              onClick={onUploadDocuments}
              className="bg-[#5a7a66] hover:bg-[#4a6a56] text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2"
            >
              UPLOAD DOCUMENTS
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

