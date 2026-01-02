import api from './api';

/**
 * Admin Document Service
 * Handles all admin-facing document operations
 * Base URL: /api/admin/documents
 */

/**
 * Get all documents
 * @returns {Promise} List of all documents
 */
export async function getAllDocuments() {
    try {
        const res = await api.get('/admin/documents');
        return res.data;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
}

/**
 * Get documents by user ID
 * @param {string} userId - User ID
 * @returns {Promise} List of documents for the specified user
 */
export async function getDocumentsByUser(userId) {
    try {
        const res = await api.get(`/admin/documents/user/${userId}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching documents for user ${userId}:`, error);
        throw error;
    }
}

/**
 * Get pending documents
 * @returns {Promise} List of pending documents
 */
export async function getPendingDocuments() {
    try {
        const res = await api.get('/admin/documents/pending');
        return res.data;
    } catch (error) {
        console.error('Error fetching pending documents:', error);
        throw error;
    }
}

/**
 * Get document by ID
 * @param {string} id - Document ID
 * @returns {Promise} Document details
 */
export async function getDocumentById(id) {
    try {
        const res = await api.get(`/admin/documents/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching document ${id}:`, error);
        throw error;
    }
}

/**
 * Create a new document
 * @param {Object} payload - Document data (userId, documentType, status, etc.)
 * @returns {Promise} Created document
 */
export async function createDocument(payload) {
    try {
        const res = await api.post('/admin/documents', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
}

/**
 * Update a document
 * @param {string} id - Document ID
 * @param {Object} payload - Updated document data (status, etc.)
 * @returns {Promise} Updated document
 */
export async function updateDocument(id, payload) {
    try {
        const res = await api.put(`/admin/documents/${id}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating document ${id}:`, error);
        throw error;
    }
}

/**
 * Delete a document
 * @param {string} id - Document ID
 * @returns {Promise} Deletion confirmation
 */
export async function deleteDocument(id) {
    try {
        const res = await api.delete(`/admin/documents/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting document ${id}:`, error);
        throw error;
    }
}

/**
 * Upload a document file
 * @param {FormData} formData - Form data containing the file
 * @returns {Promise} Upload result
 */
export async function uploadDocument(formData) {
    try {
        const res = await api.post('/admin/uploads', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
}

/**
 * Download a document file
 * @param {string} id - Document ID
 * @param {string} fileName - Name of the file for download
 * @returns {Promise} Download result
 */
export async function downloadDocument(id, fileName) {
    try {
        const res = await api.get(`/admin/documents/${id}/download`, {
            responseType: 'blob'
        });

        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName || 'document');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        console.error(`Error downloading document ${id}:`, error);
        throw error;
    }
}

/**
 * Update document status
 * @param {string} id - Document ID
 * @param {string} status - New status ('pending', 'approved', 'rejected')
 * @param {string} statusNotes - Optional notes about the status change
 * @returns {Promise} Updated document
 */
export async function updateDocumentStatus(id, status, statusNotes = '') {
    try {
        const res = await api.put(`/admin/documents/${id}/status`, {
            status,
            statusNotes
        });
        return res.data;
    } catch (error) {
        console.error(`Error updating document status ${id}:`, error);
        throw error;
    }
}
