const express = require('express')

const router = express.Router()

const chatController = require('../controllers/chat')
const userAuthentication = require('../middleware/auth')

// signup
router.post('/chatdetails',userAuthentication.authenticate,chatController.chatdetails)


module.exports = router
