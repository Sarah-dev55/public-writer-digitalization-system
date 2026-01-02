const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const clientDocumentController = require('../../controllers/client/client_documents');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads/documents');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename: timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
    }
});

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    },
    fileFilter: fileFilter
});

// Get all documents for a specific user
router.get('/user/:userId', clientDocumentController.getUserDocuments);

// Upload a document
router.post('/upload', upload.single('file'), clientDocumentController.uploadDocument);

// Delete a document with ownership validation
router.delete('/:id', clientDocumentController.deleteDocument);

// View document
router.get('/:id/view', clientDocumentController.viewDocument);

// Download document
router.get('/:id/download', clientDocumentController.downloadDocument);

module.exports = router;
