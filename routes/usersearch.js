const express = require('express')

const router = express.Router()

const userSearchController = require('../controllers/usersearch')
const userAuthentication = require('../middleware/auth')

console.log("router function called")

// post messages 
router.get('/userSearch',userAuthentication.authenticate,userSearchController.getusersearchdetails)




module.exports = router
