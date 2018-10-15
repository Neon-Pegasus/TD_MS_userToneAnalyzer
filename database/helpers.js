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
  emoData.push(object.Sadness / len, object.Joy / len,
    object.Fear / len, object.Disgust / len, object.Anger / len);
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
  console.log('line 74 helpers.js', arr);
  return deleteInvalid(arr)
    .then(parseSentiment)
    .catch((err) => {
      return err;
    });
};

module.exports.parseData = parseData;
