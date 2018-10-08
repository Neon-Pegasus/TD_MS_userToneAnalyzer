const Sequelize = require('sequelize');
require('dotenv').config();

//  local connection
const sequelize = new Sequelize('userIBM', 'root', `${process.env.DB_password}`, {
  host: 'localhost',
  dialect: 'mysql',
});

//  cloud connection
// const sequelize = new Sequelize(``)

//  testing DB connection
sequelize
  .authenticate()
  .then(() => {
    console.log('DB connection established');
  })
  .catch((err) => {
    console.error('Unable to connect to DB', err);
  });

//  DB models
const User = sequelize.define('User', {
  githubUsername: {
    type: Sequelize.STRING,
  },
  SOUsername: {
    type: Sequelize.STRING,
  },
});

sequelize.sync();

module.exports.User = User;
