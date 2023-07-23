const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');
const userAuthentication = require('../middleware/auth');

router.get('/users', userAuthentication.authenticate, userController.getuserdetails);

module.exports = router;
