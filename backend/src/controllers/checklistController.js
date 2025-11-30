const checklistService = require('../services/checklistService');

async function getByUser(req, res) {
  try {
    const checklist = await checklistService.getChecklistByUser(req.params.userId);
    res.json({ success: true, data: checklist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  try {
    const created = await checklistService.createChecklist(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const updated = await checklistService.updateChecklist(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function updateItem(req, res) {
  try {
    const { checklistId, itemId } = req.params;
    const updated = await checklistService.updateChecklistItem(checklistId, itemId, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getByUser, create, update, updateItem };
