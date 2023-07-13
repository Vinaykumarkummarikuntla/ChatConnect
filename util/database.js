require('dotenv').config()
const path = require('path')
const fs = require('fs')
const Sequelize = require('sequelize')

// TODO Database Connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_LOCALHOST
})
console.log('DB CONNECTED')
module.exports = sequelize
