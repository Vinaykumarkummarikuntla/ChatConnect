const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const signup = sequelize.define('signup', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phonenumber: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true, // Ensure email is unique
    validate: {
      isEmail: {
        msg: 'Invalid email format',
      },
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [8, 100], // Password must be between 8 and 100 characters long
        msg: 'Password must be between 8 and 100 characters',
      },
      isStrongPassword: {
        args: {
          minLength: 8, // Minimum password length
          minLowercase: 1, // Minimum number of lowercase letters
          minUppercase: 1, // Minimum number of uppercase letters
          minNumbers: 1, // Minimum number of digits
          minSymbols: 1, // Minimum number of symbols
        },
        msg: 'Password must be strong',
      },
    },
  },
});

module.exports = signup;
