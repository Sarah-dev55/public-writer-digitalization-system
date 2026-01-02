const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const clientDocumentController = require('../../controllers/client/client_documents');

// Make a folder for uploads if it's not there
const uploadsDir = path.join(process.cwd(), 'uploads/documents');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Setup where to save the files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Give the file a special name so it doesn't get mixed up
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
    }
});

// Only allow certain types of files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'), false);
    }
};

// Setup the file uploader
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    },
    fileFilter: fileFilter
});

// Get all the papers for one user
router.get('/user/:userId', clientDocumentController.getUserDocuments);

// Put a paper into the system
router.post('/upload', upload.single('file'), clientDocumentController.uploadDocument);

// Delete a paper (check if user owns it)
router.delete('/:id', clientDocumentController.deleteDocument);

// Look at a paper
router.get('/:id/view', clientDocumentController.viewDocument);

// Download the paper file
router.get('/:id/download', clientDocumentController.downloadDocument);

module.exports = router;
