const bcrypt = require('bcrypt')
const signup = require('../models/signupmodel')
const logger = require('../middleware/logger')

// TODO Signup details
exports.signupdetails = async (req, res, next) => {
  try {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const phonenumber = req.body.phonenumber
    console.log('the storing details are ' + username + ' and ' + email)

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    // password hashing
    const hashedPassword = await bcrypt.hash(password, salt)
    // console.log('hashedpassword', hashedPassword)

    const data = await signup.create({
      username,
      email,
      password: hashedPassword,
      phonenumber
    })
    res.status(200).json({ signupdetails: data })
  } catch (err) {
    logger.error('An error occurred:', err)
    // console.error(err);
  }
}
