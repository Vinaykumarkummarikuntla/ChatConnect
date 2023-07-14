const message = require('../models/chatmodel')
const logger = require('../middleware/logger')

// TODO Chat details
exports.chatdetails = async (req, res, next) => {
  try {
    const msg = req.body.msg
    const userid = req.user.id
    console.log('the storing msg details are ' + msg + ' and ' + userid)

    const data = await message.create({
        message: msg,
        userId: userid })
    res.status(200).json({ chatdetails: data })
  } catch (err) {
    logger.error('An error occurred:', err)
    // console.error(err);
  }
}
