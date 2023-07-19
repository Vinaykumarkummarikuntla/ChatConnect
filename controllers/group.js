const group = require('../models/groupmodel');
const logger = require('../middleware/logger');

// TODO Chat details
exports.creategroup = async (req, res, next) => {
  try {
    const groupname = req.body.groupname;
    const userid = req.user.id;

    const data = await group.create({
      group_name: groupname,
      creator_id: userid,
    });
    res.status(200).json({groupdetails: data});
  } catch (err) {
    logger.error('An error occurred:', err);
    // console.error(err);
  }
};


// TODO Chat details
exports.getgroupnames = async (req, res, next) => {
  try {
    const groups = await group.findAll();
    const groupNames = groups.map((group) => ({
      groupName: group.group_name,
      groupId: group.group_id,
    }));
    res.status(200).json({groupDetails: groupNames});
  } catch (err) {
    logger.error('An error occurred:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};
