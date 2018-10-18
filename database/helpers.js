// const exampleData = require('../exampleData/newUserData');

const parseSentiment = (arr) => {
  const len = arr.length;
  const sentObj = {
    sentiment: {
      labels: ['Neutral', 'Positive', 'Negative'],
      data: [],
    },
  };
  const emoObj = {
    emotion: {
      labels: ['Sadness', 'Joy', 'Fear', 'Disgust', 'Anger'],
      data: [],
    },
  };
  const object = {
    Neutral: 0,
    Positive: 0,
    Negative: 0,
    Sadness: 0,
    Joy: 0,
    Fear: 0,
    Disgust: 0,
    Anger: 0,
  };
  // TODO: refactor schema for col names to have Capitalized First Letter
  arr.forEach((pol) => {
    if (pol.neutral || pol.negative || pol.positive) {
      if (pol.neutral) {
        object.Neutral += 1;
      } else if (pol.positive) {
        object.Positive += 1;
      } else if (pol.negative) {
        object.Negative += 1;
      }
    }
    object.Sadness += parseFloat(pol.sadness);
    object.Joy += parseFloat(pol.joy);
    object.Fear += parseFloat(pol.fear);
    object.Disgust += parseFloat(pol.disgust);
    object.Anger += parseFloat(pol.anger);
  });
  const { data } = sentObj.sentiment;
  const emoData = emoObj.emotion.data;
  data.push(object.Neutral, object.Positive, object.Negative);

  function floatNums(leng) {
    return function (num) {
      const avg = num / leng;
      return parseFloat((avg * 100).toFixed(2));
    };
  }

  const getAvg = floatNums(len);
  emoData.push(getAvg(object.Sadness), getAvg(object.Joy),
    getAvg(object.Fear), getAvg(object.Disgust), getAvg(object.Anger));
  return [sentObj, emoObj];
};

const deleteInvalid = (arr) => {
  return new Promise((resolve, reject) => {
    const mapArr = arr.map((ele) => {
      const data = ele.dataValues;
      if (data.positive && !data.negative && !data.neutral) {
        delete data.negative;
        delete data.neutral;
      } else if (data.negative && !data.positive && !data.neutral) {
        delete data.neutral;
        delete data.positive;
      } else if (data.neutral && !data.positive && !data.negative) {
        delete data.negative;
        delete data.positive;
      }
      return ele.dataValues;
    });
    resolve(mapArr);
    reject(new Error('trouble parsing data'));
  });
};

const parseData = (arr) => {
  return deleteInvalid(arr)
    .then(parseSentiment)
    .catch((err) => {
      return err;
    });
};

const retrieveCommentBody = (username, arr) => {
  const copy = arr.slice(0);
  const output = copy.filter((item) => {
    return item.userName === username && item.commentsBody.length
    && item.commentsBody[0].length >= 10;
  }).reduce((acc, cv) => {
    return acc.concat(cv.commentsBody);
  }, []);
  return output;
};

module.exports.retrieveCommentBody = retrieveCommentBody;
module.exports.parseData = parseData;
