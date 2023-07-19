/* eslint-disable max-len */
const express = require('express');

const router = express.Router();

const groupController = require('../controllers/group');
const chatController = require('../controllers/chat');
const userAuthentication = require('../middleware/auth');

// create a group
router.post('/creategroup', userAuthentication.authenticate, groupController.creategroup);
// specific group messages
router.get('/groupchatdetails', userAuthentication.authenticate, chatController.getgroupchatdetails);

router.get('/getgroupnames', userAuthentication.authenticate, groupController.getgroupnames);

module.exports = router;
