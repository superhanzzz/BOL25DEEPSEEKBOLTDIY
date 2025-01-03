const express = require('express');
const router = express.Router();
const { EntryParticipant } = require('../models');

// Add participant to entry
router.post('/', async (req, res) => {
  try {
    const participant = await EntryParticipant.create(req.body);
    res.status(201).json(participant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get participants for an entry
router.get('/', async (req, res) => {
  try {
    const { entry_id } = req.query;
    const participants = await EntryParticipant.findAll({
      where: { entry_id },
      include: [
        { association: 'participant' }
      ]
    });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
