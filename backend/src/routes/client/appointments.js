const express = require('express');
const router = express.Router();
const Appointment = require('../../models/Appointment');
const NoWorkDay = require('../../models/NoWorkDay');
const { v4: uuidv4 } = require('uuid');
const clientAppointmentController = require('../../controllers/client/client_apointments');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new appointment (with validation)
router.post('/', async (req, res) => {
  const { date, timeSlot, notes, appointmentType } = req.body;

  // USER ID (use provided one or fallback to default until auth is implemented)
  // Defaulting to existing DB user ObjectId string
  const userId = req.body.userId || '692cb332a4ba90e0b2dcb02f';

  try {
    // Validate date format (expecting YYYY-MM-DD)
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    // weekday name for recurring checks
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = days[dateObj.getDay()];

    // 1️⃣ Check if day is non-working (exact date OR recurring weekday)
    const nonWorking = await NoWorkDay.findOne({
      $or: [
        { date },
        { isRecurring: true, date: weekday }
      ]
    });
    if (nonWorking) {
      return res.status(400).json({ message: 'This day is unavailable (non-working day).' });
    }

    // 2️⃣ Check if time slot already booked
    const alreadyBooked = await Appointment.findOne({ date, timeSlot });
    if (alreadyBooked) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

    // 3️⃣ Create appointment
    const appointment = new Appointment({
      date,
      timeSlot,
      notes,
      appointmentType,
      userId,
      status: 'scheduled'
    });

    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get appointments by date
router.get('/date/:date', async (req, res) => {
  try {
    const appointments = await Appointment.find({ date: req.params.date });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete appointment
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

// Get all appointments for a specific user
router.get('/user/:userId', clientAppointmentController.getUserAppointments);

// Update/Reschedule an appointment (with ownership validation)
router.put('/:id', clientAppointmentController.updateAppointment);

// Delete appointment with ownership validation (enhanced version)
// Note: The basic delete route above (line 82) can be used for admin purposes
// This route validates user ownership before deletion
router.delete('/user/:id', clientAppointmentController.deleteAppointment);

module.exports = router;

