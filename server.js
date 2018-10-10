const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./database/index');
const { natLanAnalyze } = require('./watson/naturalLan');

const exampleDataSO = require('./exampleData/dataSO');

const app = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  const { username } = req.body;
  const data = req.body.SOAnswers || exampleDataSO;
  let userId = null;
  db.User.findOrCreate({ where: { SOUsername: username } })
    .spread((user) => {
      return user.get({ plain: true });
    })
    .then((result) => {
      const answers = data.map((el) => {
        if (el !== '' || el !== ' ') {
          return {
            UserId: result.id,
            answer: el,
          };
        }
        return null;
      });
      userId = result.id;
      return db.Answers.bulkCreate(answers);
    })
    .then(() => {
      return db.Answers.findAll({ where: { UserId: userId }, attributes: ['id', 'answer'] });
    })
    .then((result) => {
      const promiseArray = [];
      for (let i = 0; i < result.length; i += 1) {
        if (result[i].answer) {
          promiseArray[result[i].id] = natLanAnalyze(result[i].answer);
        }
      }
      return Promise.all(promiseArray);
    })
    .then((values) => {
      console.log(JSON.stringify(values[0], null, 2));
      const saveToDB = [];
      for (let i = 0; i < values.length; i += 1) {
        const analysis = values[i];
        if (values[i]) {
          const object = {
            AnswerId: i,
            [analysis.sentiment.document.label]: analysis.sentiment.document.score,
            sadness: analysis.emotion.document.emotion.sadness,
            joy: analysis.emotion.document.emotion.joy,
            fear: analysis.emotion.document.emotion.fear,
            disgust: analysis.emotion.document.emotion.disgust,
            anger: analysis.emotion.document.emotion.anger,
          };
          saveToDB.push(object);
        }
      }
      return db.SOAnalysis.bulkCreate(saveToDB);
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  res.send('hihi');
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
