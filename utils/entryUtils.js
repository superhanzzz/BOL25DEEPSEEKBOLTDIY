const { Entry, MetricLog } = require('../models');

async function createEntryVersion(entryId, newData) {
  const currentEntry = await Entry.findByPk(entryId);
  if (!currentEntry) {
    throw new Error('Entry not found');
  }

  // Deactivate current version
  await currentEntry.update({ is_current: false });

  // Create new version
  const newEntry = await Entry.create({
    ...newData,
    version: currentEntry.version + 1,
    is_current: true
  });

  // Log the change
  await MetricLog.create({
    entry_id: currentEntry.id,
    user_id: currentEntry.user_id,
    change_type: 'update',
    old_value: currentEntry.metadata,
    new_value: newData.metadata,
    changed_by: 'user'
  });

  return newEntry;
}

async function getEntryHistory(entryId) {
  const logs = await MetricLog.findAll({
    where: { entry_id: entryId },
    order: [['changed_at', 'DESC']]
  });

  return logs.map(log => ({
    version: log.id,
    metadata: log.new_value,
    changed_at: log.changed_at,
    changed_by: log.changed_by
  }));
}

module.exports = {
  createEntryVersion,
  getEntryHistory
};
