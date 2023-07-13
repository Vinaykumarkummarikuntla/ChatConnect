const express = require('express')

const router = express.Router()

// const loginController = require('../controllers/login')
const signupController = require('../controllers/signup')

// login
router.post('/signupdetails', signupController.signupdetails)
// signup
// router.post('/logindetails', loginController.logindetails)

module.exports = router
