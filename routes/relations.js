const express = require('express');
const router = express.Router();
const { EntryRelation } = require('../models');

// Create new relationship
router.post('/', async (req, res) => {
  try {
    const relation = await EntryRelation.create(req.body);
    res.status(201).json(relation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get relationships for an entry
router.get('/', async (req, res) => {
  try {
    const { entry_id } = req.query;
    const relations = await EntryRelation.findAll({
      where: {
        [Op.or]: [
          { parent_id: entry_id },
          { child_id: entry_id }
        ]
      },
      include: [
        { association: 'parent' },
        { association: 'child' }
      ]
    });
    res.json(relations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
