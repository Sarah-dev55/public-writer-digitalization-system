const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/appointmentController');

router.get('/date/:date', appointmentController.getByDate);

router.get('/', appointmentController.listAll);

router.post('/', appointmentController.create);

router.put('/:id', appointmentController.update);

router.delete('/:id', appointmentController.remove);

module.exports = router;