/**
 * Backend error messages for different languages
 * Use these for API error responses
 */

const messages = {
  en: {
    // Auth messages
    'auth.invalid_credentials': 'Invalid email or password',
    'auth.user_not_found': 'User not found',
    'auth.email_already_exists': 'Email already registered',
    'auth.weak_password': 'Password is too weak',
    'auth.unauthorized': 'Unauthorized access',
    'auth.token_expired': 'Authentication token has expired',

    // Appointment messages
    'appointment.not_found': 'Appointment not found',
    'appointment.already_booked': 'Time slot is already booked',
    'appointment.invalid_time': 'Invalid appointment time',
    'appointment.cancelled': 'Appointment has been cancelled',
    'appointment.created': 'Appointment created successfully',
    'appointment.updated': 'Appointment updated successfully',
    'appointment.deleted': 'Appointment deleted',

    // Document messages
    'document.not_found': 'Document not found',
    'document.upload_error': 'Error uploading document',
    'document.invalid_format': 'Invalid file format',
    'document.file_too_large': 'File size exceeds maximum limit',
    'document.uploaded': 'Document uploaded successfully',

    // Checklist messages
    'checklist.not_found': 'Checklist not found',
    'checklist.item_not_found': 'Checklist item not found',
    'checklist.created': 'Checklist created successfully',
    'checklist.item_added': 'Item added to checklist',

    // User messages
    'user.not_found': 'User not found',
    'user.created': 'User created successfully',
    'user.updated': 'User updated successfully',
    'user.deleted': 'User deleted',
    'user.invalid_role': 'Invalid user role',

    // General messages
    'error.server_error': 'Internal server error',
    'error.validation_error': 'Validation error',
    'error.not_found': 'Resource not found',
    'error.forbidden': 'Access forbidden',
    'error.method_not_allowed': 'Method not allowed',

    // Success messages
    'success.operation_completed': 'Operation completed successfully',
    'success.data_saved': 'Data saved successfully',
    'success.data_deleted': 'Data deleted successfully',
  },

  fr: {
    // Messages d'authentification
    'auth.invalid_credentials': 'Email ou mot de passe invalide',
    'auth.user_not_found': 'Utilisateur non trouvé',
    'auth.email_already_exists': 'Email déjà enregistré',
    'auth.weak_password': 'Le mot de passe est trop faible',
    'auth.unauthorized': 'Accès non autorisé',
    'auth.token_expired': 'Le jeton d\'authentification a expiré',

    // Messages de rendez-vous
    'appointment.not_found': 'Rendez-vous non trouvé',
    'appointment.already_booked': 'Ce créneau est déjà réservé',
    'appointment.invalid_time': 'Heure de rendez-vous invalide',
    'appointment.cancelled': 'Le rendez-vous a été annulé',
    'appointment.created': 'Rendez-vous créé avec succès',
    'appointment.updated': 'Rendez-vous mis à jour avec succès',
    'appointment.deleted': 'Rendez-vous supprimé',

    // Messages de document
    'document.not_found': 'Document non trouvé',
    'document.upload_error': 'Erreur lors du téléchargement du document',
    'document.invalid_format': 'Format de fichier invalide',
    'document.file_too_large': 'La taille du fichier dépasse la limite maximale',
    'document.uploaded': 'Document téléchargé avec succès',

    // Messages de liste de contrôle
    'checklist.not_found': 'Liste de contrôle non trouvée',
    'checklist.item_not_found': 'Élément de la liste non trouvé',
    'checklist.created': 'Liste de contrôle créée avec succès',
    'checklist.item_added': 'Élément ajouté à la liste de contrôle',

    // Messages d'utilisateur
    'user.not_found': 'Utilisateur non trouvé',
    'user.created': 'Utilisateur créé avec succès',
    'user.updated': 'Utilisateur mis à jour avec succès',
    'user.deleted': 'Utilisateur supprimé',
    'user.invalid_role': 'Rôle d\'utilisateur invalide',

    // Messages généraux
    'error.server_error': 'Erreur interne du serveur',
    'error.validation_error': 'Erreur de validation',
    'error.not_found': 'Ressource non trouvée',
    'error.forbidden': 'Accès interdit',
    'error.method_not_allowed': 'Méthode non autorisée',

    // Messages de succès
    'success.operation_completed': 'Opération terminée avec succès',
    'success.data_saved': 'Données enregistrées avec succès',
    'success.data_deleted': 'Données supprimées avec succès',
  },
};

/**
 * Get error message in specified language
 * @param {string} key Message key (e.g., 'auth.invalid_credentials')
 * @param {string} language Language code ('en' or 'fr')
 * @returns {string} Localized message
 */
function getMessage(key, language = 'en') {
  const lang = messages[language] || messages['en'];
  return lang[key] || key;
}

/**
 * Send localized error response
 * @param {Object} res Express response object
 * @param {number} statusCode HTTP status code
 * @param {string} messageKey Message key
 * @param {string} language Language code
 */
function sendErrorResponse(res, statusCode, messageKey, language = 'en') {
  const message = getMessage(messageKey, language);
  res.status(statusCode).json({
    success: false,
    message: message,
  });
}

/**
 * Send localized success response
 * @param {Object} res Express response object
 * @param {number} statusCode HTTP status code
 * @param {Object} data Response data
 * @param {string} language Language code
 */
function sendSuccessResponse(res, statusCode = 200, data = {}, language = 'en') {
  res.status(statusCode).json({
    success: true,
    data: data,
  });
}

module.exports = {
  messages,
  getMessage,
  sendErrorResponse,
  sendSuccessResponse,
};
