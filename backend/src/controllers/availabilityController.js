const NoWorkDay = require('../models/NoWorkDay');

async function list(req, res) {
  try {
    const days = await NoWorkDay.find();
    res.json({ success: true, data: days });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  try {
    const day = new NoWorkDay(req.body);
    await day.save();
    res.status(201).json({ success: true, data: day });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function remove(req, res) {
  try {
    const removed = await NoWorkDay.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { list, create, remove };
