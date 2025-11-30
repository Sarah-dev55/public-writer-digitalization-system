import React, { useState } from 'react';

export default function SignUpForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
      </div>
      <div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Sign Up</button>
      </div>
    </form>
  );
}
