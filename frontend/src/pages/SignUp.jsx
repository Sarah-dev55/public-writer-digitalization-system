import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/forms/SignUpForm';
import useAuth from '../hooks/useAuth';
import { AuthContext } from '../context/AuthContext';
import UnifiedHeader from '../components/layout/UnifiedHeader';
import Footer from '../components/layout/Footer';
import { getErrorMessage } from '../utils/errorUtils';

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { signup } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navItems = [
    { label: t('navigation.home'), active: false, href: '/' },
    { label: t('navigation.services'), active: false, href: '/#about' },
  ];

  // Go to the login page
  const handleCtaClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-app-accent">
      {/* Header */}
      {/* <UnifiedHeader
        navItems={navItems}
        logoImage="/assets/images/Logo.png"
        logoOnClick={() => navigate('/')}
        ctaButtonText={t('navigation.login') || 'Sign In'}
        ctaButtonOnClick={handleCtaClick}
        navClassName="bg-white shadow-sm"
        showCtaButton={true}
      /> */}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-app-primary mb-2">
              {t('auth.signupTitle') || 'Create Account'}
            </h2>
            <p className="text-app-primary/80 text-sm">
              {t('auth.registrationFormPlaceholder') || 'Join us to get started with our services.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Signup Form */}
          <SignUpForm
            onSubmit={async (payload) => {
              setError(null);
              setLoading(true);
              try {
                const res = await signup(payload);
                if (res && res.success) {
                  navigate('/client/overview');
                } else {
                  setError(res?.message || 'Signup failed');
                }
              } catch (err) {
                setError(getErrorMessage(err));
              } finally {
                setLoading(false);
              }
            }}
          />

          {/* Loading State */}
          {loading && (
            <div className="mt-4 p-3 bg-white/50 text-app-primary rounded-lg text-center text-sm flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-app-primary border-t-transparent rounded-full animate-spin"></div>
              {t('auth.creatingAccount') || 'Creating your account...'}
            </div>
          )}

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-app-primary/80">
                {t('auth.haveAccount') || 'Already have an account?'}
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-4 bg-app-primary hover:bg-app-secondary text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {t('navigation.login') || 'Sign In'}
              <span>→</span>
            </button>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-app-primary/70 hover:text-app-primary transition"
            >
              ← Back Home
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
