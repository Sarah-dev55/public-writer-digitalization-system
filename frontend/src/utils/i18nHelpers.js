/**
 * Helper functions for API internationalization
 * Use these functions when making API calls to include language preference
 */

/**
 * Get language-specific headers for API requests
 * @returns {Object} Headers object with Accept-Language
 */
export function getLanguageHeaders() {
  const language = localStorage.getItem('language') || 'en';
  
  return {
    'Accept-Language': language === 'fr' ? 'fr-FR' : 'en-US',
  };
}

/**
 * Get current language preference
 * @returns {string} Current language code ('en' or 'fr')
 */
export function getCurrentLanguage() {
  return localStorage.getItem('language') || 'en';
}

/**
 * Set language preference
 * @param {string} lang Language code ('en' or 'fr')
 */
export function setLanguage(lang) {
  localStorage.setItem('language', lang);
}

/**
 * Format date based on current language
 * @param {Date|string} date Date to format
 * @returns {string} Formatted date string
 */
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

/**
 * Format time based on current language
 * @param {Date|string} time Time to format
 * @returns {string} Formatted time string
 */
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

/**
 * Format currency based on current language
 * @param {number} amount Amount to format
 * @param {string} currency Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export function formatCurrencyByLanguage(amount, currency = 'USD') {
  const language = getCurrentLanguage();
  
  const options = {
    style: 'currency',
    currency: currency,
  };
  
  return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', options).format(amount);
}

/**
 * Format number based on current language
 * @param {number} number Number to format
 * @returns {string} Formatted number string
 */
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
