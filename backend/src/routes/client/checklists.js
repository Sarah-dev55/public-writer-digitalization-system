const express = require('express');
const router = express.Router();
const Checklist = require('../../models/Checklist');
const { v4: uuidv4 } = require('uuid');

// Get all checklists
router.get('/', async (req, res) => {
  try {
    const checklists = await Checklist.find();
    res.json(checklists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get checklist by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const checklist = await Checklist.findOne({ userId: req.params.userId });
    if (!checklist) return res.status(404).json({ message: 'Checklist not found' });
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new checklist
router.post('/', async (req, res) => {
  const checklist = new Checklist({
    _id: uuidv4(),
    userId: req.body.userId,
    title: req.body.title,
    items: req.body.items || []
  });

  try {
    const newChecklist = await checklist.save();
    res.status(201).json(newChecklist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update checklist item status
router.patch('/:id/items/:itemId', async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id);
    if (!checklist) return res.status(404).json({ message: 'Checklist not found' });

    const item = checklist.items.find(i => i.itemId === req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.isCompleted = req.body.isCompleted;
    await checklist.save();

    res.json(checklist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete checklist
router.delete('/:id', async (req, res) => {
  try {
    const checklist = await Checklist.findByIdAndDelete(req.params.id);
    if (!checklist) return res.status(404).json({ message: 'Checklist not found' });
    res.json({ message: 'Checklist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;