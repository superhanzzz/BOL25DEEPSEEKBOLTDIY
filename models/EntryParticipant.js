module.exports = (sequelize, DataTypes) => {
  const EntryParticipant = sequelize.define('EntryParticipant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    entry_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    participant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: DataTypes.STRING(50)
  }, {
    timestamps: true,
    createdAt: 'created_at'
  });

  EntryParticipant.associate = models => {
    EntryParticipant.belongsTo(models.Entry, { as: 'entry', foreignKey: 'entry_id' });
    EntryParticipant.belongsTo(models.Entry, { as: 'participant', foreignKey: 'participant_id' });
  };

  return EntryParticipant;
};
