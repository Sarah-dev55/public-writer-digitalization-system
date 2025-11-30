const availabilityService = require('../services/availabilityService');

async function list(req, res) {
  try {
    const days = await availabilityService.getNoWorkDays();
    res.json({ success: true, data: days });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  try {
    const day = await availabilityService.addNoWorkDay(req.body);
    res.status(201).json({ success: true, data: day });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function remove(req, res) {
  try {
    await availabilityService.removeNoWorkDay(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { list, create, remove };
