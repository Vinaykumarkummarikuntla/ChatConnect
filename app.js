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


app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'signup.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// app.use((req, res) => {
//   console.log('url', req.url)
//   res.sendFile(path.join(__dirname, `public/pages/${req.url}`))
// })

const loginandsignupRouter = require('./routes/signupandlogin')
const chatRouter = require('./routes/chat')

app.use(loginandsignupRouter)
app.use(chatRouter)

sequelize
  // .sync({ force: true })
  .sync()
  .then((response) => {
    // console.log(response)
    app.listen(3000)
  })
  .catch((err) => {
    console.log(err)
  })