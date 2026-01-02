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

// Make a new meeting and check if it's okay
router.post('/', async (req, res) => {
  const { date, timeSlot, notes, appointmentType } = req.body;

  // Use a default user ID if none is given
  const userId = req.body.userId || '692cb332a4ba90e0b2dcb02f';

  try {
    // Check if the date is written correctly

    // Get the name of the day
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = days[dateObj.getDay()];

    // 1. Check if the office is closed that day
    const nonWorking = await NoWorkDay.findOne({
      $or: [
        { date },
        { isRecurring: true, date: weekday }
      ]
    });
    if (nonWorking) {
      return res.status(400).json({ message: 'This day is unavailable (non-working day).' });
    }

    // 2. Check if someone else already has this time
    const alreadyBooked = await Appointment.findOne({ date, timeSlot });
    if (alreadyBooked) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

    // 3. Save the new meeting
    const appointment = new Appointment({
      date,
      timeSlot,
      notes,
      appointmentType,
      userId,
      status: 'scheduled'
    });

    const newAppointment = await appointment.save();

    // Tell the admins about the new meeting
    try {
      const user = await User.findById(userId);
      const userName = user ? (user.fullName || user.email) : 'A client';
      await notifyAdmins(
        'New Appointment Booked',
        `${userName} has booked an appointment for ${date} at ${timeSlot}`,
        'info'
      );
    } catch (notifError) {
      console.error('Error sending notification:', notifError);
      // If the message fails, save the meeting anyway
    }

    res.status(201).json(newAppointment);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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

