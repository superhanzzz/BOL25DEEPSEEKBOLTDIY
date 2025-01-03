const express = require('express');
const router = express.Router();
const { MetricLog } = require('../models');

// Get metric history for an entry
router.get('/:entry_id/history', async (req, res) => {
  try {
    const logs = await MetricLog.findAll({
      where: { entry_id: req.params.entry_id },
      order: [['changed_at', 'DESC']]
    });
    
    res.json({
      entry_id: req.params.entry_id,
      history: logs.map(log => ({
        version: log.id,
        metadata: log.new_value,
        changed_at: log.changed_at,
        changed_by: log.changed_by
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
