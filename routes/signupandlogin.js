const express = require('express')

const router = express.Router()

const loginController = require('../controllers/login')
const signupController = require('../controllers/signup')

// signup
router.post('/signupdetails', signupController.signupdetails)
// login
router.post('/logindetails', loginController.logindetails)

module.exports = router
