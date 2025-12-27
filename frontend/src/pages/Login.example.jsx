import React from 'react';
import { useTranslation } from 'react-i18next';
import LoginForm from '../components/forms/LoginForm';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

export default function Login() {
  const { t } = useTranslation();

  const handleSubmit = (creds) => {
    // placeholder: call auth service
    console.log('Login submit', creds);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="mb-6 flex justify-end">
          <LanguageSwitcher />
        </div>
        
        {/* Login Card */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            {t('auth.loginTitle')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('auth.haveAccount')}
          </p>
          
          <LoginForm onSubmit={handleSubmit} />
          
          <p className="text-center text-sm text-gray-600 mt-4">
            {t('auth.noAccount')}{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              {t('navigation.signup')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
