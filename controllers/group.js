const message = require('../models/groupmodel')
const logger = require('../middleware/logger')

// TODO Chat details
exports.creategroup = async (req, res, next) => {
  try {
    const groupname = req.body.groupname
    const userid = req.user.id

    const data = await message.create({
        group_name: groupname,
        creator_id: userid
     })
    res.status(200).json({ groupdetails: data })
  } catch (err) {
    logger.error('An error occurred:', err)
    // console.error(err);
  }
}