const express = require('express');
const router = express.Router();
const documentController = require('../../controllers/documentController');

// GET /api/documents - list all documents (admin)
router.get('/', documentController.listAll);

// GET /api/documents/user/:userId
router.get('/user/:userId', documentController.listByUser);

// GET /api/documents/pending - list pending documents
router.get('/pending', documentController.listPending);

// GET /api/documents/:id/download - download document (admin)
router.get('/:id/download', documentController.download);

// POST /api/documents
router.post('/', documentController.create);

// PUT /api/documents/:id - update document (e.g., status)
router.put('/:id', documentController.update);

// PUT /api/documents/:id/status - update document status specifically
router.put('/:id/status', documentController.updateStatus);

module.exports = router;
