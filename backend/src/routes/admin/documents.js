const express = require('express');
const router = express.Router();
const documentController = require('../../controllers/documentController');

router.get('/', documentController.listAll);

router.get('/user/:userId', documentController.listByUser);

router.get('/pending', documentController.listPending);

router.get('/:id/download', documentController.download);

router.post('/', documentController.create);

router.put('/:id', documentController.update);

router.put('/:id/status', documentController.updateStatus);

module.exports = router;
