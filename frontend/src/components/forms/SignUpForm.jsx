import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SignUpForm({ onSubmit }) {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    // Send the user info to the signup function
    onSubmit?.({ fullName, email, password });
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-app-primary">{t('auth.fullName') || 'Full Name'}</label>
        <input 
          type="text"
          value={fullName} 
          onChange={e => setFullName(e.target.value)} 
          className="mt-1 block w-full rounded border border-gray-300 p-2"
          required
          placeholder="John Doe"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-app-primary">{t('auth.email')}</label>
        <input 
          type="email"
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="mt-1 block w-full rounded border border-gray-300 p-2"
          required
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-app-primary">{t('auth.password')}</label>
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="mt-1 block w-full rounded border border-gray-300 p-2"
          required
          minLength="6"
          placeholder="At least 6 characters"
        />
      </div>
      <div>
        <button type="submit" className="w-full bg-app-primary text-white px-4 py-2 rounded hover:bg-app-secondary transition-colors duration-200">{t('navigation.signup')}</button>
      </div>
    </form>
  );
}
