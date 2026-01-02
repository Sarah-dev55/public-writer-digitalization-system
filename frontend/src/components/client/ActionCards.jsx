import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ActionCards({ onBookAppointment, onUploadDocuments }) {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto my-10 px-10 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-app-primary rounded-4xl p-8 text-app-accent shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-app-secondary rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">{t('dashboard.bookYourAppointment')}</h3>
            <p className="text-app-accent mb-6 leading-relaxed">
              {t('dashboard.bookAppointmentDescription')}
            </p>
            <button
              onClick={onBookAppointment}
              className="bg-app-secondary hover:bg-app-secondary/90 text-app-text-light px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2"
            >
              {t('dashboard.bookAppointmentButton')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="bg-app-primary rounded-4xl p-8 text-app-accent shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-app-secondary rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">{t('dashboard.uploadDocuments')}</h3>
            <p className="text-app-accent mb-6 leading-relaxed">
              {t('dashboard.uploadDocumentsDescription')}
            </p>
            <button
              onClick={onUploadDocuments}
              className="bg-app-secondary hover:bg-app-secondary/90 text-app-text-light px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2"
            >
              {t('dashboard.uploadDocumentsButton')}
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

