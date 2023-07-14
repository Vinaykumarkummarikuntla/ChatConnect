const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const message = sequelize.define('messages', {
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
})

module.exports = message
