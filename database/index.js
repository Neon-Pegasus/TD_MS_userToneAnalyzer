const Sequelize = require('sequelize');
require('dotenv').config();

//  local connection
const sequelize = new Sequelize('userIBM', 'root', `${process.env.DB_password}`, {
  host: 'localhost',
  dialect: 'mysql',
});

//  cloud connection
// const sequelize = new Sequelize(`${process.env.CLEARDB_DATABASE_URL}`);

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

const Answers = sequelize.define('Answers', {
  answer: {
    type: Sequelize.TEXT('long'),
  },
});

const SOAnalysis = sequelize.define('SOAnalysis', {
  positive: {
    type: Sequelize.DECIMAL,
  },
  negative: {
    type: Sequelize.DECIMAL,
  },
  neutral: {
    type: Sequelize.DECIMAL,
  },
});

User.hasMany(Answers);
Answers.hasOne(SOAnalysis);

sequelize.sync({ force: true });

module.exports.User = User;
module.exports.Answers = Answers;
module.exports.SOAnalysis = SOAnalysis;
