const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./database/index');
const { saveForNewUser } = require('./database/newUserUtils');
const { queryForUser } = require('./database/oldUserUtils');
const { parseData } = require('./database/helpers');

const app = express();
const port = process.env.PORT || 4654;

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  const { username } = req.body;
  const data = req.body.SOAnswers;
  db.User.findOne({ where: { SOUsername: username } })
    .then((user) => {
      // user doesn't exist in db, save to db
      if (!user) {
        return saveForNewUser(username, data);
        // user exist in db, query db
      } if (user.dataValues.SOUsername) {
        return queryForUser(user.dataValues);
      }
      return new Error('Cannot find or create user in DB');
    })
    .then(parseData)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get('/', (req, res) => {
  res.send('hello microservice');
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
