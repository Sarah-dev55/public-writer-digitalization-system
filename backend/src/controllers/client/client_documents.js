const Document = require('../../models/Document');
const path = require('path');
const fs = require('fs').promises;
const { notifyAdmins } = require('../../utils/notificationHelper');
const User = require('../../models/User');

/**
 * Get all documents for a specific user
 * @route GET /api/client/documents/user/:userId
 */
async function getUserDocuments(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const documents = await Document.find({ userId }).sort({ createdAt: -1 });
        res.json(documents);
    } catch (error) {
        console.error('Error fetching user documents:', error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * Upload a document
 * @route POST /api/client/documents/upload
 */
async function uploadDocument(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { userId, documentName, documentId, checklistItemId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // If updating existing document
        if (documentId) {
            const existingDoc = await Document.findById(documentId);
            if (existingDoc) {
                // Validate ownership before update
                if (existingDoc.userId.toString() !== userId) {
                    // Prevent orphaned file
                    try { await fs.unlink(req.file.path); } catch (e) { }
                    return res.status(403).json({ message: 'You do not have permission to modify this document' });
                }

                // Delete old file if exists
                if (existingDoc.storagePath) {
                    try {
                        await fs.unlink(existingDoc.storagePath);
                    } catch (err) {
                        console.log('Old file not found or already deleted');
                    }
                }

                // Update document
                existingDoc.fileName = req.file.filename;
                existingDoc.storagePath = req.file.path.includes(process.cwd().replace(/\\/g, '/')) || req.file.path.includes(process.cwd())
                    ? path.relative(process.cwd(), req.file.path)
                    : req.file.path;
                existingDoc.type = req.file.mimetype;
                existingDoc.status = 'pending';
                existingDoc.rejectionReason = undefined; // Clear rejection reason
                existingDoc.uploadedAt = new Date();
                if (checklistItemId) existingDoc.checklistItemId = checklistItemId;
                await existingDoc.save();

                // Notify admins about document upload
                try {
                    const user = await User.findById(userId);
                    const userName = user ? (user.fullName || user.email) : 'A client';
                    await notifyAdmins(
                        'Document Updated',
                        `${userName} has uploaded a new version of "${existingDoc.name}"`,
                        'info'
                    );
                } catch (notifError) {
                    console.error('Error sending notification:', notifError);
                }

                return res.status(200).json(existingDoc);
            }
        }

        // Create new document
        const document = new Document({
            userId,
            name: documentName || req.file.originalname,
            fileName: req.file.filename,
            storagePath: req.file.path.includes(process.cwd().replace(/\\/g, '/')) || req.file.path.includes(process.cwd())
                ? path.relative(process.cwd(), req.file.path)
                : req.file.path,
            type: req.file.mimetype,
            status: 'pending',
            required: false,
            checklistItemId: checklistItemId || undefined,
        });

        await document.save();

        // Notify admins about new document upload
        try {
            const user = await User.findById(userId);
            const userName = user ? (user.fullName || user.email) : 'A client';
            await notifyAdmins(
                'New Document Uploaded',
                `${userName} has uploaded "${document.name}"`,
                'info'
            );
        } catch (notifError) {
            console.error('Error sending notification:', notifError);
        }

        res.status(201).json(document);
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * Delete a document with ownership validation
 * @route DELETE /api/client/documents/:id
 */
async function deleteDocument(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Validate ownership
        if (document.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this document' });
        }

        // Delete file from storage
        if (document.storagePath) {
            try {
                const fullPath = path.isAbsolute(document.storagePath)
                    ? document.storagePath
                    : path.join(process.cwd(), document.storagePath);
                await fs.unlink(fullPath);
            } catch (err) {
                console.log('File not found or already deleted:', err.message);
            }
        }

        // If document is required, reset to missing instead of deleting
        if (document.required) {
            document.fileName = undefined;
            document.storagePath = undefined;
            document.type = undefined;
            document.status = 'missing';
            document.uploadedAt = undefined;

            await document.save();
            return res.json({ message: 'Document reset to missing', status: 'missing' });
        }

        // Delete optional document from database
        await Document.findByIdAndDelete(id);
        res.json({ message: 'Document deleted successfully', status: 'deleted' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * View document (return file path/URL)
 * @route GET /api/client/documents/:id/view
 */
async function viewDocument(req, res) {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check if file exists
        try {
            const fullPath = path.isAbsolute(document.storagePath)
                ? document.storagePath
                : path.join(process.cwd(), document.storagePath);
            await fs.access(fullPath);
            // Return URL for viewing (frontend can open in new tab)
            const fileUrl = `/uploads/documents/${document.fileName}`;
            res.json({ url: fileUrl, document });
        } catch (err) {
            return res.status(404).json({ message: 'File not found on server' });
        }
    } catch (error) {
        console.error('Error viewing document:', error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * Download document
 * @route GET /api/client/documents/:id/download
 */
async function downloadDocument(req, res) {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check if file exists
        try {
            const fullPath = path.isAbsolute(document.storagePath)
                ? document.storagePath
                : path.join(process.cwd(), document.storagePath);
            await fs.access(fullPath);
            res.download(fullPath, document.fileName);
        } catch (err) {
            return res.status(404).json({ message: 'File not found on server' });
        }
    } catch (error) {
        console.error('Error downloading document:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getUserDocuments,
    uploadDocument,
    deleteDocument,
    viewDocument,
    downloadDocument
};
