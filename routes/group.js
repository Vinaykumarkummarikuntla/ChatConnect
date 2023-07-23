/* eslint-disable max-len */
const express = require('express');

const router = express.Router();

const groupController = require('../controllers/group');
const chatController = require('../controllers/chat');
const userAuthentication = require('../middleware/auth');

// create a group
router.post('/creategroup', userAuthentication.authenticate, groupController.creategroup);

// specific group messages
router.get('/groupchatdetails/:groupid', userAuthentication.authenticate, groupController.groupDetails);

// group names
router.get('/getgroupnames', userAuthentication.authenticate, groupController.getgroupnames);

// add user to group
router.post('/groups/addUser', userAuthentication.authenticate, groupController.addUserToGroup);

// group delete
router.delete('/groups/:groupId', userAuthentication.authenticate, groupController.deleteGroup);

// user removing from the group
router.delete('/group/:groupid/user/:username', userAuthentication.authenticate, groupController.groupDeleteUser);

module.exports = router;
