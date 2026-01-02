const express = require('express');
const router = express.Router();
const Appointment = require('../../models/Appointment');
const NoWorkDay = require('../../models/NoWorkDay');
const User = require('../../models/User');
const { v4: uuidv4 } = require('uuid');
const clientAppointmentController = require('../../controllers/client/client_appointments');
const { notifyAdmins } = require('../../utils/notificationHelper');

// Get all meetings
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Make a new meeting (handled by the controller)
router.post('/', clientAppointmentController.createAppointment);

// Get meetings for a specific day
router.get('/date/:date', async (req, res) => {
  try {
    const appointments = await Appointment.find({ date: req.params.date });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a meeting
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== NEW ROUTES FOR CLIENT APPOINTMENT MANAGEMENT ====================

// Get all meetings for one user
router.get('/user/:userId', clientAppointmentController.getUserAppointments);

// Change a meeting (check if user owns it)
router.put('/:id', clientAppointmentController.updateAppointment);

// Delete a meeting (check if user owns it)
router.delete('/user/:id', clientAppointmentController.deleteAppointment);

module.exports = router;

