import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SignUpForm({ onSubmit }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('auth.email')}</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('auth.password')}</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
      </div>
      <div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{t('navigation.signup')}</button>
      </div>
    </form>
  );
}
