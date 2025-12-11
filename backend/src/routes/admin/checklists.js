const express = require('express');
const router = express.Router();
const checklistController = require('../../controllers/checklistController');

// GET /api/checklists/user/:userId
router.get('/user/:userId', checklistController.getByUser);

// POST /api/checklists
router.post('/', checklistController.create);

// PUT /api/checklists/:id
router.put('/:id', checklistController.update);

// PUT /api/checklists/:checklistId/items/:itemId
router.put('/:checklistId/items/:itemId', checklistController.updateItem);

module.exports = router;
