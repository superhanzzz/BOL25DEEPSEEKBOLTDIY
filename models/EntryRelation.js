module.exports = (sequelize, DataTypes) => {
  const EntryRelation = sequelize.define('EntryRelation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    child_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    relation_type: DataTypes.STRING(50)
  }, {
    timestamps: true,
    createdAt: 'created_at'
  });

  EntryRelation.associate = models => {
    EntryRelation.belongsTo(models.Entry, { as: 'parent', foreignKey: 'parent_id' });
    EntryRelation.belongsTo(models.Entry, { as: 'child', foreignKey: 'child_id' });
  };

  return EntryRelation;
};
