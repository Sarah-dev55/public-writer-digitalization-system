export function getLanguageHeaders() {
  const language = localStorage.getItem('language') || 'en';
  
  return {
    'Accept-Language': language === 'fr' ? 'fr-FR' : 'en-US',
  };
}

export function getCurrentLanguage() {
  return localStorage.getItem('language') || 'en';
}

export function setLanguage(lang) {
  localStorage.setItem('language', lang);
}

export function formatDateByLanguage(date) {
  const dateObj = new Date(date);
  const language = getCurrentLanguage();
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', options).format(dateObj);
}

export function formatTimeByLanguage(time) {
  const timeObj = new Date(time);
  const language = getCurrentLanguage();
  
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: language === 'en',
  };
  
  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', options).format(timeObj);
}

export function formatCurrencyByLanguage(amount, currency = 'USD') {
  const language = getCurrentLanguage();
  
  const options = {
    style: 'currency',
    currency: currency,
  };
  
  return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', options).format(amount);
}

export function formatNumberByLanguage(number) {
  const language = getCurrentLanguage();
  
  return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US').format(number);
}

export default {
  getLanguageHeaders,
  getCurrentLanguage,
  setLanguage,
  formatDateByLanguage,
  formatTimeByLanguage,
  formatCurrencyByLanguage,
  formatNumberByLanguage,
};
