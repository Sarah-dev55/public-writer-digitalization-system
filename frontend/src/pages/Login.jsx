import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
import { login as authLogin } from '../services/authService';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (creds) => {
    try {
      setError('');
      setLoading(true);
      
      // Call the auth service
      const response = await authLogin(creds);
      
      if (response.success) {
        // Store token and user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect based on user role
        if (response.data.user.role === 'public_writer') {
          navigate('/admin/dashboard');
        } else {
          navigate('/client/overview');
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">{t('auth.loginTitle')}</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <LoginForm onSubmit={handleSubmit} disabled={loading} />
        
        {loading && (
          <div className="mt-4 text-center text-gray-600">
            {t('auth.loggingIn') || 'Logging in...'}
          </div>
        )}
      </div>
    </div>
  );
}
