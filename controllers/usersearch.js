const usersdata = require("../models/signupmodel");
const logger = require("../middleware/logger");
const { Op } = require("sequelize");

exports.getusersearchdetails = async (req, res, next) => {
  console.log("search function called")
  try {
    const userid = req.user.id;
    const username = req.query.username;
    console.log(username, "USERNAME ------------------------------------->");
    const data = await usersdata.findAll({
      where: {
        username: {
          [Op.like]: `%${username}%`,
        }
      },
    });

    const userSearchDetails = data.map(user => ({
      id: user.id,
      username: user.username,
    }));
    
    console.log("user serach DEtails  *********",userSearchDetails)
    if (data.length == 0) {
      res.status(404).json({ message: "User details not found" });
    } else {
      res.status(200).json({ usersearchdetails: userSearchDetails});
    }
  } catch (err) {
    logger.error("An error occurred:", err);
    res.status(500).json({ message: "Internal server error" });
    // console.error(err);
  }
};
