/**
 * i18n middleware for Express backend
 * Detects and stores user language preference
 * Usage: app.use(i18nMiddleware);
 */

const i18nMiddleware = (req, res, next) => {
  // Get language from headers, query parameter, or default to English
  const language = 
    req.query.language ||
    req.headers['accept-language']?.split('-')[0] ||
    'en';

  // Validate language is supported
  const supportedLanguages = ['en', 'fr'];
  req.language = supportedLanguages.includes(language) ? language : 'en';

  // Add language to response headers
  res.setHeader('Content-Language', req.language);

  next();
};

module.exports = i18nMiddleware;
