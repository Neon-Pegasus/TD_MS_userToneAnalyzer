const { User, Answers, SOAnalysis } = require('./index');
const { natLanAnalyze } = require('../watson/naturalLan');

function deleteInvalid(arr) {
  const data = arr.slice(0);
  for (let i = 0; i < data.length; i += 1) {
    // remove invalid answers
    if (data[i] === '' || data[i] === ' ' || !data[i]) {
      data.splice(i, 1);
    }
  }
  return data;
}

function analyzeLan(arr) {
  const answers = arr.slice(0);
  const promises = [];
  for (let i = 0; i < answers.length; i += 1) {
    const ans = answers[i].answer;
    promises.push(natLanAnalyze(ans));
  }
  return Promise.all(promises);
}

const parseLan = (answers, promises) => {
  return new Promise((resolve, reject) => {
    if (answers.length === promises.length) {
      const parsedAnswers = [];
      for (let i = 0; i < answers.length; i += 1) {
        const AnswerId = answers[i].id;
        const { label, score } = promises[i].sentiment.document;
        const {
          sadness, joy, fear, disgust, anger,
        } = promises[i].emotion.document.emotion;
        const dbObj = {
          AnswerId,
          [label]: score,
          sadness,
          joy,
          fear,
          disgust,
          anger,
        };
        parsedAnswers.push(dbObj);
      }
      resolve(SOAnalysis.bulkCreate(parsedAnswers));
    }
    reject(new Error('Analyzed Data does not match Answers'));
  });
};

const saveForNewUser = (username, answers) => {
  const validAnswers = deleteInvalid(answers);
  let UserId = null;
  let answersList = null;
  return User.create({ SOUsername: username })
    .then((user) => {
      UserId = user.get('id');
      return UserId;
    })
    .then((id) => {
      const mappedAnswers = validAnswers.slice(0).map((ans) => {
        return {
          UserId: id,
          answer: ans,
        };
      });
      return Answers.bulkCreate(mappedAnswers);
    })
    .then(() => {
      return Answers.findAll({ where: { UserId }, attributes: ['id', 'answer'] });
    })
    .then((result) => {
      answersList = result;
      return answersList;
    })
    .then(analyzeLan)
    .then((result) => {
      return parseLan(answersList, result);
    })
    .catch((err) => {
      return `error ${err.message}`;
    });
};

module.exports.saveForNewUser = saveForNewUser;
