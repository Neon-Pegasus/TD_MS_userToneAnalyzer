const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./database/index');
const NaturalLanguageUnderstanding = require('watson-developer-cloud/natural-language-understanding/v1');
const auth = require('./watson/auth');

const naturalLanguage = new NaturalLanguageUnderstanding(auth.natural_language_understanding);

const myText = 'hello IBM watson';
// const myText = require('./exampleData/dataSO');

/* naturalLanguage.analyze({
  language: 'en',
  text: myText,
  features: {
    sentiment: {},
    emotion: {},
  },
}, (err, res) => {
  if (err) {
    console.log('err:', err);
  } else {
    console.log(JSON.stringify(res, null, 2));
  }
}); */

const app = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  // db.User();
  res.send('hello');
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
