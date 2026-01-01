import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="flex items-center gap-2 bg-transparent rounded-md">
      <Globe className="w-5 h-5 text-app-accent" />
      <select
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="px-1 py-1 rounded-md bg-transparent text-app-accent text-sm font-medium hover:bg-app-primary text-app-accent cursor-pointer"
      >
        <option value="en" className=' text-sm text-app-primary hover:bg-app-primary text-app-accent' >En</option>
        <option value="fr" className=' text-sm text-app-primary hover:bg-app-primary text-app-accent'>Fr</option>
      </select>
    </div>
  );
}
