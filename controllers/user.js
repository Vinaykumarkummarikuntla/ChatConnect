const usersdata = require('../models/signupmodel');
const logger = require('../middleware/logger');


exports.getuserdetails = async (req, res, next) => {
  console.log('user function called');
  try {
    const userNames = await usersdata.findAll({attributes: ['username']});
    console.log(userNames);
    if (userNames.length == 0) {
      res.status(404).json({message: 'No User details '});
    } else {
      res.status(200).json({userDetails: userNames});
    }
  } catch (err) {
    logger.error('An error occurred:', err);
    res.status(500).json({message: 'Internal server error'});
  }
};
