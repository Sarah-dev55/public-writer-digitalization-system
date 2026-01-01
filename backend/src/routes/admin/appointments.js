const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/appointmentController');

// GET /api/appointments/date/:date
router.get('/date/:date', appointmentController.getByDate);

// GET /api/appointments - list all appointments
router.get('/', appointmentController.listAll);

// POST /api/appointments
router.post('/', appointmentController.create);

// PUT /api/appointments/:id
router.put('/:id', appointmentController.update);

// DELETE /api/appointments/:id
router.delete('/:id', appointmentController.remove);

module.exports = router;
