module.exports = (sequelize, DataTypes) => {
  const Entry = sequelize.define('Entry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    entry_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: DataTypes.TEXT,
    status: DataTypes.STRING(50),
    metadata: DataTypes.JSONB,
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    is_current: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Entry.associate = models => {
    Entry.hasMany(models.EntryRelation, { as: 'relations_parent', foreignKey: 'parent_id' });
    Entry.hasMany(models.EntryRelation, { as: 'relations_child', foreignKey: 'child_id' });
    Entry.hasMany(models.EntryParticipant, { as: 'participants' });
    Entry.hasMany(models.MetricLog, { as: 'metric_logs' });
  };

  return Entry;
};
