import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SignUp() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">{t('auth.signupTitle')}</h2>
        <p className="text-sm text-gray-600">{t('auth.registrationFormPlaceholder')}</p>
      </div>
    </div>
  );
}
