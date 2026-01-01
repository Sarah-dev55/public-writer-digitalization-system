import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CaseProgress({ progress = 0, currentPhase = 'Unknown', steps = [] }) {
  const { t } = useTranslation();
  
  // Use passed steps or default empty if not provided (though Overview should provide them)
  const displaySteps = steps.length > 0 ? steps : [
    { id: 1, title: 'Initial Consultation', status: 'pending', date: null },
    { id: 2, title: 'Document Preparation', status: 'pending', date: null },
    { id: 3, title: 'Application Submission', status: 'pending', date: null },
    { id: 4, title: 'Interview Preparation', status: 'pending', date: null },
    { id: 5, title: 'Final Review', status: 'pending', date: null },
  ];

  const getStepIcon = (step) => {
    if (step.status === 'completed') {
      return (
        <div className="w-12 h-12 rounded-full bg-app-primary flex items-center justify-center text-app-text-light font-bold">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else if (step.status === 'in-progress') {
      return (
        <div className="w-12 h-12 rounded-full bg-[#A65F00] flex items-center justify-center text-white font-bold">
          {step.id}
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 rounded-full bg-app-accent border-2 border-gray-300 flex items-center justify-center text-gray-500 font-bold">
          {step.id}
        </div>
      );
    }
  };

  const getStatusText = (step) => {
    if (step.status === 'completed') {
      return <span className="text-app-primary font-semibold">{t('dashboard.completed')}</span>;
    } else if (step.status === 'in-progress') {
      return <span className="text-[#A65F00] font-semibold">{t('dashboard.inProgress')}</span>;
    } else {
      return <span className="text-gray-500 font-semibold">{t('dashboard.pending')}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-app-primary mb-6">{t('dashboard.caseProgress')}</h2>
      
      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-6 mb-8 shadow-md">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-app-primary">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-app-primary h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <p className="text-gray-700 mt-2">
          You are currently in the <span className="font-semibold text-app-primary">{currentPhase}</span> phase.
        </p>
      </div>
      
      {/* Timeline */}
      <div className="space-y-6">
        {displaySteps.map((step, index) => (
          <div key={step.id} className="flex gap-4">
            {/* Step Icon */}
            <div className="flex flex-col items-center">
              {getStepIcon(step)}
              {index < displaySteps.length - 1 && (
                <div
                  className={`w-0.5 h-16 mt-2 ${
                    step.status === 'completed' ? 'bg-app-primary' : 'bg-gray-300'
                  }`}
                ></div>
              )}
            </div>
            
            {/* Step Content */}
            <div className="flex-1 pb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-app-primary mb-1">{step.id}. {step.title}</h3>
                  <div className="flex items-center gap-4">
                    {getStatusText(step)}
                    {step.date && (
                      <span className="text-gray-600 text-sm">{step.date}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

