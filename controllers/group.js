/* eslint-disable max-len */
const group = require('../models/groupmodel');
const logger = require('../middleware/logger');
const groupUser = require('../models/groupuser');
const User = require('../models/signupmodel');

// TODO CREAATE GROUP
exports.creategroup = async (req, res, next) => {
  try {
    const groupId = req.body.groupId;


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


// TODO GET GROUP NAMES
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

// TODO ADDING USER TO GROP
exports.addUserToGroup = async (req, res, next) => {
  try {
    const {username, userId, groupId} = req.body.user;
    console.log('EXTRACTED USERNAME AND ID', username, userId, groupId);
    const data = await groupUser.create({
      role: 'member', // Assuming you want to add the user as a member role
      id: userId, // Using the correct column name for the foreign key in the GroupUser model
      group_id: groupId, // Using the correct column name for the foreign key in the GroupUser model
    });
    res.status(200).json({groupdetails: data});
  } catch (err) {
    logger.error('An error occurred:', err);
    res.status(500).json({error: 'Internal server error'});
    // console.error(err);
  }
};

// TODO DELETE GROUP NAME
exports.deleteGroup = async (req, res, next) => {
  try {
    const groupid = req.params.groupId;
    console.log('delete group id ', groupid);
    // Assuming you have a method in your 'groupmodel' to delete a group by its ID
    const deletedGroup = await group.destroy({
      where: {group_id: groupid},
    });

    if (!deletedGroup) {
      return res.status(404).json({error: 'Group not found'});
    }
    res.status(200).json({message: 'Group deleted successfully'});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
};

// TODO GROUP DETAILS
exports.groupDetails = async (req, res, next) => {
  try {
    const groupId = req.params.groupid;
    console.log('backend getted delete group user id', groupId);
    const groupInformation = await group.findByPk(groupId);
    console.log(groupInformation, 'groupInformation----------------------');


    // Find the associated userIds from the group_user table
    const groupUsers = await groupUser.findAll({
      where: {id: groupId},
    });
    console.log(groupUsers, 'groupUSERS WHO ARE THE PART OF THE GROUP ----------------------');

    // Get an array of userIds from the groupUsers
    const userIds = groupUsers.map((groupUser) => groupUser.id);
    console.log(userIds, 'SPECIFIC USERS WHO ARE THE PART OF THE GROUP ----------------------');

    // Find the usernames of the associated users from the users table
    const users = await User.findAll({
      where: {id: userIds},
    });

    // Map the users to get only the usernames
    const usernames = users.map((user) => user.username);
    console.log('USERNAMES WHO ARE THE PART OF GROUP', usernames);

    res.status(200).json({groupDetails: groupInformation, groupMembers: usernames});
  } catch (err) {
    logger.error('An error occurred:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};


// TODO DELETE USER FROM THE GROUP
exports.groupDeleteUser = async (req, res, next) => {
  try {
    const {username, groupid} = req.params;
    console.log('backend getted group delete userd id is &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& ', username, groupid);
    // Find the associated userIds from the group_user table
    const userDetails = await User.findAll({
      where: {username: username},
    });

    const userIds = userDetails.map((user) => user.id);
    console.log('delete user id++++++++++++++++++++++++++', userIds);
    const groupMemberDelete = await groupUser.destroy({
      where: {id: userIds, group_id: groupid},
    });
    console.log(groupMemberDelete, 'groupMemberDelete WHO ARE THE PART OF THE GROUP ----------------------');
    res.status(200).json({message: 'successfully user removed from the group'});
  } catch (err) {
    logger.error('An error occurred:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};
