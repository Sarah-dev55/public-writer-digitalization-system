export const getErrorMessage = (error, fallback = 'An unexpected error occurred. Please try again.') => {
    if (!error) return fallback;

    if (error.response) {
        const { status, data } = error.response;

        if (data && (data.message || data.error)) {
            const msg = data.message || data.error;
            if (typeof msg === 'string' && !msg.toLowerCase().includes('failed with status code')) {
                return msg;
            }
        }

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

    if (error.request) {
        return 'Network error. Please check your internet connection.';
    }

    // Handle other errors
    return error.message || fallback;
};
