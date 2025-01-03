
module.exports = (sequelize, DataTypes) => {
  const AICommunication = sequelize.define('AICommunication', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    director_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    message_type: {
      type: DataTypes.ENUM('user', 'ai'),
      allow