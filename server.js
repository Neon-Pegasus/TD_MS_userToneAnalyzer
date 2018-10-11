const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./database/index');
const { saveForNewUser } = require('./database/newUserUtils');
const { natLanAnalyze } = require('./watson/naturalLan');

const exampleDataSO = require('./exampleData/dataSO');

const app = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  const { username } = req.body;
  const data = req.body.SOAnswers || exampleDataSO;
  db.User.findOne({ where: { SOUsername: username } })
    .then((user) => {
      // user doesn't exist in db, save to db
      if (!user) {
        return saveForNewUser(username, data);
        // user exist in db, query db
      } if (user.dataValues.SOUsername) {
        res.send('true');
      }
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/', (req, res) => {
  natLanAnalyze('hello')
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      res.send('hello');
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
