const express = require('express');
const router = express.Router();
const availabilityController = require('../src/controllers/availabilityController');

// GET /api/availability
router.get('/', availabilityController.list);

// POST /api/availability
router.post('/', availabilityController.create);

// DELETE /api/availability/:id
router.delete('/:id', availabilityController.remove);

module.exports = router;
