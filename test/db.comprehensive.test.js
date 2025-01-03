const { Sequelize } = require('sequelize');
const setupTestDB = require('./setup');
const { Entry, EntryRelation, EntryParticipant, MetricLog } = require('../models');

describe('Comprehensive Database Tests', () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = await setupTestDB();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Schema Validation', () => {
    test('should create all tables with correct columns', async () => {
      const tables = await sequelize.query(
        "SELECT name FROM sqlite_master WHERE type='table'"
      );
      
      expect(tables[0].map(t => t.name)).toEqual(
        expect.arrayContaining([
          'entries',
          'entry_relations',
          'entry_participants',
          'metric_logs'
        ])
      );
    });

    test('should enforce required fields', async () => {
      await expect(Entry.create({})).rejects.toThrow();
    });
  });

  describe('Relationship Integrity', () => {
    let goal, task;

    beforeAll(async () => {
      goal = await Entry.create({
        user_id: 1,
        entry_type: 'goal',
        title: 'Career Growth',
        status: 'active'
      });

      task = await Entry.create({
        user_id: 1,
        entry_type: 'task',
        title: 'Complete Certification',
        status: 'pending'
      });
    });

    test('should maintain parent-child relationships', async () => {
      await EntryRelation.create({
        parent_id: goal.id,
        child_id: task.id,
        relation_type: 'supports'
      });

      const relations = await EntryRelation.findAll({
        where: { parent_id: goal.id }
      });

      expect(relations.length).toBe(1);
      expect(relations[0].child_id).toBe(task.id);
    });

    test('should cascade delete relationships', async () => {
      await goal.destroy();
      const relations = await EntryRelation.findAll({
        where: { parent_id: goal.id }
      });
      expect(relations.length).toBe(0);
    });
  });

  describe('Versioning System', () => {
    let originalEntry;

    beforeAll(async () => {
      originalEntry = await Entry.create({
        user_id: 1,
        entry_type: 'metric',
        title: 'Weight',
        metadata: { value: 80 }
      });
    });

    test('should create new versions correctly', async () => {
      await originalEntry.update({ is_current: false });
      const newEntry = await Entry.create({
        ...originalEntry.toJSON(),
        metadata: { value: 79.5 },
        version: 2,
        is_current: true
      });

      const versions = await Entry.findAll({
        where: { id: originalEntry.id },
        order: [['version', 'ASC']]
      });

      expect(versions.length).toBe(2);
      expect(versions[0].metadata.value).toBe(80);
      expect(versions[1].metadata.value).toBe(79.5);
    });

    test('should maintain version history in metric logs', async () => {
      const logs = await MetricLog.findAll({
        where: { entry_id: originalEntry.id }
      });

      expect(logs.length).toBe(1);
      expect(logs[0].old_value.value).toBe(80);
      expect(logs[0].new_value.value).toBe(79.5);
    });
  });

  describe('Data Consistency', () => {
    test('should maintain referential integrity', async () => {
      await expect(
        EntryRelation.create({
          parent_id: 9999,
          child_id: 8888,
          relation_type: 'supports'
        })
      ).rejects.toThrow();
    });

    test('should prevent duplicate current versions', async () => {
      const entry = await Entry.create({
        user_id: 1,
        entry_type: 'goal',
        title: 'Test Goal',
        is_current: true
      });

      await expect(
        Entry.create({
          ...entry.toJSON(),
          version: 2,
          is_current: true
        })
      ).rejects.toThrow();
    });
  });

  describe('Performance with Sample Data', () => {
    const NUM_ENTRIES = 1000;
    const NUM_RELATIONS = 500;

    test('should handle bulk operations efficiently', async () => {
      // Create sample entries
      const entries = Array.from({ length: NUM_ENTRIES }, (_, i) => ({
        user_id: 1,
        entry_type: i % 2 === 0 ? 'goal' : 'task',
        title: `Entry ${i}`,
        status: 'active'
      }));

      const createdEntries = await Entry.bulkCreate(entries);
      
      // Create sample relations
      const relations = Array.from({ length: NUM_RELATIONS }, (_, i) => ({
        parent_id: createdEntries[i].id,
        child_id: createdEntries[i + 1].id,
        relation_type: 'supports'
      }));

      await EntryRelation.bulkCreate(relations);

      // Verify counts
      const entryCount = await Entry.count();
      const relationCount = await EntryRelation.count();
      
      expect(entryCount).toBe(NUM_ENTRIES);
      expect(relationCount).toBe(NUM_RELATIONS);
    });
  });
});
