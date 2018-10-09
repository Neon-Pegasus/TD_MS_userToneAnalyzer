const NaturalLanguageUnderstanding = require('watson-developer-cloud/natural-language-understanding/v1');
const auth = require('./auth');

const naturalLanguage = new NaturalLanguageUnderstanding(auth.natural_language_understanding);

const natLanAnalyze = (text, cb) => {
  naturalLanguage.analyze({
    language: 'en',
    text,
    features: {
      sentiment: {},
      emotion: {},
    },
  }, (err, res) => cb(err, res));
};

module.exports.natLanAnalyze = natLanAnalyze;
