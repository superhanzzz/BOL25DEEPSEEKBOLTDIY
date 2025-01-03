const { Sequelize } = require('sequelize');
const { Entry, EntryRelation, EntryParticipant, MetricLog } = require('../models');

describe('Database Tests', () => {
  let sequelize;
  let testDbConfig = {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  };

  beforeAll(async () => {
    sequelize = new Sequelize(testDbConfig);
    
    // Initialize models
    Entry.init(sequelize);
    EntryRelation.init(sequelize);
    EntryParticipant.init(sequelize);
    MetricLog.init(sequelize);
    
    // Setup associations
    Entry.associate(sequelize.models);
    EntryRelation.associate(sequelize.models);
    EntryParticipant.associate(sequelize.models);
    MetricLog.associate(sequelize.models);
    
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('should create and retrieve an entry', async () => {
    const entry = await Entry.create({
      user_id: 1,
      entry_type: 'goal',
      title: 'Lose 5kg',
      description: 'Weight loss goal',
      status: 'active',
      metadata: { target: 5, unit: 'kg' }
    });
    
    const foundEntry = await Entry.findByPk(entry.id);
    expect(foundEntry.title).toBe('Lose 5kg');
    expect(foundEntry.metadata.target).toBe(5);
  });

  test('should create entry relationship', async () => {
    const goal = await Entry.create({
      user_id: 1,
      entry_type: 'goal',
      title: 'Improve fitness',
      status: 'active'
    });

    const task = await Entry.create({
      user_id: 1,
      entry_type: 'task',
      title: 'Run 5km',
      status: 'pending'
    });

    const relation = await EntryRelation.create({
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

  test('should track metric changes', async () => {
    const entry = await Entry.create({
      user_id: 1,
      entry_type: 'metric',
      title: 'Weight',
      metadata: { value: 80 }
    });

    // Create version 2
    await entry.update({ is_current: false });
    const newEntry = await Entry.create({
      ...entry.toJSON(),
      metadata: { value: 79.5 },
      version: 2,
      is_current: true
    });

    // Check metric log
    const logs = await MetricLog.findAll({
      where: { entry_id: entry.id }
    });

    expect(logs.length).toBe(1);
    expect(logs[0].old_value.value).toBe(80);
    expect(logs[0].new_value.value).toBe(79.5);
  });

  test('should manage participants', async () => {
    const event = await Entry.create({
      user_id: 1,
      entry_type: 'event',
      title: 'Morning Run',
      status: 'scheduled'
    });

    const participant = await Entry.create({
      user_id: 1,
      entry_type: 'person',
      title: 'John Doe'
    });

    const participation = await EntryParticipant.create({
      entry_id: event.id,
      participant_id: participant.id,
      role: 'running_partner'
    });

    const participants = await EntryParticipant.findAll({
      where: { entry_id: event.id },
      include: ['participant']
    });

    expect(participants.length).toBe(1);
    expect(participants[0].participant.title).toBe('John Doe');
  });
});
