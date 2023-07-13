const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// const morgan = require('morgan')
require('dotenv').config()

const sequelize = require('./util/database')

const app = express()


app.use(cors())
// app.use(helmet())
// app.use(morgan('combined', { stream: accessLogStream }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '/public')))

const loginandsignupRouter = require('./routes/signupandlogin')

app.use(loginandsignupRouter)

sequelize
  // .sync({ force: true })
  .sync()
  .then((response) => {
    console.log(response)
    app.listen(3000)
  })
  .catch((err) => {
    console.log(err)
  })