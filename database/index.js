const Sequelize = require('sequelize');
require('dotenv').config();

//  local connection
// const sequelize = new Sequelize('userIBM', 'root', `${process.env.DB_password}`, {
//   host: 'localhost',
//   dialect: 'mysql',
// });

//  cloud connection
const sequelize = new Sequelize(`${process.env.CLEARDB_DATABASE_URL}`);

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
    get() {
      return this.get('id');
    },
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
    type: Sequelize.DECIMAL(10, 7),
  },
  negative: {
    type: Sequelize.DECIMAL(10, 7),
  },
  neutral: {
    type: Sequelize.DECIMAL,
  },
  sadness: {
    type: Sequelize.DECIMAL(10, 7),
  },
  joy: {
    type: Sequelize.DECIMAL(10, 7),
  },
  fear: {
    type: Sequelize.DECIMAL(10, 7),
  },
  disgust: {
    type: Sequelize.DECIMAL(10, 7),
  },
  anger: {
    type: Sequelize.DECIMAL(10, 7),
  },
});

const GHAnalysis = sequelize.define('GHAnalysis', {
  positive: {
    type: Sequelize.DECIMAL(10, 7),
  },
  negative: {
    type: Sequelize.DECIMAL(10, 7),
  },
  neutral: {
    type: Sequelize.DECIMAL,
  },
  sadness: {
    type: Sequelize.DECIMAL(10, 7),
  },
  joy: {
    type: Sequelize.DECIMAL(10, 7),
  },
  fear: {
    type: Sequelize.DECIMAL(10, 7),
  },
  disgust: {
    type: Sequelize.DECIMAL(10, 7),
  },
  anger: {
    type: Sequelize.DECIMAL(10, 7),
  },
});

User.hasMany(Answers);
User.hasMany(GHAnalysis);
Answers.hasOne(SOAnalysis);

// sequelize.sync({ force: true });
sequelize.sync({ force: false });


module.exports.User = User;
module.exports.Answers = Answers;
module.exports.SOAnalysis = SOAnalysis;
module.exports.GHAnalysis = GHAnalysis;
