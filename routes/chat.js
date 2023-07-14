const express = require('express')

const router = express.Router()

const chatController = require('../controllers/chat')
const userAuthentication = require('../middleware/auth')

// post messages 
router.post('/chatdetails',userAuthentication.authenticate,chatController.chatdetails)
// get messages
router.get ('/chatdetails',userAuthentication.authenticate,chatController.getchatdetails)



module.exports = router
