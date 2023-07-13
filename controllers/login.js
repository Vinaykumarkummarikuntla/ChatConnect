require('dotenv').config()
const logger = require('../middleware/logger')
const signup = require('../models/signupmodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// TODO Generate a token for decrypting password
// secret key generated from ours linux-terminal
function generateAccessToken (id, mail, isPremiumUser) {
  return jwt.sign(
    { userId: id, mail, isPremiumUser },
    process.env.GENERATEACCESSTOKEN
  )
}

// TODO Login details validating
exports.logindetails = async (req, res, next) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const user = await signup.findOne({
      where: {
        email
      }
    })
    if (user) {
      console.log('Stored hashed password:', user.password)
      console.log('Entered password:', password)
      // comparing password current and stored password
      const isMatched = await bcrypt.compare(password, user.password)
      console.log('Password comparison result:', isMatched)

      if (isMatched) {
        // sending response back with token if user is authenticated
        res.status(200).json({
          msg: 'User logineed successfully',
          token: generateAccessToken(user.id, email, null)
        })
        console.log('Password is correct')
      } else {
        console.log('Password is incorrect')
        res.status(401).json({ error: 'User not authorized' })
      }
    } else {
      console.log('User is does not exist')
      res.status(404).json({ error: 'User is not found' })
    }
  } catch (err) {
    logger.error('An error occurred:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
