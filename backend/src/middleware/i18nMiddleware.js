// This part helps pick the right language for the user

const i18nMiddleware = (req, res, next) => {
  // Look for language in the URL or header
  const language =
    req.query.language ||
    req.headers['accept-language']?.split('-')[0] ||
    'en';

  // Make sure we have the language, otherwise use English
  const supportedLanguages = ['en', 'fr'];
  req.language = supportedLanguages.includes(language) ? language : 'en';

  // Set the language in the header
  res.setHeader('Content-Language', req.language);

  next();
};

module.exports = i18nMiddleware;
