const message = require('../models/chatmodel');
const logger = require('../middleware/logger');

// TODO Chat details
exports.chatdetails = async (req, res, next) => {
  try {
    const msg = req.body.msg;
    const userid = req.user.id;
    // console.log('the storing msg details are ' + msg + ' and ' + userid)
    const data = await message.create({
      message: msg,
      userId: userid,
    });
    res.status(200).json({chatdetails: data});
  } catch (err) {
    logger.error('An error occurred:', err);
    // console.error(err);
  }
};

// TODO Get all chat messages
exports.getchatdetails = async (req, res, next) => {
  try {
    const userid = req.body.userid;
    const data = await message.findAll({
      where: {userId: userid},
    });
    res.status(200).json({chatdetails: data});
  } catch (err) {
    logger.error('An error occurred:', err);
  }
};


exports.getgroupchatdetails = async (req, res, next) => {
  try {
    const groupid = req.query.groupid;
    console.log('QUERYID', groupid);
    const data = await message.findAll({
      where: {groupId: groupid},
    });
    res.status(200).json({groupChatMessages: data});
  } catch (err) {
    logger.error('An error occurred:', err);
    // console.error(err);
  }
};
