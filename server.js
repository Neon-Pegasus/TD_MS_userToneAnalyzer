const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./database/index');
const { natLanAnalyze } = require('./watson/naturalLan');

const app = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

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
