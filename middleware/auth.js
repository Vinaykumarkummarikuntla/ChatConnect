const jwt = require('jsonwebtoken');
const User = require('../models/signupmodel');
require('dotenv').config();

// TODO setting up middle to authenticate user
exports.authenticate = async (req, res, next) => {
  try {
    const secretkey = process.env.GENERATEACCESSTOKEN;
    const token = await req.header('Authorization');

    const user = jwt.verify(token, secretkey);

    User.findByPk(user.userId)
        .then((user) => {
          console.log(JSON.stringify(user));
          // ! important setting whole user as to access all
          req.user = user;
          next();
        })
        .catch((err) => {
          console.log(err);
        });
  } catch (err) {
    console.log(err);
    return res.status(401).json({message: false});
  }
};
