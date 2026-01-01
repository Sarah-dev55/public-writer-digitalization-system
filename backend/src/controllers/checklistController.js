const Checklist = require('../models/Checklist');

async function getByUser(req, res) {
  try {
    const checklist = await Checklist.findOne({ userId: req.params.userId });
    res.json({ success: true, data: checklist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  try {
    const checklist = new Checklist(req.body);
    await checklist.save();
    res.status(201).json({ success: true, data: checklist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const updated = await Checklist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function updateItem(req, res) {
  try {
    const { checklistId, itemId } = req.params;
    const checklist = await Checklist.findById(checklistId);
    if (!checklist) return res.status(404).json({ success: false, message: 'Checklist not found' });

    const item = checklist.items.find(i => i.itemId === itemId || i._id.toString() === itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    Object.assign(item, req.body);
    await checklist.save();
    res.json({ success: true, data: checklist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getByUser, create, update, updateItem };
