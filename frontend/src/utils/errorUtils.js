/**
 * Extracts a user-friendly error message from an API error (usually Axios).
 * @param {Error} error - The error object
 * @param {string} fallback - A fallback message if no better message is found
 * @returns {string} A user-friendly error message
 */
export const getErrorMessage = (error, fallback = 'An unexpected error occurred. Please try again.') => {
    if (!error) return fallback;

    // Handle Axios response error
    if (error.response) {
        const { status, data } = error.response;

        // If backend provided a message, use it if it's not the raw status text
        if (data && (data.message || data.error)) {
            const msg = data.message || data.error;
            // If it looks like a raw axios error message, translate it
            if (typeof msg === 'string' && !msg.toLowerCase().includes('failed with status code')) {
                return msg;
            }
        }

        // Default messages by status code
        switch (status) {
            case 400:
                return 'Please check your information and try again.';
            case 401:
                return 'Invalid email or password.';
            case 403:
                return 'You do not have permission to perform this action.';
            case 404:
                return 'The requested resource was not found.';
            case 409:
                return 'This information is already in use (e.g., email already exists).';
            case 429:
                return 'Too many requests. Please try again later.';
            case 500:
            case 502:
            case 503:
            case 504:
                return 'Server error. Please try again later.';
            default:
                break;
        }
    }

    // Handle network error (no response)
    if (error.request) {
        return 'Network error. Please check your internet connection.';
    }

    // Handle other errors
    return error.message || fallback;
};
