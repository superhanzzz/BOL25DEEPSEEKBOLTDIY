module.exports = (sequelize, DataTypes) => {
  const MetricLog = sequelize.define('MetricLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    entry_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    change_type: DataTypes.STRING(50),
    old_value: DataTypes.JSONB,
    new_value: DataTypes.JSONB,
    changed_by: DataTypes.STRING(100)
  }, {
    timestamps: true,
    createdAt: 'changed_at'
  });

  MetricLog.associate = models => {
    MetricLog.belongsTo(models.Entry, { foreignKey: 'entry_id' });
  };

  return MetricLog;
};
