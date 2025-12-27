const express = require('express');
const router = express.Router();
const clientArchiveController = require('../../controllers/clientArchiveController');

// GET /api/admin/archives - list all client archives
router.get('/', clientArchiveController.listAll);

// GET /api/admin/archives/search - search archives by name or case type
router.get('/search', clientArchiveController.search);

// GET /api/admin/archives/:id - get single archive by ID
router.get('/:id', clientArchiveController.getById);

// GET /api/admin/archives/client/:clientId - get archive by client ID
router.get('/client/:clientId', clientArchiveController.getByClientId);

// GET /api/admin/archives/client/:clientId/history - get complete client history
router.get('/client/:clientId/history', clientArchiveController.getClientHistory);

// POST /api/admin/archives - create new archive
router.post('/', clientArchiveController.create);

// POST /api/admin/archives/from-user/:userId - create archive from existing user
router.post('/from-user/:userId', clientArchiveController.createFromUser);

// PUT /api/admin/archives/:id - update archive
router. put('/:id', clientArchiveController.update);

// POST /api/admin/archives/:id/cases - add new case to archive
router.post('/:id/cases', clientArchiveController.addCase);

// PUT /api/admin/archives/:id/cases/:caseId - update specific case
router.put('/:id/cases/:caseId', clientArchiveController.updateCase);

// POST /api/admin/archives/:id/cases/:caseId/documents - add document to case
router.post('/:id/cases/: caseId/documents', clientArchiveController.addDocumentToCase);

// PUT /api/admin/archives/:id/archive - archive/deactivate client
router.put('/:id/archive', clientArchiveController.archiveClient);

// DELETE /api/admin/archives/:id - delete archive
router.delete('/:id', clientArchiveController.remove);

module.exports = router;