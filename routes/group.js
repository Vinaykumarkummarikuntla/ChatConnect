const express = require('express')

const router = express.Router()

const creategroupController = require('../controllers/group')
const chatController = require('../controllers/chat')
const userAuthentication = require('../middleware/auth')

// create a group 
router.post('/creategroup',userAuthentication.authenticate,creategroupController.creategroup)
// specific group messages 
router.get('/groupchatdetails',userAuthentication.authenticate,chatController.getgroupchatdetails)


module.exports = router
