const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const group = sequelize.define('groups', {
  group_id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },

  group_name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  group_description: {
    type: Sequelize.STRING,
    
  },  
  creator_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
})

module.exports = group
