import React from 'react';
import { useTranslation } from 'react-i18next';
import LoginForm from '../components/forms/LoginForm';

export default function Login() {
  const { t } = useTranslation();
  
  const handleSubmit = (creds) => {
    // placeholder: call auth service
    console.log('Login submit', creds);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">{t('auth.loginTitle')}</h2>
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
