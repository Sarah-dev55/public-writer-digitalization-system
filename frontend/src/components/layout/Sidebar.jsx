import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const { t } = useTranslation();
  
  return (
    <aside className="w-60 bg-white border-r p-4">
      <nav className="space-y-2">
        <a className="block text-gray-700" href="/client/overview">{t('dashboard.overview')}</a>
        <a className="block text-gray-700" href="/client/appointments">{t('navigation.appointments')}</a>
        <a className="block text-gray-700" href="/client/documents">{t('navigation.documents')}</a>
      </nav>
    </aside>
  );
}
