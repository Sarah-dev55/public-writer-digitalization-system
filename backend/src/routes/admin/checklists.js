const express = require('express');
const router = express.Router();
const checklistController = require('../../controllers/checklistController');

router.get('/user/:userId', checklistController.getByUser);

router.post('/', checklistController.create);

router.put('/:id', checklistController.update);

router.put('/:checklistId/items/:itemId', checklistController.updateItem);

module.exports = router;
