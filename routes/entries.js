const express = require('express');
const router = express.Router();
const { Entry, MetricLog } = require('../models');

// Create new entry
router.post('/', async (req, res) => {
  try {
    const entry = await Entry.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get entry by ID
router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findByPk(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update entry
router.put('/:id', async (req, res) => {
  try {
    const entry = await Entry.findByPk(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    // Deactivate current version
    await entry.update({ is_current: false });

    // Create new version
    const newEntry = await Entry.create({
      ...req.body,
      version: entry.version + 1,
      is_current: true
    });

    // Log the change
    await MetricLog.create({
      entry_id: entry.id,
      user_id: entry.user_id,
      change_type: 'update',
      old_value: entry.metadata,
      new_value: req.body.metadata,
      changed_by: 'user'
    });

    res.json(newEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
