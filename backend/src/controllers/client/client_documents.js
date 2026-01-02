const Document = require('../../models/Document');
const path = require('path');
const fs = require('fs').promises;
const { notifyAdmins } = require('../../utils/notificationHelper');
const User = require('../../models/User');

// Get all documents for one person
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

// Put a new document in the system
async function uploadDocument(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { userId, documentName, documentId, checklistItemId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // If we want to change an old document
        if (documentId) {
            const existingDoc = await Document.findById(documentId);
            if (existingDoc) {
                // Check if the user really owns this document
                if (existingDoc.userId.toString() !== userId) {
                    // Delete the file if something is wrong
                    try { await fs.unlink(req.file.path); } catch (e) { }
                    return res.status(403).json({ message: 'You do not have permission to modify this document' });
                }

                // Delete the old file first
                if (existingDoc.storagePath) {
                    try {
                        await fs.unlink(existingDoc.storagePath);
                    } catch (err) {
                        console.log('Old file not found or already deleted');
                    }
                }

                // Update the document info
                existingDoc.fileName = req.file.filename;
                existingDoc.storagePath = req.file.path.includes(process.cwd().replace(/\\/g, '/')) || req.file.path.includes(process.cwd())
                    ? path.relative(process.cwd(), req.file.path)
                    : req.file.path;
                existingDoc.type = req.file.mimetype;
                existingDoc.status = 'pending';
                existingDoc.rejectionReason = undefined; // Remove the "No" reason
                existingDoc.uploadedAt = new Date();
                if (checklistItemId) existingDoc.checklistItemId = checklistItemId;
                await existingDoc.save();

                // Tell the admins someone uploaded a file
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

        // Make a brand new document
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

        // Tell the admins about the new file
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

// Delete a document
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

        // Check if the user owns this file
        if (document.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this document' });
        }

        // Remove the file from the server
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

        // If the file is needed, just say it's missing instead of deleting everything
        if (document.required) {
            document.fileName = undefined;
            document.storagePath = undefined;
            document.type = undefined;
            document.status = 'missing';
            document.uploadedAt = undefined;

            await document.save();
            return res.json({ message: 'Document reset to missing', status: 'missing' });
        }

        // If it's extra, just delete it from the database
        await Document.findByIdAndDelete(id);
        res.json({ message: 'Document deleted successfully', status: 'deleted' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: error.message });
    }
}

// Open and look at a document
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
            // Give back the link so the user can see it
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

// Download the document file
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
