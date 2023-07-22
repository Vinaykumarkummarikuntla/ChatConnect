const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./signupmodel');
const Group = require('./groupmodel');

const GroupUser = sequelize.define('group_user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  role: {
    type: Sequelize.STRING,
  },
});

// Define the associations between GroupUser, User, and Group models
GroupUser.belongsTo(User, {foreignKey: 'id', onDelete: 'CASCADE'});
GroupUser.belongsTo(Group, {foreignKey: 'group_id', onDelete: 'CASCADE'});

module.exports = GroupUser;
