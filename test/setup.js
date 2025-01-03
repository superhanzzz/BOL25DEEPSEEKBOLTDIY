const { Sequelize } = require('sequelize');
const { Entry, EntryRelation, EntryParticipant, MetricLog } = require('../models');

const testDbConfig = {
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
};

const setupTestDB = async () => {
  const sequelize = new Sequelize(testDbConfig);
  
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
  return sequelize;
};

module.exports = setupTestDB;
