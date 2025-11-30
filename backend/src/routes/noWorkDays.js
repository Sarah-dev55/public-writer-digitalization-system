const express = require('express');
const router = express.Router();
const NoWorkDay = require('../models/NoWorkDay');

// Get all non-working days
router.get('/', async (req, res) => {
  try {
    const days = await NoWorkDay.find();
    res.json(days);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a non-working day
router.post('/', async (req, res) => {
  const day = new NoWorkDay({
    date: req.body.date,  // expects YYYY-MM-DD
    isRecurring: req.body.isRecurring || false,
    reason: req.body.reason || ''
  });

  try {
    const newDay = await day.save();
    res.status(201).json(newDay);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a non-working day
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await NoWorkDay.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Non-working day removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
