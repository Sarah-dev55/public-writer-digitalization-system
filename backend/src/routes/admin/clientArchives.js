const express = require('express');
const router = express.Router();
const clientArchiveController = require('../../controllers/clientArchiveController');

router.get('/', clientArchiveController.listAll);

router.get('/search', clientArchiveController.search);

router.get('/client/:clientId', clientArchiveController.getByClientId);

router.get('/client/:clientId/history', clientArchiveController.getClientHistory);

router.post('/', clientArchiveController.create);

router.post('/from-user/:userId', clientArchiveController.createFromUser);

router.get('/:id', clientArchiveController.getById);

router.put('/:id', clientArchiveController.update);

router.post('/:id/cases', clientArchiveController.addCase);

router.put('/:id/cases/:caseId', clientArchiveController.updateCase);

router.post('/:id/cases/:caseId/documents', clientArchiveController.addDocumentToCase);

router.put('/:id/archive', clientArchiveController.archiveClient);

router.delete('/:id', clientArchiveController.remove);

module.exports = router;
