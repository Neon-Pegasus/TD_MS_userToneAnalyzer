const exampleData = require('../exampleData/newUserData');

const parsePolarity = (arr) => {
  const polarObj = {
    polarity: {
      labels: ['Neutral', 'Positive', 'Negative'],
      data: [],
    },
  };
  const object = {
    Neutral: 0,
    Positive: 0,
    Negative: 0,
  };
    // TODO: refactor schema for col names to have Capitalized First Letter
  arr.forEach((pol) => {
    if (typeof pol.neutral === 'number') {
      object.Neutral += 1;
    } else if (typeof pol.positive === 'number') {
      object.Positive += 1;
    } else if (typeof pol.negative === 'number') {
      object.Negative += 1;
    }
  });
  const { data } = polarObj.polarity;
  data.push(object.Neutral, object.Positive, object.Negative);
  return polarObj;
};

const parseData = (arr) => {
  return new Promise((resolve, reject) => {
    const polarity = parsePolarity(arr);
    resolve(polarity);
    reject(new Error('trouble parsing sentiment analysis'));
  });
};

module.exports.parseData = parseData;

const result = parseData(exampleData);
console.log(result);
